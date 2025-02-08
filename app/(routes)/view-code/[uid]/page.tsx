"use client";

import { prompt1 } from "@/data/Constants";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface RECORD {
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

  useEffect(() => {
    uid && getRecordInfo();
    return () => {};
  }, [uid]);

  const getRecordInfo = async () => {
    setLoading(true);
    const result = await axios.get<RECORD & { error?: string }>(
      `/api/wireframe-to-code?uid=${uid}`
    );

    if (!result?.data?.code) {
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
    if (result?.data?.error) {
      console.error(result?.data?.error);
    }

    setLoading(false);
  };

  const generateCode = async (record: RECORD) => {
    setLoading(true);
    const response = await axios.post(
      "/api/ai-model",
      {
        imageUrl: record?.imageUrl,
        aiModel: record.aiModel,
        description: record?.description + ":" + prompt1,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response?.data?.error) {
      console.log("response", response);
      return;
    }

    const reader = response.data.body.getReader();
    const decoder = new TextDecoder("utf-8");

    while (true) {
      const { value, done } = await reader.read(); // read() returns Promise<{ value: Uint8Array, done: boolean }>
      if (done) break;
      const chunk = decoder
        .decode(value)
        .replace("```typescript", "")
        .replace("```", ""); // decode Uint8Array into string

      setCodeResponse((prev) => prev + chunk);
      console.log("chunk", chunk);
    }

    setLoading(false);
  };

  return (
    <div>
      <h1>View Code</h1>
      {loading && <LoaderCircle className="w-6 h-6 animate-spin" />}
      <p>{codeResponse}</p>
    </div>
  );
};

export default page;
