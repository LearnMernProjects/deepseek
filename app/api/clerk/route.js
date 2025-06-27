import { Webhook } from "svix";
import { headers } from "next/headers"; // ✅ FIXED
import { NextResponse } from "next/server"; // ✅ needed to return response
import connectDB from "@/config/db";
import User from "@/models/User";

export async function POST(req) {
  const wh = new Webhook(process.env.SIGNING_SECRET);

  const headerPayload = headers(); // ✅ no await here
  const svixHeaders = {
    "svix-id": headerPayload.get("svix-id"),
    "svix-timestamp": headerPayload.get("svix-timestamp"),
    "svix-signature": headerPayload.get("svix-signature"),
  };

  const payload = await req.json();
  const body = JSON.stringify(payload);
  const { data, type } = wh.verify(body, svixHeaders);

  const userData = {
    _id: data.id,
    name: `${data.first_name} ${data.last_name}`,
    email: data.email_addresses[0].email_address,
    image: data.image_url,
  };

  await connectDB();

  switch (type) {
    case "user.created":
      await User.create(userData);
      break;
    case "user.updated":
      await User.findByIdAndUpdate(userData._id, userData);
      break;
    case "user.deleted":
      await User.findByIdAndDelete(data.id);
      break;
    default:
      break;
  }

  return NextResponse.json({ message: "Webhook received" }, { status: 200 });
}
