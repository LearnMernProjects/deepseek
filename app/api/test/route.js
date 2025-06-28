import { NextResponse } from "next/server";
import { corsHeaders } from "@/utils/cors";

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET() {
  return NextResponse.json(
    { success: true, message: "API is working!" },
    { headers: corsHeaders() }
  );
}

export async function POST() {
  return NextResponse.json(
    { success: true, message: "POST API is working!" },
    { headers: corsHeaders() }
  );
}