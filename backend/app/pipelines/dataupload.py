import logging 
import langchain
import tiktoken
import time

from ..services.transcribe import get_Transcript
from ..services.transcribe import get_video_metadata
from ..services.vectorization import embed_texts
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from app.db.mongo import db
from datetime import datetime

chats_collection = db["chats"]
transcripts_db = db["transcripts"]
videos_db = db['videos']

def format_document_for_db(chunks_data, video_id):
    mongo_documents = []
    for i, chunk in enumerate(chunks_data):
        vector = {
            "video_id": video_id,
            "chunk_index": i,
            "text": chunk["text"],
            "embedding": chunk["embedding"],
            "metadata": chunk.get("metadata", {})
        }
        mongo_documents.append(vector)
    return mongo_documents


def chunk_transcript(raw_segments: list[dict], video_id: str, max_chunk_tokens: int = 250, overlap_tokens: int = 50) -> list[dict]:
    if not raw_segments:
        logging.warning("No raw segments provided for chunking")
        return []

    documents = []
    for i, segment in enumerate(raw_segments):
        segment_metadata = {
            "segment_index": i,
            "segment_start_time": segment['start'],       
            "segment_end_time": segment['start'] + segment['duration'],
            "original_text": segment['text']
        }
        documents.append(Document(page_content=segment['text'], metadata=segment_metadata))

    text_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
        chunk_size=max_chunk_tokens,
        chunk_overlap=overlap_tokens,
        separators=["\n\n", "\n", " ", ""]
    )

    chunked_documents = text_splitter.split_documents(documents)

    processed_chunks = []
    for i, doc_chunk in enumerate(chunked_documents):
        processed_chunk = {
            'chunk_id': f"{video_id}_chunk{i}",
            'text': doc_chunk.page_content,
            'metadata': doc_chunk.metadata
        }
        processed_chunks.append(processed_chunk)

    return processed_chunks

def store_video_metadata(video_id, video_metadata):
    videos_db.update_one(
        {"video_id": video_id},
        {
            "$set": {
                "video_id": video_id,
                "title": video_metadata.get("title", ""),
                "description": video_metadata.get("description", ""),
                "channel": video_metadata.get("channel", ""),
                "published_at": video_metadata.get("published_at", "")
            }
        },
        upsert=True
    )

def dataUpload(video_id: str):
    existing = transcripts_db.find_one({ "video_id": video_id })

    new_session_doc = {
        "youtubeId": video_id,
        "messages": [],
        "createdAt": datetime.utcnow()
    }
    result = chats_collection.insert_one(new_session_doc)
    new_chat_id = str(result.inserted_id)

    if existing:
        logging.info(f"Transcript already exists for video_id '{video_id}'. Created new chat session only.")
        return new_chat_id

    raw_segments = get_Transcript(video_id)
    video_metadata = get_video_metadata(video_id)
    store_video_metadata(video_id, video_metadata)

    if not raw_segments:
        logging.warning("No Transcripts could be found")
        raise ValueError("Could not fetch transcripts for video")

    # 2. Prepare Transcript for Chunking & Metadata
    # Add video_id to each segment for potential use by chunk_id generation
    transcript_segments_with_id = [{**s, 'video_id': video_id} for s in raw_segments]

    #chunk the transcript using langchain splitter
    chunks_data = chunk_transcript(transcript_segments_with_id, video_id, max_chunk_tokens=250,overlap_tokens=50)
    if not chunks_data:
        logging.warning(f"No chunks generated for {video_id} after transcript fetch. Aborting.")
        raise ValueError("No processable chunks found in transcript.")

    #Extract text from chunks for embedding
    chunk_texts = [chunk['text'] for chunk in chunks_data]

    #generate embeddings for each chunk 
    try:
        embeddings = embed_texts(chunk_texts)
        if not embeddings:
            logging.error("Embedding generation failed")
            raise RuntimeError("Embedding generation failed or returned mismatched count.")
    except Exception as e:
        logging.error("Failed to generate embeddings")
        raise RuntimeError(f"Failed to generate embeddings {e}")

    #add embeddings to chunk dictionary
    for i, chunk in enumerate(chunks_data):
        chunk['embedding'] = embeddings[i]

    # #combine all data for mongoDB
    final_document = format_document_for_db(chunks_data, video_id)
    transcripts_db.insert_many(final_document)

    return new_chat_id

if __name__ == "__main__":
    test_video_id = "YQHsXMglC9A"
    chat_id = dataUpload(test_video_id)
    print(chat_id)
