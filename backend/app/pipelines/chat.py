from app.db.mongo import db
from app.services.vectorization import embed_texts
from app.services.llm import build_prompt_chat, query_llm
from datetime import datetime

chats_collection = db["chats"]
transcript_collection = db["transcript"]

def chat(question, chatId, videoId):
     context = collect_previous_chats(chatId)
     question_embedding = embed_texts([question])[0]
     chunks = vector_search_chunks(question_embedding, videoId)
     print(chunks)
     answer = return_answer(context, chunks, question)
     
     return answer

def return_answer(context, chunks, question):
     prompt = build_prompt_chat(context, chunks, question)
     answer = query_llm(prompt)
     return answer

def collect_previous_chats(chatId):
     chats = list(chats_collection.find({"chatId": chatId}).sort("timestamp", -1).limit(5))
     context = []
     for c in reversed(chats):  
          context.append({"role": "user", "content": c["question"]})
          context.append({"role": "assistant", "content": c["answer"]})
     return context

def send_chat_to_db(question, answer, chatId):
     chat_entry = {
          "chatId": chatId,
        "question": question,
        "answer": answer,
        "timestamp": datetime.utcnow()
    }

     result = chats_collection.insert_one(chat_entry)
     return str(result.inserted_id)


def vector_search_chunks(question_embedding, videoId):
     chunks = list(db.transcript.aggregate([
                              {
                              "$vectorSearch": {
                                   "index": "chunk_vector_search_index",
                                   "path": "embedding",
                                   "queryVector": question_embedding,
                                   "numCandidates": 100,
                                   "limit": 5,
                                   "filter": { "video_id": videoId }
                              }
                              }
                              ]))
     return chunks

if __name__ == "__main__":
     print(chat("What is the video about?", "Dylan", "abc123"))