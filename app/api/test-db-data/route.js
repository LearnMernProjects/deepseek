import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import User from "@/models/User";
import { corsHeaders } from "@/utils/cors";

export async function GET() {
  try {
    const results = {
      timestamp: new Date().toISOString(),
      databaseStatus: "checking...",
      collections: {}
    };

    // Connect to database
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({
        error: "No MongoDB URI found",
        results
      }, { headers: corsHeaders() });
    }

    await connectDB();
    results.databaseStatus = "connected";

    // Check Chat collection
    try {
      const chatCount = await Chat.countDocuments();
      const sampleChats = await Chat.find().limit(3).lean();
      
      results.collections.chats = {
        count: chatCount,
        sample: sampleChats,
        message: chatCount > 0 ? "✅ Chats found" : "⚠️ No chats found"
      };
    } catch (error) {
      results.collections.chats = {
        error: error.message,
        message: "❌ Error accessing chats"
      };
    }

    // Check User collection
    try {
      const userCount = await User.countDocuments();
      const sampleUsers = await User.find().limit(3).lean();
      
      results.collections.users = {
        count: userCount,
        sample: sampleUsers,
        message: userCount > 0 ? "✅ Users found" : "⚠️ No users found"
      };
    } catch (error) {
      results.collections.users = {
        error: error.message,
        message: "❌ Error accessing users"
      };
    }

    return NextResponse.json(results, { headers: corsHeaders() });

  } catch (error) {
    return NextResponse.json({
      error: error.message,
      timestamp: new Date().toISOString()
    }, { headers: corsHeaders() });
  }
} 