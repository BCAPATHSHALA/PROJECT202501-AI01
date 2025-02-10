import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/configs/db";
import { usersTable } from "@/configs/schema";

export async function POST(req: NextRequest) {
  const { userEmail, userName } = await req.json();

  const result = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, userEmail));

  if (result?.length == 0) {
    const result: any = await db
      .insert(usersTable)
      .values({
        name: userName,
        email: userEmail,
        credits: 0,
      })
      .returning({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        credits: usersTable.credits,
      });

    return NextResponse.json(result[0]);
  }
  return NextResponse.json(result[0]);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams?.get("email");

  if (email) {
    const result = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    return NextResponse.json(result[0]);
  }

  return NextResponse.json({});
}
