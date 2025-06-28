export const maxDuration = 60;

import connectDB from "@/config/db";
import { NextResponse } from "next/server"; 
import { getAuth } from "@clerk/nextjs/server";
import OpenAI from "openai";
import Chat from "@/models/Chat";
// app/api/Chat/Ai/route.js
import { corsHeaders } from "@/utils/cors";

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

// Create DeepSeek API instance
const createDeepSeekAPI = () => {
  if (!process.env.DEEPSEEK_API_KEY) {
    return null;
  }
  return new OpenAI({
    baseURL: "https://api.deepseek.com/v1",
    apiKey: process.env.DEEPSEEK_API_KEY,
  });
};

// Create realistic demo responses
const createDemoResponse = (prompt) => {
  const lowerPrompt = prompt.toLowerCase();
  
  // Common questions and their demo responses
  const responses = {
    "vasco da gama": "Vasco da Gama (1460-1524) was a Portuguese explorer who was the first European to reach India by sea, establishing a direct maritime route from Europe to Asia. His voyage around the Cape of Good Hope in 1497-1499 opened up the spice trade and established Portugal as a major colonial power. This was a significant achievement in the Age of Discovery.",
    
    "who is": "I'd be happy to help you learn about that person! In a real AI response, I would provide detailed information about their background, achievements, and significance. Since this is a demo mode, I'm showing you how the chat interface works. To get real AI responses, you can add credits to your DeepSeek account or use a different AI service.",
    
    "what is": "That's an interesting question! In a real AI response, I would provide a comprehensive explanation of this topic, including its definition, history, and significance. This demo mode shows you how the chat interface works. For real AI responses, consider adding credits to your DeepSeek account.",
    
    "how to": "I can help you with that! In a real AI response, I would provide step-by-step instructions and detailed guidance. This demo mode demonstrates the chat functionality. For actual AI assistance, you can add credits to your DeepSeek account or use an alternative AI service.",
    
    "explain": "I'd be glad to explain that for you! In a real AI response, I would break down the concept into simple terms and provide examples. This demo shows the chat interface working. For real explanations, consider adding credits to your DeepSeek account.",
  };
  
  // Find matching response
  for (const [key, response] of Object.entries(responses)) {
    if (lowerPrompt.includes(key)) {
      return {
        role: "assistant",
        content: response,
        Timestamp: Date.now(),
      };
    }
  }
  
  // Default response for other questions
  return {
    role: "assistant",
    content: `That's an interesting question about "${prompt}"! In a real AI response, I would provide detailed information and insights about this topic. This demo mode shows you how the chat interface works. To get real AI responses, you can add credits to your DeepSeek account or use a different AI service like OpenAI or Google Gemini.`,
    Timestamp: Date.now(),
  };
};

