import React from "react";
import {
  Sandpack,
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
} from "@codesandbox/sandpack-react";
import { amethyst } from "@codesandbox/sandpack-themes";
import { DEPENDANCIES } from "@/data/Constants";

export const CodeEditor = ({ codeResponse, isReady }: any) => {
  return (
    <div>
      {isReady ? (
        // After code is generated render Sandpack to preview code
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
        // While code is generating render Sandpack to preview code (Streaming Text)
        <SandpackProvider
          template="react"
          theme={amethyst}
          files={{
            "/app.js": {
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
            <SandpackCodeEditor showTabs={true} style={{ height: "70vh" }} />
          </SandpackLayout>
        </SandpackProvider>
      )}
    </div>
  );
};
