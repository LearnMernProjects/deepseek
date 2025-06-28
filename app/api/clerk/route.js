import { NextResponse } from "next/server";
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import connectDB from "@/config/db";
import User from "@/models/User";
import { corsHeaders } from "@/utils/cors";

export async function POST(req) {
  try {
    console.log("🔔 Clerk webhook received");
    
    // Get the headers
    const headerPayload = headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.log("❌ Missing svix headers");
      return NextResponse.json(
        { error: "Missing svix headers" },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your secret.
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "your-webhook-secret");

    let evt;

    // Verify the payload with the headers
    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      });
    } catch (err) {
      console.log("❌ Error verifying webhook:", err.message);
      return NextResponse.json(
        { error: "Error verifying webhook" },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Get the ID and type
    const { id } = evt.data;
    const eventType = evt.type;

    console.log(`📝 Webhook event: ${eventType} for user: ${id}`);

    // Connect to MongoDB
    if (!process.env.MONGODB_URI) {
      console.log("⚠️ No MongoDB URI found - skipping database sync");
      return NextResponse.json(
        { message: "Webhook received (no database)" },
        { headers: corsHeaders() }
      );
    }

    await connectDB();

    // Handle the webhook
    switch (eventType) {
      case 'user.created':
        await handleUserCreated(evt.data);
        break;
      case 'user.updated':
        await handleUserUpdated(evt.data);
        break;
      case 'user.deleted':
        await handleUserDeleted(evt.data);
        break;
      default:
        console.log(`ℹ️ Unhandled event type: ${eventType}`);
    }

    return NextResponse.json(
      { message: "Webhook processed successfully" },
      { headers: corsHeaders() }
    );

  } catch (error) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500, headers: corsHeaders() }
    );
  }
}

async function handleUserCreated(userData) {
  try {
    console.log("👤 Creating user in MongoDB:", userData.id);
    
    const user = new User({
      _id: userData.id,
      email: userData.email_addresses?.[0]?.email_address || "",
      name: `${userData.first_name || ""} ${userData.last_name || ""}`.trim() || userData.username || "Unknown User",
      image: userData.image_url || "",
    });

    await user.save();
    console.log("✅ User created in MongoDB");
  } catch (error) {
    console.error("❌ Error creating user:", error);
  }
}

async function handleUserUpdated(userData) {
  try {
    console.log("👤 Updating user in MongoDB:", userData.id);
    
    const updateData = {
      email: userData.email_addresses?.[0]?.email_address || "",
      name: `${userData.first_name || ""} ${userData.last_name || ""}`.trim() || userData.username || "Unknown User",
      image: userData.image_url || "",
    };

    await User.findByIdAndUpdate(userData.id, updateData, { new: true });
    console.log("✅ User updated in MongoDB");
  } catch (error) {
    console.error("❌ Error updating user:", error);
  }
}

async function handleUserDeleted(userData) {
  try {
    console.log("👤 Deleting user from MongoDB:", userData.id);
    
    await User.findByIdAndDelete(userData.id);
    console.log("✅ User deleted from MongoDB");
  } catch (error) {
    console.error("❌ Error deleting user:", error);
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}
