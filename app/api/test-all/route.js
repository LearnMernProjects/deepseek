import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import { corsHeaders } from "@/utils/cors";

export async function GET() {
  const results = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    tests: {}
  };

  // Test 1: Environment Variables
  results.tests.environmentVariables = {
    hasMongoDB: !!process.env.MONGODB_URI,
    hasDeepSeek: !!process.env.DEEPSEEK_API_KEY,
    mongoUriPreview: process.env.MONGODB_URI ? 
      process.env.MONGODB_URI.substring(0, 30) + "..." : 
      "Not set",
    deepSeekPreview: process.env.DEEPSEEK_API_KEY ? 
      process.env.DEEPSEEK_API_KEY.substring(0, 10) + "..." : 
      "Not set"
  };

  // Test 2: MongoDB Connection
  try {
    if (process.env.MONGODB_URI) {
      await connectDB();
      results.tests.mongodb = {
        status: "✅ Connected successfully",
        connected: true
      };
    } else {
      results.tests.mongodb = {
        status: "⚠️ No MONGODB_URI found",
        connected: false
      };
    }
  } catch (error) {
    results.tests.mongodb = {
      status: "❌ Connection failed",
      error: error.message,
      connected: false
    };
  }

  // Test 3: DeepSeek API Test
  try {
    if (process.env.DEEPSEEK_API_KEY) {
      const { OpenAI } = await import('openai');
      const deepseek = new OpenAI({
        baseURL: "https://api.deepseek.com/v1",
        apiKey: process.env.DEEPSEEK_API_KEY,
      });
      
      // Try a simple API call
      const completion = await deepseek.chat.completions.create({
        messages: [{ role: "user", content: "Hello" }],
        model: "deepseek-coder",
        max_tokens: 10,
      });
      
      results.tests.deepseekAPI = {
        status: "✅ API working",
        connected: true,
        response: completion.choices[0].message.content
      };
    } else {
      results.tests.deepseekAPI = {
        status: "⚠️ No DEEPSEEK_API_KEY found",
        connected: false
      };
    }
  } catch (error) {
    results.tests.deepseekAPI = {
      status: "❌ API failed",
      error: error.message,
      connected: false
    };
  }

  // Test 4: Overall Status
  results.overallStatus = {
    mongodb: results.tests.mongodb.connected,
    deepseek: results.tests.deepseekAPI.connected,
    ready: results.tests.mongodb.connected || results.tests.deepseekAPI.connected
  };

  return NextResponse.json(results, { headers: corsHeaders() });
} 