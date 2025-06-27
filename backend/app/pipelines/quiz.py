from app.db.mongo import db
from app.services.vectorization import embed_texts
from app.services.llm import build_prompt_quiz_transcript, query_llm, build_prompt_quiz_reinforce
from app.services.transcribe import get_Transcript

chats_collection = db["chats"]
transcript_collection = db["transcript"]

def quiz(chatId, videoId):
    chats = collect_previous_chats(chatId)
    transcript = [segment['text'] for segment in get_Transcript(videoId)]

    normal_questions = return_transcript_questions(transcript)
    reinforce_questions = return_reinforce_questions(chats)

    return normal_questions, reinforce_questions

def return_transcript_questions(transcript):
    prompt = build_prompt_quiz_transcript(transcript)
    normal_questions = query_llm(prompt)
    return normal_questions

def return_reinforce_questions(chats):
    prompt = build_prompt_quiz_reinforce(chats)
    normal_questions = query_llm(prompt)
    return normal_questions

def collect_previous_chats(chatId):
     chats = list(chats_collection.find({"chatId": chatId}).sort("timestamp", -1))
     context = []
     for c in reversed(chats):  
          context.append({"role": "user", "content": c["question"]})
          context.append({"role": "assistant", "content": c["answer"]})
     return context