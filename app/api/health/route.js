import { NextResponse } from "next/server";
import { corsHeaders } from "@/utils/cors";

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET() {
  console.log("🏥 Health check endpoint hit");
  return NextResponse.json(
    { 
      success: true, 
      message: "API is healthy!",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    },
    { headers: corsHeaders() }
  );
}

export async function POST() {
  console.log("🏥 Health check POST endpoint hit");
  return NextResponse.json(
    { 
      success: true, 
      message: "POST API is healthy!",
      timestamp: new Date().toISOString()
    },
    { headers: corsHeaders() }
  );
} 