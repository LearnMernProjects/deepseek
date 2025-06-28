import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import User from "@/models/User";
import { corsHeaders } from "@/utils/cors";

export async function POST() {
  try {
    console.log("🔄 Starting user sync from Clerk to MongoDB");
    
    const results = {
      timestamp: new Date().toISOString(),
      syncStatus: "starting",
      usersProcessed: 0,
      usersCreated: 0,
      usersUpdated: 0,
      errors: []
    };

    // Check if we have Clerk API key
    if (!process.env.CLERK_SECRET_KEY) {
      return NextResponse.json({
        error: "No Clerk secret key found",
        results
      }, { headers: corsHeaders() });
    }

    // Check if we have MongoDB URI
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({
        error: "No MongoDB URI found",
        results
      }, { headers: corsHeaders() });
    }

    await connectDB();
    results.syncStatus = "connected";

    try {
      // Get all users from Clerk
      console.log("📋 Fetching users from Clerk...");
      const clerkUsers = await clerkClient.users.getUserList();
      
      console.log(`📊 Found ${clerkUsers.length} users in Clerk`);
      results.usersProcessed = clerkUsers.length;

      // Process each user
      for (const clerkUser of clerkUsers) {
        try {
          const userData = {
            _id: clerkUser.id,
            email: clerkUser.emailAddresses?.[0]?.emailAddress || "",
            name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || clerkUser.username || "Unknown User",
            image: clerkUser.imageUrl || "",
          };

          // Check if user already exists in MongoDB
          const existingUser = await User.findById(clerkUser.id);
          
          if (existingUser) {
            // Update existing user
            await User.findByIdAndUpdate(clerkUser.id, userData, { new: true });
            results.usersUpdated++;
            console.log(`✅ Updated user: ${clerkUser.id}`);
          } else {
            // Create new user
            const newUser = new User(userData);
            await newUser.save();
            results.usersCreated++;
            console.log(`✅ Created user: ${clerkUser.id}`);
          }
        } catch (userError) {
          console.error(`❌ Error processing user ${clerkUser.id}:`, userError);
          results.errors.push({
            userId: clerkUser.id,
            error: userError.message
          });
        }
      }

      results.syncStatus = "completed";
      console.log("🎉 User sync completed successfully");

    } catch (clerkError) {
      console.error("❌ Error fetching users from Clerk:", clerkError);
      results.syncStatus = "failed";
      results.errors.push({
        error: "Clerk API error",
        message: clerkError.message
      });
    }

    return NextResponse.json(results, { headers: corsHeaders() });

  } catch (error) {
    console.error("❌ Sync error:", error);
    return NextResponse.json({
      error: error.message,
      timestamp: new Date().toISOString()
    }, { headers: corsHeaders() });
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Use POST method to sync users from Clerk to MongoDB",
    timestamp: new Date().toISOString()
  }, { headers: corsHeaders() });
} 