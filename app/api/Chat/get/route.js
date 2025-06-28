import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { corsHeaders } from "@/utils/cors";

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401, headers: corsHeaders() }
      );
    }

    try {
      await connectDB();
    } catch (dbError) {
      console.error("Database connection failed:", dbError);
      return NextResponse.json(
        { success: false, message: "Database connection failed" },
        { status: 500, headers: corsHeaders() }
      );
    }

    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { success: false, message: "No database configured" },
        { status: 500, headers: corsHeaders() }
      );
    }

    const chats = await Chat.find({ userId });

    return NextResponse.json(
      { success: true, data: chats },
      { headers: corsHeaders() }
    );
  } catch (error) {
    console.error("Error in /api/Chat/get:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Unknown error" },
      { status: 500, headers: corsHeaders() }
    );
  }
}