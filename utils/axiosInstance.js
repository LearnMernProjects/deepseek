import axios from "axios";

// Determine the base URL
const baseURL = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";

console.log("🚀 Initializing Axios instance with baseURL:", baseURL);

const instance = axios.create({
  // Use relative URLs - this will work with Next.js API routes
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // Increased to 30 seconds
});

export default instance;
