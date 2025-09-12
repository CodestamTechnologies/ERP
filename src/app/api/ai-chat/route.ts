// app/api/ai-chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEMINI_KEY || '',
});

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt || prompt.trim() === '') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Call Gemini model
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash', // latest Gemini model
      contents: prompt,
    });

    return NextResponse.json({ text: response.text });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json({ error: 'Gemini API error' }, { status: 500 });
  }
}
