import OpenAI from "openai"
import { QUESTIONS_PROMPT } from "../../../services/Constants.jsx";
import { NextResponse } from "next/server";

export async function POST(req){
    console.log('API route received request');
    const {jobPosition, jobDescription, duration, type} = await req.json();
    console.log('Request body:', {jobPosition, jobDescription, duration, type});

    const FINAL_PROMPT=QUESTIONS_PROMPT
    .replace('{{jobTitle}}', jobPosition)
    .replace('{{jobDescription}}', jobDescription)
    .replace('{{duration}}', duration)
    .replace('{{type}}', type)

    console.log('Generated Prompt:', FINAL_PROMPT);

    try{
    const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.OPENROUTER_API_KEY,
        
      })
      console.log('Calling OpenRouter API...');
      const completion = await openai.chat.completions.create({
        model: "deepseek/deepseek-chat-v3-0324:free",
        messages: [
          { role: "user", content: FINAL_PROMPT }
        ],
      })
      console.log('OpenRouter API Response:', completion);
      const responseContent = completion.choices[0].message.content;
      console.log('Response Content:', responseContent);
      
      return NextResponse.json({ questions: responseContent });
}
catch(e){
    console.log('Error in API route:', e);
    console.log('Error details:', {
        message: e.message,
        response: e.response?.data,
        status: e.response?.status
    });
    return NextResponse.json({ error: e.message });
}
}