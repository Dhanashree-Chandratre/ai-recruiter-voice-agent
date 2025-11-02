import OpenAI from "openai";
import { QUESTIONS_PROMPT } from "../../../services/Constants.jsx";
import { NextResponse } from "next/server";

export async function POST(req) {
  console.log("API route received request");
  try {
    const { jobPosition, jobDescription, duration, type } = await req.json();
    console.log("Request body:", {
      jobPosition,
      jobDescription,
      duration,
      type,
    });

    // Validate required fields
    if (!jobPosition || !jobDescription) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: jobPosition and jobDescription are required",
        },
        { status: 400 }
      );
    }

    // Replace placeholders with actual values, providing defaults if missing
    const FINAL_PROMPT = QUESTIONS_PROMPT.replace(
      "{{jobTitle}}",
      jobPosition || ""
    )
      .replace("{{jobDescription}}", jobDescription || "")
      .replace("{{duration}}", duration || "30 Mins")
      .replace("{{type}}", type || "Technical");

    console.log("Generated Prompt:", FINAL_PROMPT);

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    console.log("Calling OpenRouter API...");
    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat-v3-0324:free",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that returns ONLY valid JSON arrays. Never include markdown code blocks or explanations.",
        },
        { role: "user", content: FINAL_PROMPT },
      ],
      temperature: 0.3, // Lower temperature for more consistent JSON output
    });

    console.log("OpenRouter API Response:", completion);

    // Safely extract response content with null checks
    const responseContent = completion?.choices?.[0]?.message?.content;

    if (!responseContent) {
      console.error("No content in API response:", completion);
      return NextResponse.json(
        { error: "No response content received from AI model" },
        { status: 500 }
      );
    }

    console.log("Response Content:", responseContent);
    console.log("Response Content Length:", responseContent.length);
    console.log("Response Content Preview:", responseContent.substring(0, 200));

    return NextResponse.json({ questions: responseContent });
  } catch (e) {
    console.error("Error in API route:", e);
    console.error("Error details:", {
      message: e.message,
      response: e.response?.data,
      status: e.response?.status,
      stack: e.stack,
    });
    return NextResponse.json(
      { error: e.message || "Failed to generate questions" },
      { status: 500 }
    );
  }
}
