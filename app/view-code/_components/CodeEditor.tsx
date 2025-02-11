"use client";
import React, { useState } from "react";
import {
  Sandpack,
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import { amethyst, nightOwl } from "@codesandbox/sandpack-themes";
import { DEPENDANCIES } from "@/data/Constants";

export const CodeEditor = ({ codeResponse, isReady }: any) => {
  // console.log("codeResponse", codeResponse);
  // console.log("isReady", isReady);

  const [activeTab, setActiveTab] = useState("code");
  // const [file, setFile] = useState(DEFAULT_FILE);

  return (
    <div>
      {!isReady ? (
        // While generating code render Sandpack (After - Yeh pahle wala logic tha 😉)
        <Sandpack
          theme={"light"}
          options={{
            externalResources: ["https://cdn.tailwindcss.com"],
            showNavigator: true,
            showTabs: true,
            editorHeight: 600,
          }}
          customSetup={{
            dependencies: {
              ...DEPENDANCIES,
            },
          }}
          files={{
            "/App.js": `${codeResponse}`,
          }}
          template="react"
        />
      ) : (
        // After generating code render Sandpack to preview (Before)
        <>
          <div className="bg-[#181818] w-full border p-2">
            <div className="flex text-white gap-2 justify-center items-center flex-wrap shrink-0 bg-black p-1 w-[140px] rounded-full">
              <h2
                onClick={() => setActiveTab("code")}
                className={`text-sm cursor-pointer ${
                  activeTab === "code" &&
                  "text-blue-500 bg-blue-500 bg-opacity-25 p-2 rounded-full"
                }`}
              >
                Code
              </h2>
              <h2
                onClick={() => setActiveTab("preview")}
                className={`text-sm cursor-pointer ${
                  activeTab === "preview" &&
                  "text-blue-500 bg-blue-500 bg-opacity-25 p-2 rounded-full"
                }`}
              >
                Preview
              </h2>
            </div>
          </div>
          <SandpackProvider
            template="react"
            theme={amethyst}
            files={{
              "/App.js": {
                code: `${codeResponse}`,
                active: true,
              },
            }}
            customSetup={{
              dependencies: {
                ...DEPENDANCIES,
              },
            }}
            options={{
              externalResources: ["https://cdn.tailwindcss.com"],
            }}
          >
            <SandpackLayout>
              {activeTab === "code" && (
                <>
                  <SandpackFileExplorer style={{ height: "80vh" }} />
                  <SandpackCodeEditor
                    showTabs={true}
                    style={{ height: "80vh" }}
                  />
                </>
              )}
              {activeTab === "preview" && (
                <>
                  <SandpackFileExplorer style={{ height: "80vh" }} />
                  <SandpackPreview
                    style={{ height: "80vh" }}
                    showNavigator={true}
                  />
                </>
              )}
            </SandpackLayout>
          </SandpackProvider>
        </>
      )}
    </div>
  );
};
