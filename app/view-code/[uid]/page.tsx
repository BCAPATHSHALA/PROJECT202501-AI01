"use client";

import { prompt1 } from "@/data/Constants";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
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
  code: string;
  createdBy: string;
}

const page = () => {
  const { uid } = useParams();
  const [loading, setLoading] = useState(false);
  const [codeResponse, setCodeResponse] = useState<string>("");
  const [record, setRecord] = useState<RECORD | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    uid && getRecordInfo();
    return () => {};
  }, [uid]);

  const getRecordInfo = async () => {
    setLoading(true);
    const result = await axios.get<RECORD & { error?: string }>(
      `/api/wireframe-to-code?uid=${uid}`
    );

    if (result?.data?.error) {
      console.error(result?.data?.error);
      return;
    }

    console.log("Fetched Record:", result?.data);
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
      };
      generateCode(record);
    }
    setLoading(false);
  };

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

      let accumulatedText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder
          .decode(value, { stream: true })
          .replace("```typescript", "")
          .replace("```", "");

        accumulatedText += chunk;
        setCodeResponse(accumulatedText);
        console.log("chunk", chunk);
      }
    } catch (error) {
      console.error("Error generating code:", error);
    } finally {
      setLoading(false);
      setIsReady(true);
    }
  };

  return (
    <div>
      <AppHeader hideSidebar={true} />
      <div className="grid grid-cols-1 md:grid-cols-5 p-5 gap-10">
        {/* Selection Details */}
        <div>
          <SelectionDetails record={record} />
        </div>
        {/* Code Editor */}
        <div className="col-span-4">
          <CodeEditor codeResponse={codeResponse} isReady={isReady} />
        </div>
      </div>
    </div>
  );
};

export default page;
