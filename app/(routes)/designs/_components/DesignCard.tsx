import { RECORD } from "@/app/view-code/[uid]/page";
import { Button } from "@/components/ui/button";
import { AiModelList } from "@/data/Constants";
import { Code } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const DesignCard = ({ wireframe }: { wireframe: RECORD | null }) => {
  const modelObj =
    wireframe && AiModelList.find((model) => model.name === wireframe?.aiModel);

  return (
    <div className="p-5 border rounded-lg">
      <Image
        src={wireframe?.imageUrl || "/deepseek.png"}
        width={300}
        height={200}
        alt="Wireframe"
        className="object-cover rounded-lg w-full h-[200px] p-2 border border-dashed bg-white"
      />
      <div className="mt-2">
        <h2 className="font-bold line-clamp-3 text-gray-400 text-sm">
          {wireframe?.description}
        </h2>
        <div className="mt-2 flex justify-between items-center">
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            {modelObj && (
              <>
                <Image
                  src={modelObj?.icon || "/deepseek.png"}
                  width={30}
                  height={30}
                  alt={modelObj?.name as string}
                />
                <h2>{modelObj?.name}</h2>
              </>
            )}
          </div>
          <Button className="mt-2">
            <Link href={`/view-code/${wireframe?.uid}`} className="flex gap-2">
              <Code />
              View Code
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DesignCard;
