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
        "max_tokens": 1200
    }

    response = requests.post(API_URL, headers=headers, json=payload)

    try:
        result = response.json()
        return result["choices"][0]["message"]["content"]
    except Exception as e:
        print("Failed to parse response:", response.text)
        raise e

def build_prompt_chat(context_segments, chat_history, user_question, video_metadata=None):
    title = video_metadata.get("title", "Unknown Title") if video_metadata else "Unknown Title"
    description = video_metadata.get("description", "")[:500] if video_metadata else ""
    channel = video_metadata.get("channel", "Unknown Channel") if video_metadata else "Unknown Channel"
    published = video_metadata.get("published_at", "Unknown Date") if video_metadata else "Unknown Date"

    system_prompt = (
        "You are a helpful and friendly AI assistant that helps users learn from a YouTube video.\n"
        "You are provided with transcript segments and video metadata.\n"
        "Your job is to answer user questions using both the video content and your own general knowledge.\n"
        "Follow these rules:\n"
        "1. Prioritize answering using the video transcript if the information is relevant and available.\n"
        "2. If the transcript doesn't provide enough information, feel free to use your general knowledge to help.\n"
        "3. Never mention transcripts, segments, metadata, or anything behind-the-scenes to the user.\n"
        "4. If the user is just being conversational (e.g., 'hello', 'thanks'), reply naturally and kindly.\n"
        "5. If the user's question is too broad or requires a long explanation, give a short helpful answer and suggest a few related YouTube search terms.\n"
        "6. Always keep responses under 1024 tokens.\n"
    )

    video_info = (
        f"Video Metadata:\n"
        f"- Title: {title}\n"
        f"- Channel: {channel}\n"
        f"- Published: {published}\n"
        f"- Description: {description}\n\n"
    )

    context_prompt = "\n".join([f"- {line}" for line in context_segments])
    context_text = f"Transcript segments:\n{context_prompt}\n\n"

    history_prompt = ""
    for msg in chat_history:
        if msg["role"] == "user":
            history_prompt += f"User: {msg['content']}\n"
        elif msg["role"] == "assistant":
            history_prompt += f"Assistant: {msg['content']}\n"

    full_prompt = (
        f"{system_prompt}\n\n"
        f"Video Information:\n{video_info}"
        f"Relevant Transcript Excerpts:\n{context_text}"
        f"Chat History:\n{history_prompt}"
        f"User's Question: {user_question}\n"
        f"Assistant:"
    )

    return full_prompt


def build_prompt_quiz_transcript(transcript_segments: list[str]) -> str:
    system_prompt = (
        "You are a helpful assistant that creates quiz questions to help users reinforce their understanding "
        "of a YouTube video based on the transcript segments below.\n"
        "Generate diverse multiple-choice questions.\n"
        "Decide on the number of questions based on the length of the transcript and the content present but never exceed 10"
        "Just give an array of the questions like this no text or anything before it or after it strictly"
        "Each question must follow this JSON format strictly:\n\n"
        "The answer field in the json should be the actual answer exactly as it is in the options spelled out"
        "{\n"
        '  "id": "q1",\n'
        '  "question": "What is the main topic discussed in the video?",\n'
        '  "options": ["Option A", "Option B", "Option C", "Option D"],\n'
        '  "answer": "Correct Option"\n'
        "}\n\n"
        "Make sure all questions are informative and directly based on the transcript."
    )

    context_text = "\n".join([f"- {line}" for line in transcript_segments])

    prompt = (
        f"{system_prompt}\n\n"
        f"Transcript Segments:\n{context_text}\n\n"
        f"Output exactly 5 questions in a Python list of JSON objects as described above.\n"
    )

    return prompt



def build_prompt_quiz_reinforce(chats: list[dict]) -> str:
    system_prompt = (
        "You are a helpful assistant that creates reinforcement quiz questions based on a user's past chat history.\n"
        "Generate quiz questions based on what the user and assistant discussed.\n"
        "Decide on the number of questions based on what the chat contains and how much the user talked with the assistant but never exceed 10 questions"
        "Just give an array of the questions like this no text or anything before it or after it strictly"
        "Each question must follow this JSON format strictly:\n\n"
        "The answer field in the json should be the actual answer exactly as it is in the options"
        "{\n"
        '  "id": "r1",\n'
        '  "question": "How does the speaker define AI alignment?",\n'
        '  "options": ["Option A", "Option B", "Option C", "Option D"],\n'
        '  "answer": "Correct Option"\n'
        "}\n\n"
        "Return all 5 questions in a Python list of JSON objects."
    )

    history_prompt = ""
    for msg in chats:
        if msg["role"] == "user":
            history_prompt += f"User: {msg['content']}\n"
        elif msg["role"] == "assistant":
            history_prompt += f"Assistant: {msg['content']}\n"

    prompt = (
        f"{system_prompt}\n\n"
        f"Chat History:\n{history_prompt}\n\n"
        f"Now generate 5 reinforcement questions in the exact JSON list format:"
    )

    return prompt



if __name__ == "__main__":
    print(query_llm("Hello how are you?"))