// utils/cors.js

export function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "http://localhost:3010",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}
