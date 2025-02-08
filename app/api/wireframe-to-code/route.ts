// API for wireframe to code route

import { db } from "@/configs/db";
import { wireframeToCodeTable } from "@/configs/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { imageUrl, aiModel, description, uid, email } = await req.json();

  const result = await db
    .insert(wireframeToCodeTable)
    .values({
      imageUrl,
      aiModel,
      description,
      uid,
      createdBy: email,
    })
    .returning({ id: wireframeToCodeTable.id });

  return NextResponse.json({ result: result }, { status: 201 });
}
