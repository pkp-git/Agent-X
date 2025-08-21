import { NextResponse } from 'next/server';

export async function POST(req) {
  const { message } = await req.json();

  // Gemini API endpoint and key
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + GEMINI_API_KEY;

  // Prompt Gemini to return either a JSON action or a chat message
  const prompt = `You are an agentic AI assistant for a web app. If the user asks for a DOM or UI action, respond ONLY with a single JSON object from this set: navigate, scroll, fill, clear, select, check, click, dblclick, hover, focus, blur, highlight, replaceText, appendText, setStyle, read, exists, getValue, wait, log. Otherwise, reply with a normal chat message. Example: { "action": "fill", "selector": "#courseName", "value": "Engineer" }`;

  const body = {
    contents: [
      { role: 'user', parts: [ { text: prompt + '\nUser: ' + message } ] }
    ]
  };

  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  // Gemini returns candidates[0].content.parts[0].text
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, no response.';

  return NextResponse.json({ text });
}
