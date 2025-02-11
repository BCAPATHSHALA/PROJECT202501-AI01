export const AiModelList = [
  {
    name: "Gemini Google",
    icon: "/google.png",
    modelName: "google/gemini-2.0-pro-exp-02-05:free",
  },
  {
    name: "Llama by Meta",
    icon: "/meta.png",
    modelName: "meta-llama/llama-3.2-90b-vision-instruct:free",
  },
  {
    name: "Deepseek",
    icon: "/deepseek.png",
    modelName: "deepseek/deepseek-r1-distill-llama-70b:free",
  },
];

// @ts-ignore
// Todo: Make this prompt for sandpack based on ai model

// This prompt is for generating React.Js Code for Uploading Wireframe or Design Image URL With Tailwind CSS
export const prompt1 = `
Generate Code for Uploading Wireframe or Design Image URL With Tailwind CSS & React.Js

Return only the code without any explanation. And Response in JSON format with the following schema:
{
  "files": {
    "/App.js": {
      "code": "..."
      },
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tailwindcss": "^3.2.7",
    "autoprefixer": "^10.4.13",
    "postcss": "^8.4.21",
  }
}


I want to generate code for uploading wireframe or design image URL with Tailwind CSS and React.Js. The code should be minimal and easy to understand.

Code should be fully responsive for all screen sizes and should fit into a single file without any dependencies or external libraries other than Tailwind CSS and React.Js.
`;

export const DEPENDANCIES = {
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "tailwindcss": "^3.2.7",
  "autoprefixer": "^10.4.13",
  "postcss": "^8.4.21",
};
