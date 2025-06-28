import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hasMongoDB: !!process.env.MONGODB_URI,
    hasDeepSeek: !!process.env.DEEPSEEK_API_KEY,
    nodeEnv: process.env.NODE_ENV,
    mongoUriPreview: process.env.MONGODB_URI ? 
      process.env.MONGODB_URI.substring(0, 20) + "..." : 
      "Not set"
  });
} 