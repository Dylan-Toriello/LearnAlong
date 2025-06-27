from app.db.mongo import db
from app.services.llm import build_prompt_quiz_transcript, query_llm, build_prompt_quiz_reinforce
from app.services.transcribe import get_Transcript
from datetime import datetime

chats_collection = db["chats"]

def quiz(chatId, videoId):
    chats = collect_previous_chats(chatId)
    transcript = [segment['text'] for segment in get_Transcript(videoId)]

    # normal_questions = return_transcript_questions(transcript)
    # reinforce_questions = return_reinforce_questions(chats)
    normal_questions = [
        {
            "id": "q1",
            "question": "What is the main topic discussed in the video?",
            "options": ["Artificial Intelligence", "Quantum Physics", "Photosynthesis", "World War II"],
            "answer": "Artificial Intelligence"
        },
        {
            "id": "q2",
            "question": "Which of the following is mentioned as a challenge?",
            "options": ["Data Storage", "Model Accuracy", "Water Scarcity", "Traffic Congestion"],
            "answer": "Model Accuracy"
        }
    ]

    reinforce_questions = [
        {
            "id": "r1",
            "question": "How does the speaker define 'AI alignment'?",
            "options": ["Making sure AI systems act as intended", "Increasing compute power", "Reducing bias in training data", "Improving GPU performance"],
            "answer": "Making sure AI systems act as intended"
        },
        {
            "id": "r2",
            "question": "Which solution was suggested to improve model interpretability?",
            "options": ["Use of smaller datasets", "Adding more layers", "Feature attribution techniques", "Regularization"],
            "answer": "Feature attribution techniques"
        }
    ]
    print("Returning")
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
    doc = chats_collection.find_one({"chatId": chatId})
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