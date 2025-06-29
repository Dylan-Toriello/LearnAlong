from bson import ObjectId

from app.db.mongo import db
from app.services.vectorization import embed_texts
from app.services.llm import build_prompt_chat, query_llm
from datetime import datetime

#6860e981c32e3bfd5d8735e0 for testing purposes

chats_collection = db["chats"]
transcript_collection = db["transcripts"]
videos_collection = db["videos"] 

def chat(question, chatId, videoId):
    chatId = ObjectId(chatId)
    chat_history = collect_previous_chats(chatId)
    question_embedding = embed_texts([question])[0]
    chunks = vector_search_chunks(question_embedding, videoId)
    video_metadata = videos_collection.find_one({"video_id": videoId}) or {}
    answer = return_answer(chunks, chat_history, question, video_metadata)
    send_chat_to_db(question, answer, chatId)
    return answer

def return_answer(context, chunks, question, video_metadata):
    prompt = build_prompt_chat(context, chunks, question, video_metadata)
    answer = query_llm(prompt)
    return answer

def collect_previous_chats(chatId):
    chat_doc = chats_collection.find_one({"_id": chatId})
    chat_history = []

    if chat_doc and "messages" in chat_doc:
        for msg in chat_doc["messages"][-5:]:
            chat_history.append({"role": "user", "content": msg["user"]})
            chat_history.append({"role": "assistant", "content": msg["ai"]})

    return chat_history

def send_chat_to_db(question, answer, chatId):
    chats_collection.update_one(
    {"_id": chatId},
    {
        "$push": {
            "messages": {
                            "user": question,
                            "ai": answer,
                            "timestamp": datetime.utcnow()
                        }
        }
    }
)

def vector_search_chunks(question_embedding, videoId):
    chunks = list(transcript_collection.aggregate([
        {
            "$vectorSearch": {
                "index": "chunk_vector_search_index",
                "path": "embedding",
                "queryVector": question_embedding,
                "numCandidates": 100,
                "limit": 10,
                "filter": { "video_id": videoId }
            }
        },
        {
            "$project": {
                "segment_text": "$metadata.original_text"
            }
        }
    ]))
            
    context = set()

    for chunk in chunks:
        if chunk['segment_text'] not in context:
            context.add(chunk['segment_text'])
 
    return list(context)

if __name__ == "__main__":
    chat_id = "6860e981c32e3bfd5d8735e0"
    video_id = "YQHsXMglC9A"

    while True:
        question = input("You: ").strip()
        if question.lower() in {"exit", "quit"}:
            print("Exiting chat. Goodbye!")
            break

        print("AI: ", chat(question, chat_id, video_id))
