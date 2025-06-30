from app.db.mongo import db
from app.services.llm import build_prompt_quiz_transcript, query_llm, build_prompt_quiz_reinforce
from app.services.transcribe import get_Transcript
from datetime import datetime
import json
import re
from bson import ObjectId

chats_collection = db["chats"]

def quiz(chatId, videoId):
    chatId = ObjectId(chatId)
    chats = collect_previous_chats(chatId)
    transcript = [segment['text'] for segment in get_Transcript(videoId)]

    normal_questions = return_transcript_questions(transcript)
    if chats:
        reinforce_questions = return_reinforce_questions(chats)
    else:
        reinforce_questions = []
   
    return normal_questions, reinforce_questions

def return_transcript_questions(transcript):
    prompt = build_prompt_quiz_transcript(transcript)
    normal_questions = query_llm(prompt)
    return extract_json_block(normal_questions)

def return_reinforce_questions(chats):
    prompt = build_prompt_quiz_reinforce(chats)
    reinforce_questions = query_llm(prompt)
    return extract_json_block(reinforce_questions)

def collect_previous_chats(chatId):
    doc = chats_collection.find_one({"_id": chatId})
    if not doc or "messages" not in doc:
          return []

    sorted_messages = sorted(
                                doc["messages"],
                                key=lambda m: m.get("timestamp", datetime.min)
                            )
    last_messages = sorted_messages[-10:]
    context = []
    for msg in last_messages:
        if "user" in msg:
            context.append({"role": "user", "content": msg["user"]})
        if "ai" in msg:
            context.append({"role": "assistant", "content": msg["ai"]})
    return context


def extract_json_block(raw_response):
    """
    Extracts the JSON-like block from a raw string (removes leading text and triple backticks).
    Returns a parsed Python object (list of questions).
    """
    json_text = re.search(r"\[.*\]", raw_response, re.DOTALL)
    if not json_text:
        raise ValueError("Could not extract valid JSON structure from response.")

    cleaned = json_text.group(0)
    
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse JSON block: {e}")