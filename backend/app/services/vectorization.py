from sentence_transformers import SentenceTransformer
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

embedding_model = None

def get_embedding_model():   
    global embedding_model
    if embedding_model is None:
        model_name = "all-MiniLM-L6-v2" #Is returning a 384 length embeding
        try:
            embedding_model = SentenceTransformer(model_name) 
        except Exception as e:
            logging.error(f"Failed to load Transformer model '{model_name}': {e}")
    return embedding_model

def embed_texts(texts: list[str]) -> list[list[float]]:
    try:
        model = get_embedding_model()
        embeddings = model.encode(texts, show_progress_bar=False).tolist()
        return embeddings
    except Exception as e:
        logging.error(f"Error generating embeddings for {len(texts)} texts: {e}")
        return []


