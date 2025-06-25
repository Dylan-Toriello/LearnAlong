import os
from dotenv import load_dotenv
import requests

load_dotenv()

HF_API_TOKEN = os.getenv("HF_API_TOKEN")
API_URL = "https://router.huggingface.co/groq/openai/v1/chat/completions"

headers = {
    "Authorization": f"Bearer {HF_API_TOKEN}",
    "Content-Type": "application/json"
}


def query_llm(prompt):
    payload = {
        "model": "llama3-8b-8192", 
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7,
        "max_tokens": 200
    }

    response = requests.post(API_URL, headers=headers, json=payload)

    try:
        result = response.json()
        return result["choices"][0]["message"]["content"]
    except Exception as e:
        print("Failed to parse response:", response.text)
        raise e

def build_prompt_chat(context, chunks, question):
    system_prompt = "You are a helpful assistant that answers questions based on YouTube video transcripts."

    history = ""
    for msg in context:
        role = "User" if msg["role"] == "user" else "Assistant"
        history += f"{role}: {msg['content']}\n"

    if chunks and "text" in chunks[0]:
        transcript = "\n".join([f"[{i+1}] {chunk['text']}" for i, chunk in enumerate(chunks)])
    else:
        transcript = ""

    prompt = f"""{system_prompt}

                Transcript Chunks:
                {transcript}

                Conversation History:
                {history}

                User: {question}
                Assistant:"""

    return prompt


if __name__ == "__main__":
    print(query_llm("Hello how are you?"))