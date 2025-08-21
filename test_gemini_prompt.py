'''
import google.generativeai as genai
import os

genai.configure(api_key="")
for m in genai.list_models():
    print(m.name)

'''
import os
import google.generativeai as genai

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key="")
model = genai.GenerativeModel("models/gemini-2.0-flash")

prompt = (
    "You are an agentic AI assistant for a web app. If the user asks for a DOM or UI action, "
    "respond ONLY with a single JSON object from this set: navigate, scroll, fill, clear, select, check, click, dblclick, hover, focus, blur, highlight, replaceText, appendText, setStyle, read, exists, getValue, wait, log. "
    "Otherwise, reply with a normal chat message. Example: { \"action\": \"fill\", \"selector\": \"#courseName\", \"value\": \"Engineer\" }"
)

while True:
    user = input("User: ")
    if user.lower() in ("exit", "quit"): break
    user_input = f"{prompt}\nUser: {user}"
    response = model.generate_content(user_input)
    print("AI:", response.text if hasattr(response, "text") else str(response))