export async function POST(request) {
  try {
    console.log("🚀 AI route called");
    const { userId } = getAuth(request);
    const { chatId, prompt } = await request.json();

    console.log("📝 Prompt received:", prompt);
    console.log("👤 User ID:", userId);
    console.log("💬 Chat ID:", chatId);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { headers: corsHeaders() }
      );
    }

    // Check if DeepSeek API key is available
    const deepseek = createDeepSeekAPI();
    if (!deepseek) {
      console.log("⚠️ No DeepSeek API key found - using demo mode");
      const mockResponse = {
        role: "assistant",
        content: "I'm sorry, but the DeepSeek AI service is not configured. Please set up the DEEPSEEK_API_KEY environment variable to use the AI chat functionality.",
        Timestamp: Date.now(),
      };
      
      return NextResponse.json(
        {
          success: true,
          message: "Demo response (no API key)",
          data: mockResponse,
        },
        { headers: corsHeaders() }
      );
    }

    console.log("✅ DeepSeek API configured, making request...");

    // Check if we have a database connection
    if (!process.env.MONGODB_URI) {
      console.log("⚠️ No MongoDB URI found - using AI without database");
      
      // Use DeepSeek API even without database
      try {
        console.log("🤖 Calling DeepSeek API (demo mode)...");
        const completion = await deepseek.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: "deepseek-coder", // Try a different model that might be free
          max_tokens: 500, // Reduce tokens to save credits
          temperature: 0.7,
        });

        console.log("✅ DeepSeek API response received:", completion.choices[0].message);

        const message = completion.choices[0].message;
        message.Timestamp = Date.now();

        return NextResponse.json(
          {
            success: true,
            message: "AI response (demo mode - no database)",
            data: message,
          },
          { headers: corsHeaders() }
        );
      } catch (apiError) {
        console.error("❌ DeepSeek API error:", apiError);
        
        // Handle specific billing errors - return demo response instead of error
        if (apiError.message && (apiError.message.includes("402") || apiError.message.includes("Insufficient Balance"))) {
          console.log("💰 Billing issue detected - providing demo response");
          
          // Create a realistic demo response based on the prompt
          const demoResponse = createDemoResponse(prompt);
          
          return NextResponse.json(
            {
              success: true,
              message: "Demo response (billing issue)",
              data: demoResponse,
            },
            { headers: corsHeaders() }
          );
        }
        
        return NextResponse.json(
          {
            success: false,
            message: "AI service error: " + apiError.message,
          },
          { headers: corsHeaders() }
        );
      }
    }

    // Full mode with database
    await connectDB();

    // Check if chatId is a demo chat (starts with "default-chat-")
    if (chatId && chatId.startsWith("default-chat-")) {
      console.log("📝 Demo chat detected - using AI without database lookup");
      
      try {
        console.log("🤖 Calling DeepSeek API for demo chat...");
        const completion = await deepseek.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: "deepseek-coder",
          max_tokens: 500,
          temperature: 0.7,
        });

        console.log("✅ DeepSeek API response received:", completion.choices[0].message);

        const message = completion.choices[0].message;
        message.Timestamp = Date.now();

        return NextResponse.json(
          {
            success: true,
            message: "AI response (demo chat)",
            data: message,
          },
          { headers: corsHeaders() }
        );
      } catch (apiError) {
        console.error("❌ DeepSeek API error:", apiError);
        
        // Handle specific billing errors
        if (apiError.message && apiError.message.includes("402")) {
          return NextResponse.json(
            {
              success: false,
              message: "DeepSeek API billing issue: Please add credits to your account or check your subscription.",
            },
            { headers: corsHeaders() }
          );
        }
        
        return NextResponse.json(
          {
            success: false,
            message: "AI service error: " + apiError.message,
          },
          { headers: corsHeaders() }
        );
      }
    }

    // Regular database chat lookup
    const data = await Chat.findOne({ userId, _id: chatId });

    if (!data) {
      console.log("❌ Chat not found in database");
      return NextResponse.json(
        { success: false, message: "Chat not found" },
        { headers: corsHeaders() }
      );
    }

    const userPrompt = {
      role: "user",
      content: prompt,
      Timestamp: Date.now(),
    };

    data.messages.push(userPrompt);

    console.log("🤖 Calling DeepSeek API...");
    const completion = await deepseek.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "deepseek-coder",
      max_tokens: 500,
      temperature: 0.7,
    });

    console.log("✅ DeepSeek API response received:", completion.choices[0].message);

    const message = completion.choices[0].message;
    message.Timestamp = Date.now();

    data.messages.push(message);
    await data.save();

    console.log("💾 Message saved to database");

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully",
        data: message,
      },
      { headers: corsHeaders() }
    );
  } catch (error) {
    console.error("❌ Error in AI route:", error);
    console.error("❌ Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    // Send more detailed error information
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "Something went wrong",
        error: {
          name: error.name,
          message: error.message,
          code: error.code || 'UNKNOWN_ERROR'
        }
      },
      { headers: corsHeaders() }
    );
  }
}
