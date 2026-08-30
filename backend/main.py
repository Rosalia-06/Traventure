import os
import logging
from typing import List, Literal, Optional
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from google.genai import types
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("traventure")

app = FastAPI()

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://traventure-4m5a.onrender.com"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL = "gemini-3.5-flash-lite"

class Message(BaseModel):
    role: Literal["user", "assistant"]
    content: str

class ChatRequest(BaseModel):
    message: str
    history: List[Message] = []
    system: Optional[str] = None

@app.get("/")
def health():
    return {"status": "ok"}

FALLBACK_MODELS = ["gemini-3.5-flash-lite", "gemini-3.6-flash"]

@app.post("/chat")
@limiter.limit("10/minute")
def chat(request: Request, req: ChatRequest):
    contents = [
        types.Content(role="user" if m.role == "user" else "model", parts=[types.Part(text=m.content)])
        for m in req.history
    ]
    contents.append(types.Content(role="user", parts=[types.Part(text=req.message)]))
    config = types.GenerateContentConfig(
        system_instruction=req.system,
        max_output_tokens=4096,
    )

    last_error = None
    for model_name in FALLBACK_MODELS:
        try:
            response = client.models.generate_content(model=model_name, contents=contents, config=config)
            if not response.text:
                raise ValueError(f"Empty response, finish_reason={response.candidates[0].finish_reason}")
            return {"reply": response.text}
        except Exception as e:
            logger.error(f"{model_name} failed: {e}")
            last_error = e
            continue

    return {"reply": "Sorry, I couldn't process that right now. Try again in a moment.", "error": str(last_error)}