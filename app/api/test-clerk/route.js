import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { corsHeaders } from "@/utils/cors";

export async function GET() {
  try {
    console.log("🔍 Testing Clerk configuration...");
    
    const results = {
      timestamp: new Date().toISOString(),
      clerkStatus: "testing",
      publishableKey: process.env.CLERK_PUBLISHABLE_KEY ? "✅ Found" : "❌ Missing",
      secretKey: process.env.CLERK_SECRET_KEY ? "✅ Found" : "❌ Missing",
      secretKeyPrefix: process.env.CLERK_SECRET_KEY ? process.env.CLERK_SECRET_KEY.substring(0, 10) + "..." : "N/A",
      publishableKeyPrefix: process.env.CLERK_PUBLISHABLE_KEY ? process.env.CLERK_PUBLISHABLE_KEY.substring(0, 10) + "..." : "N/A",
      testResult: null,
      error: null
    };

    // Test if we can access Clerk API
    if (process.env.CLERK_SECRET_KEY) {
      try {
        console.log("🤖 Testing Clerk API access...");
        const users = await clerkClient.users.getUserList({ limit: 1 });
        results.testResult = `✅ Clerk API working - Found ${users.length} users`;
        results.clerkStatus = "working";
      } catch (apiError) {
        console.error("❌ Clerk API error:", apiError);
        results.testResult = `❌ Clerk API error: ${apiError.message}`;
        results.clerkStatus = "failed";
        results.error = apiError.message;
      }
    } else {
      results.testResult = "❌ No CLERK_SECRET_KEY found";
      results.clerkStatus = "no_key";
    }

    return NextResponse.json(results, { headers: corsHeaders() });

  } catch (error) {
    console.error("❌ Test route error:", error);
    return NextResponse.json({
      error: error.message,
      timestamp: new Date().toISOString()
    }, { headers: corsHeaders() });
  }
} 