from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv
import google.generativeai as genai
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("models/gemini-2.0-flash")

app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.post("/api/agent")
async def agent(request: Request):
    data = await request.json()
    message = data.get("message", "")
    schema = data.get("schema")
    if not isinstance(schema, list):
        schema = []
    # Format schema for LLM context
    if schema:
        schema_str = "\n".join([
            f"- type: {el.get('type')}, label: {el.get('label')}, selector: {el.get('selector')}" for el in schema if isinstance(el, dict)
        ])
    else:
        schema_str = "(no actionable elements found)"
    prompt = f"""You are an agentic AI assistant for a web app. You either chat with the user or send a JSON based on their request for DOM or UI action.
If the user asks for a DOM or UI action such as filling up a field, navigating to a page, respond with ONLY a single valid JSON object (no explanation, no extra text). The JSON looks like: {{"action": "", "selector": "", "value": ""}}
Choose an Action strictly from this set:
    "fillorupdate": Sets (or updates) the value of an input or textarea.
    "append": Appends text to the current value of an input or textarea.
    "clear", "click", "highlight": Highlights with effect.
Choose a selector from the provided list. It contains all selectors available in that page. If no matching selector exists, reply with plain text. Here is the selector list: {schema_str}
If the user is just chatting, respond with ONLY plain text (no JSON, no code block).
For example, if the user says: Fill the course name as Engineer, Respond with: {{"action": "fill", "selector": "#courseName", "value": "Engineer"}}
Or if the user says: "Hi, what's up", respond politely and no need to give JSON.
Never include explanations, code blocks, or extra text—just the JSON object or just the chat."""
    user_input = f"{prompt}\nUser: {message}"
    response = await model.generate_content_async(user_input)
    text = response.text if hasattr(response, "text") else str(response)
    return JSONResponse({"text": text})
