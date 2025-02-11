import { NextRequest, NextResponse } from "next/server";
import OpenAi from "openai";
import { AiModelList } from "@/data/Constants";

const openai = new OpenAi({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, aiModel, description } = await req.json();

    // Get the model name
    const modelObj = AiModelList.find((model) => model.name === aiModel);
    const modelName =
      modelObj?.modelName || "google/gemini-2.0-pro-exp-02-05:free";

    // Generate AI response
    const response = await openai.chat.completions.create({
      model: modelName,
      stream: true,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: description },
            { type: "image_url", image_url: { url: imageUrl } },
          ],
        },
      ],
    });

    if (!response) {
      return NextResponse.json({ error: "Error generating code" });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const text = chunk.choices?.[0]?.delta?.content || "";
          controller.enqueue(encoder.encode(text)); // Send chunked data
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" });
  }
}
