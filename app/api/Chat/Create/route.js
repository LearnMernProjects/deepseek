import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server"; 
// app/api/Chat/Create/route.js
import { corsHeaders } from "@/utils/cors";
import { NextResponse } from "next/server";

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function POST(req) {
    try{
        const { userId } = getAuth(req);
        if (!userId) {
            return NextResponse.json(
              { success: false, message: "Unauthorized" },
              { headers: corsHeaders() }
            );
        }

        // Check if we have a database connection
        if (!process.env.MONGODB_URI) {
            // No database configured, return mock chat ID
            const mockChatId = "demo-chat-" + Date.now();
            return NextResponse.json(
              { 
                success: true, 
                message: "Demo chat created (no database)",
                chatId: mockChatId
              },
              { headers: corsHeaders() }
            );
        }

        const chatData = {
            userId, 
            messages: [],
            name: "New Chat",
        };
        await connectDB();
        const newChat = await Chat.create(chatData);
        return NextResponse.json(
          { 
            success: true, 
            message: "Chat created successfully",
            chatId: newChat._id
          },
          { headers: corsHeaders() }
        );    
    }catch(error){
            console.log(error);
            return NextResponse.json(
              { success: false, message: "Something went wrong" },
              { headers: corsHeaders() }
            );
        }
}
    