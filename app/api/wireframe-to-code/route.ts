// API for wireframe to code route

import { db } from "@/configs/db";
import { usersTable, wireframeToCodeTable } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { imageUrl, aiModel, description, uid, email } = await req.json();

  // We want to check the user credits and if it is less than 1 then return error
  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  console.log("user: ", user);

  if (user && user.length > 0 && user[0]?.credits && user[0]?.credits < 1) {
    return NextResponse.json({ error: "You have no credits" }, { status: 403 });
  }

  // Insert the wireframe to code, and update the user credits
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

  // Update the user credits
  if (user[0]?.credits !== undefined && user[0]?.credits !== null) {
    const updatedUser = await db
      .update(usersTable)
      .set({
        credits: user[0].credits - 1,
      })
      .where(eq(usersTable.email, email))
      .returning({ id: usersTable.id });
    console.log("updatedUser: ", updatedUser);
  }

  return NextResponse.json({ result: result }, { status: 201 });
}

// API for getting a wireframe using uid
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams?.get("uid");

  // I want to fetch the record based on email to display the all wireframes
  const email = searchParams?.get("email");

  console.log("uid: ", uid);
  console.log("email: ", email);

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
  } else if (email) {
    const result = await db
      .select()
      .from(wireframeToCodeTable)
      .where(eq(wireframeToCodeTable.createdBy, email));

    return NextResponse.json(result, { status: 200 });
  }

  return NextResponse.json({ error: "No record found" }, { status: 404 });
}

// API for save the generated code to database
export async function PUT(req: NextRequest) {
  const { uid, codeResponse } = await req.json();

  const result = await db
    .update(wireframeToCodeTable)
    .set({
      code: codeResponse,
    })
    .where(eq(wireframeToCodeTable.uid, uid))
    .returning({ uid: wireframeToCodeTable.uid });

  return NextResponse.json(result);
}
