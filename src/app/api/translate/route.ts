import { NextResponse } from 'next/server'
import OpenAI from "openai";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY as string;

const GEMINI_URL=`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });
const text = 'Test';
const language = 'pt-BR';

export async function POST(request:Request){
  try{
    const { text, language} = await request.json();
  
    if (!text || !language) {
      return NextResponse.json(
        { error: "Missing required fields: 'text' and 'targetLanguage'." },
        { status: 400 }
      );
    }
  
    const prompt=`Detect the language of the following text and translate it to ${language}. Only return the translated text and nothing else:\n\n${text}`
    const body = {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    };
  
    const res=await fetch(GEMINI_URL,{
      method:"POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if(!res.ok){
      const errData = await res.json();
      throw new Error(errData.error?.message || 'Gemini API error');
    }
    const data = await res.json();
    const translatedText =
      data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      data.candidates?.[0]?.content?.text?.trim() ||
      '';
      if (!translatedText) {
        throw new Error('No translation returned from Gemini.');
      }
  
      return NextResponse.json({ text: translatedText });
  }catch(error){
    console.error('Gemini API Error:', error);
    return NextResponse.json(
      { error: 'Translation failed. Please try again.' },
      { status: 500 }
    );
  }
 
}

  

// open ai translation
// export async function POST(request: Request) {
//     const { text, language } = await request.json();

//     const response = await openai.chat.completions.create({
//         model: "gpt-4o",
//         messages: [
//           {
//             role: "system",
//             "content": `
//             You will be provided with a sentence. Your tasks are to:
//             - Detect what language the sentence is in
//             - Translate the sentence into ${language}
//             Do not return anything other than the translated sentence.
//           `
//           },
//           {
//             "role": "user",
//             "content": text,
//           }
//         ],
//         temperature: 0.7,
//         max_tokens: 64 ,
//         top_p: 1,
    
//       });
//   return NextResponse.json({
//     text: response.choices[0].message.content

//   });
// }

