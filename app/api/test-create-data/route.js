import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import User from "@/models/User";
import { corsHeaders } from "@/utils/cors";

export async function POST() {
  try {
    const results = {
      timestamp: new Date().toISOString(),
      databaseStatus: "checking...",
      createdData: {},
      message: ""
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

    // Create a test user
    try {
      const testUserId = "test_user_" + Date.now();
      const testUser = new User({
        _id: testUserId,
        email: "test@example.com",
        name: "Test User",
        image: "https://example.com/avatar.jpg"
      });
      
      const savedUser = await testUser.save();
      results.createdData.user = {
        id: savedUser._id,
        email: savedUser.email,
        name: savedUser.name,
        message: "✅ Test user created successfully"
      };
    } catch (error) {
      results.createdData.user = {
        error: error.message,
        message: "❌ Error creating test user"
      };
    }

    // Create a test chat
    try {
      const testChat = new Chat({
        userId: testUserId,
        name: "Test Chat " + new Date().toLocaleString(),
        messages: [
          {
            role: "user",
            content: "Hello, this is a test message",
            Timestamp: Date.now()
          },
          {
            role: "assistant", 
            content: "Hi! This is a test response from the AI assistant.",
            Timestamp: Date.now()
          }
        ]
      });
      
      const savedChat = await testChat.save();
      results.createdData.chat = {
        id: savedChat._id,
        name: savedChat.name,
        messageCount: savedChat.messages.length,
        message: "✅ Test chat created successfully"
      };
    } catch (error) {
      results.createdData.chat = {
        error: error.message,
        message: "❌ Error creating test chat"
      };
    }

    results.message = "Test data creation completed. Check MongoDB Atlas to see the new documents.";

    return NextResponse.json(results, { headers: corsHeaders() });

  } catch (error) {
    return NextResponse.json({
      error: error.message,
      timestamp: new Date().toISOString()
    }, { headers: corsHeaders() });
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Use POST method to create test data in MongoDB",
    timestamp: new Date().toISOString()
  }, { headers: corsHeaders() });
} 