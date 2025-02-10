"use client";

import { prompt1 } from "@/data/Constants";
import axios from "axios";
import { Loader2, LoaderCircle } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { SelectionDetails } from "../_components/SelectionDetails";
import { CodeEditor } from "../_components/CodeEditor";
import AppHeader from "@/app/_components/AppHeader";

export interface RECORD {
  id: number;
  imageUrl: string;
  aiModel: string;
  description: string;
  code: { res: string } | null;
  createdBy: string;
  uid: string;
}

const page = () => {
  const { uid } = useParams();
  const [loading, setLoading] = useState(false);
  const [codeResponse, setCodeResponse] = useState<string>("");
  const [record, setRecord] = useState<RECORD | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    uid && getRecordInfo();
  }, [uid]);

  // Get the record
  const getRecordInfo = async () => {
    setLoading(true);

    try {
      const result = await axios.get<RECORD & { error?: string }>(
        `/api/wireframe-to-code?uid=${uid}`
      );

      if (result?.data?.error) {
        console.error(result?.data?.error);
        return;
      }

      // console.log("Fetched Record:", result?.data);
      setRecord(result.data);

      if (result?.data?.code === null) {
        // generate code if not found in db
        const record: RECORD = {
          id: result?.data?.id,
          imageUrl: result?.data?.imageUrl,
          aiModel: result?.data?.aiModel,
          description: result?.data?.description,
          code: result?.data?.code,
          createdBy: result?.data?.createdBy,
          uid: result?.data?.uid,
        };
        generateCode(record);
      } else {
        // set code if found in db
        setCodeResponse(result?.data?.code?.res);
        setIsReady(true);
      }
    } catch (error) {
      console.error("An error occurred while fetching the record:", error);
    } finally {
      setLoading(false);
    }
  };

  //  Generate the streaming code
  // If your API is actually streaming responses (like OpenAI's streaming API), then using fetch instead of Axios is necessary
  const generateCode = async (record: RECORD) => {
    setLoading(true);

    try {
      const response = await fetch("/api/ai-model", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: record?.imageUrl,
          aiModel: record?.aiModel,
          description: record?.description + ":" + prompt1,
        }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      // let accumulatedText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder
          .decode(value, { stream: true })
          .replace("```typescript", "")
          .replace("```", "");

        // accumulatedText += chunk;
        setCodeResponse((accumulatedText) => accumulatedText + chunk);
        console.log("chunk", chunk);
      }
    } catch (error) {
      console.error("Error generating code:", error);
    } finally {
      setLoading(false);
      setIsReady(true);
      // updateCodeToDB(); // Save the final code to the database
    }
  };

  // This updates the code in the database after the code is generated
  useEffect(() => {
    if (codeResponse !== "" && record?.uid && isReady) updateCodeToDB();
  }, [codeResponse && record && isReady]);

  // Save the generated code into the database
  const updateCodeToDB = async () => {
    if (!record?.uid || !codeResponse) return;

    try {
      const response = await axios.put("/api/wireframe-to-code", {
        uid: record.uid,
        codeResponse: { res: codeResponse },
      });
      console.log("Code saved to DB:", response.data);
    } catch (error) {
      console.error("Error saving code to DB:", error);
    }
  };

  return (
    <div>
      <AppHeader hideSidebar={true} />
      <div className="grid grid-cols-1 md:grid-cols-5 p-5 gap-10">
        {/* Selection Details */}
        <div>
          <SelectionDetails
            record={record}
            regenerateCode={getRecordInfo}
            isReady={isReady}
          />
        </div>
        {/* Code Editor */}
        <div className="col-span-4">
          {loading ? (
            <div>
              <h2 className="flex items-center justify-center bg-slate-100 h-[80vh] rounded-md font-bold text-2xl text-center p-20">
                <Loader2 className="animate-spin" /> Analyzing the wireframe
              </h2>
            </div>
          ) : (
            <CodeEditor codeResponse={codeResponse} isReady={isReady} />
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
