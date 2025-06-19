import OpenAI from "openai";
import { NextResponse } from "next/server";
import { FEEDBACK_PROMPT } from "../../../services/Constants.jsx";

export async function POST(request) {
  try {
    const { conversation } = await request.json();
    const FINAL_PROMPT = FEEDBACK_PROMPT.replace(
      "{{conversation}}",
      JSON.stringify(conversation)
    );

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });
    console.log("Calling OpenRouter API...");
    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat-v3-0324:free",
      messages: [{ role: "user", content: FINAL_PROMPT }],
      response_format: { type: "json_object" },
    });
    console.log("OpenRouter API Response (raw completion):", completion);
    const responseContent = completion.choices[0].message.content;
    console.log("OpenRouter Raw Response Content String:", responseContent);

    let parsedFeedback = {};
    try {
      parsedFeedback = JSON.parse(responseContent);
      console.log("OpenRouter Parsed Feedback Object:", parsedFeedback);
    } catch (parseError) {
      console.error("Error parsing OpenAI response content:", parseError);
      console.log("Content that caused parse error:", responseContent);
      throw new Error("Failed to parse OpenAI feedback: " + parseError.message);
    }

    return NextResponse.json({ feedback: parsedFeedback });
  } catch (e) {
    console.error("Error in API route:", e);
    console.log("Error details:", {
      message: e.message,
      response: e.response?.data,
      status: e.response?.status,
    });
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
