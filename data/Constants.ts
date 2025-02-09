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

// Todo: Make this prompt for sandpack based on ai model
export const prompt1 =
  "Generate code in react and tailwindcss from this wireframe:";

export const DEPENDANCIES = {
  react: "18.2.0",
  "react-dom": "18.2.0",
};
