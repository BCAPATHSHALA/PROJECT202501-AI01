"use client";

import React from "react";
import Image from "next/image";
import { RECORD } from "../[uid]/page";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const SelectionDetails = ({ record }: { record: RECORD | null }) => {
  console.log("record-selection: ", record);

  if (!record) return <p>No record found</p>; // ✅ Handle null case

  return (
    record && (
      <div className="p-5 bg-gray-100 h-[80vh] rounded-lg">
        {/* Wireframe */}
        <h2 className="text-2xl font-bold my-2">Wireframe</h2>
        <Image
          src={record?.imageUrl || "/deepseek.png"}
          width={200}
          height={200}
          alt="Wireframe"
          className="object-contain rounded-l w-full h-[200px] p-2 border border-dashed"
        />

        {/* AI Model */}
        <h2 className="text-2xl font-bold mt-4">AI Model</h2>
        <Input
          defaultValue={record?.aiModel}
          disabled={true}
          className="bg-white"
        />

        {/* Description */}
        <h2 className="text-2xl font-bold mt-4">Description</h2>
        <Textarea
          defaultValue={record?.description}
          disabled={true}
          className="bg-white h-[200px]"
        />
      </div>
    )
  );
};
