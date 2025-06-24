import logging 
import langchain
import tiktoken
import time

from ..services.transcribe import get_Transcript
from ..services.vectorization import embed_texts
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document


logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')


format_document_for_db(chunks_data, video_id):
    mongo_documents = []
    for i, chunk in enumerate(chunks_data):
        vector = {
            "video_id": video_id,
            "chunk_index": i,
            "text": chunk["text"],
            "embedding": chunk["embedding"]
        }
        mongo_documents.append(vector)
    return mongo_documents


def chunk_transcript(raw_segments: list[dict], video_id: str, max_chunk_tokens: int =250, overlap_tokens: int = 50) -> list[dict]:
    if not raw_segments:
        logging.warning("No raw segments provided for chunking")
        return []
    
    #prepare raw segments as langchain objects
    documents =[]
    for i, segment in enumerate(raw_segments):
        segment_metadata = {
            "video_id" : video_id,
            "segment_index": i,
            "start_time_original": segment['start'], # Keep original start time
            "duration_original": segment['duration'], # Keep original duration
        }
        documents.append(Document(page_content=segment['text'], metadata=segment_metadata))


    #initialize langchain text splitter
    text_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
        chunk_size = max_chunk_tokens,
        chunk_overlap=overlap_tokens,
        separators=["\n\n", "\n", " ", ""] #heirarchy of delimmiters to try
    )

    #split the prepared documents into chunks
    chunked_documents = text_splitter.split_documents(documents)


    #process the chunked documents into the desired dictionary format
    processed_chunks =[]
    for i, doc_chunk in enumerate(chunked_documents):
        chunk_start_time = doc_chunk.metadata.get('start_time_original')

        processed_chunk = {
            'chunk_id': f"{video_id}_chunk{i}", #assigns unique id to each chunk
            'text': doc_chunk.page_content, #text context of this chunk
            'metadata': doc_chunk.metadata,
            'start_time': chunk_start_time, #approximate start time of this chunk
            'end_time' : None
        }
        processed_chunks.append(processed_chunk)

    return processed_chunks





def dataUpload(video_id: str):
    full_transcript = raw_segments = get_Transcript(video_id)

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
        logging.errror("Failed to generate embeddings")
        raise RuntimeError(f"Failed to generate embeddings {e}")


    #add embeddings to chunk dictionary
    for i, chunk in enumerate(chunks_data):
        chunk['embedding'] = ebmeddings[i]


    #combine all data for mongoDB
    final_document = format_document_for_db(chunks_data)
    print(final_document)


    """
    #save entire document by calling a function in mongo.py
    try:
        inserted_id = #function for instering(formatted_document)
        if inserted_id:
            logging.info("Successful insert of document to database")
            return
        else:
            logging.error(f"Failed to save data for video id")
            raise RuntimeError("Database Save error")
    except Exception as e:
        logging.error(f"Error during DB save for video")
        raise RuntimeError(f"Database save error")
        """




"""
if __name__ == "__main__":
    test_video_id = "ua-CiDNNj30"
    start_time = time.time()  
    chunks_data = dataUpload(test_video_id)
    duration = time.time() - start_time
    logging.info(f"Transcript chunked in {duration:.2f} seconds.")
"""