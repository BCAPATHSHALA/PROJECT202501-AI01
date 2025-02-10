import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/configs/db";
import { usersTable } from "@/configs/schema";


// API route for saving the user information to DB
export async function POST(req: NextRequest) {
  // Get data from user
  const { userEmail, userName, userAvatar } = await req.json();

  try {
    // Check if user is already registered
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, userEmail));

    // If user is new, register them in the database
    if (existingUser.length === 0) {
      const newUser = await db
        .insert(usersTable)
        .values({
          name: userName,
          email: userEmail,
          avatar: userAvatar,
          credits: 5,
        })
        .returning({
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
          avatar: usersTable.avatar,
          credits: usersTable.credits,
        });

      return NextResponse.json(newUser[0]);
    }

    // If user already exists, return the existing user
    return NextResponse.json(existingUser[0]);
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  try {
    if (email) {
      const user = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email));

      if (user.length > 0) {
        return NextResponse.json(user[0]);
      } else {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
    }

    return NextResponse.json(
      { error: "Email parameter is required" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error in GET request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
