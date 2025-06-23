import logging 
import langchain
import tiktoken

from ..services.transcribe import get_Transcript
from ..services.vectorization import embed_texts
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document


logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')



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





def dataUpload(video_id: str) -> str:
    print("I GOT CALLED")
    #fetch raw transcripts
    raw_segments = get_Transcript(video_id)

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
    print("\n--- BEGIN SEGMENTED CHUNKS FOR VERIFICATION (from dataUpload) ---")
    for i, chunk in enumerate(chunks_data):
        # NOTE: Since count_tokens function is removed, we can't show token count easily here.
        # If you still want a token count for debugging, you'd need to re-add count_tokens or:
        # temp_tokens = len(tiktoken.encoding_for_model("gpt-3.5-turbo").encode(chunk['text']))
        # and import tiktoken here
        print(f"--- Chunk {i+1} (Start: {chunk.get('start_time'):.2f}s, Text Length: {len(chunk['text'])} chars) ---")
        print(chunk['text'][:200] + "..." if len(chunk['text']) > 200 else chunk['text'])
    print("--- END SEGMENTED CHUNKS FOR VERIFICATION ---\n")





if __name__ == "__main__":
    test_video_id = "ua-CiDNNj30"

    try:
        result_message = dataUpload(test_video_id)
        print(f"SUCCESS: {result_message}")
    except Exception as e:
        print(f"\n--- Test FAILED for {test_video_id} ---")
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
