import connectDB from "@/config/db"; // ✅ Added missing import
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
// app/api/Chat/Rename/route.js
import { corsHeaders } from "@/utils/cors";

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}



export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { headers: corsHeaders() }
      );
    }

    const { chatId, name } = await req.json();
    await connectDB();

    await Chat.findOneAndUpdate({ _id: chatId, userId }, { name });

    return NextResponse.json(
      {
        success: true,
        message: "Chat renamed successfully",
      },
      { headers: corsHeaders() }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { headers: corsHeaders() }
    );
  }
}
