// API for AI model route

import { NextRequest } from "next/server";
import OpenAi from "openai";
import { AiModelList } from "@/data/Constants";

const openai = new OpenAi({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: NextRequest) {
  const { imageUrl, aiModel, description } = await req.json();

  // Get model name from aiModel list
  const modelObj = AiModelList.find((model) => model.name === aiModel);
  const modelName = modelObj?.modelName;

  // Generate code from image and description
  const response = await openai.chat.completions.create({
    model: modelName || "google/gemini-2.0-pro-exp-02-05:free",
    stream: true,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: description,
          },
          {
            type: "image_url",
            image_url: {
              url: imageUrl,
            },
          },
        ],
      },
    ],
  });

  if (!response) {
    return new Response(JSON.stringify({ error: "Error generating code" }), {
      status: 500,
    });
  }

  // Create a readable stream to send the response in real time
  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of response) {
        const text = chunk.choices?.[0]?.delta?.content || "";
        controller.enqueue(new TextEncoder().encode(text)); // send data chunk
      }
      controller.close();
      // Todo: Update database with the generated code
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
