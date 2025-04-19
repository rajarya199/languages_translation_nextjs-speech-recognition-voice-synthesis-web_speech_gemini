import { NextResponse } from 'next/server'
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: [
          {
            type: "text",
            text: "You will be provided with a sentence in English, and your task is to translate it into French."
          }
        ]
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "My name is Jane. What is yours?"
          }
        ]
      }
    ],
    temperature: 1,
    max_tokens: 256 ,
    top_p: 1,

  });
  


export async function POST(request: Request) {
  return NextResponse.json({});
}