import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server"; 
import { NextResponse } from "next/server";

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * @api {post} /api/Chat/delete
 * @apiName DeleteChat
 * @apiGroup Chat
 * @apiDescription Deletes a chat by id
 * @apiParam {string} chat_id Chat id
 * @apiSuccess (200) {object} result
 * @apiSuccess (200) {bool} result.success If true, the chat was deleted successfully
 * @apiSuccess (200) {string} result.message Success message
 * @apiError (400) {object} result
 * @apiError (400) {bool} result.success If false, the chat was not deleted
 * @apiError (400) {string} result.error Error message
 */
/*******  a8d0df62-fd97-4ae9-b4aa-95fdb2160afa  *******/// app/api/Chat/get/route.js
import { corsHeaders } from "@/utils/cors";

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    const { chat_id } = await req.json(); //

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { headers: corsHeaders() }
      );
    }

    await connectDB();

  
    await Chat.deleteOne({ _id: chat_id, userId });

    return NextResponse.json(
      { success: true, message: "Chat deleted successfully" },
      { headers: corsHeaders() }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { headers: corsHeaders() }
    );
  }
}
