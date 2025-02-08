// API for wireframe to code route

import { db } from "@/configs/db";
import { wireframeToCodeTable } from "@/configs/schema";
import { eq } from "drizzle-orm";
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

// API for getting a wireframe using uid
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams?.get("uid");

  console.log("uid: ", uid);

  if (uid) {
    const result = await db
      .select()
      .from(wireframeToCodeTable)
      .where(eq(wireframeToCodeTable.uid, uid));

    console.log("result: ", result[0]);

    if (result.length === 0) {
      return NextResponse.json({ error: "No record found" }, { status: 404 });
    }

    return NextResponse.json(result[0], { status: 200 });
  }

  return NextResponse.json({ error: "No record found" }, { status: 404 });
}
