# backend/app/services/vectorization.pyf
rom sentence_transformers import SentenceTransformer
import logging
import os

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')


#instantiate embedding model
embedding_model = None


#Function to load and return embedding model
def get_embedding_model:

    #Loads the sentence transformer model (or returns already loaded instance)
    #ensures that the model is only loaded once per application lifecycle
    
    global embedding_model
    if embedding_model is None:
        model_name = os.getenv("EMBEDDING_MODEL_NAME", "all-MiniLM-L6-v2")
        try:
            embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
        except Exception as e:
            logging.error(f"Failed to load Transformer model '{model_name}': {e}")
            raise RuntimeError(f"Embedding model initialization failed: {e}. Check internet connection or model name.")
    return embedding_model



#function to generate embeddings
def embed_texts(texts: list[str]) -> list[list[float]]:
    """
    Generates embeddings for a list of text strings using the loaded model.

    Args:
        texts (list[str]): A list of strings to embed.

    Returns:
        list[list[float]]: A list of embeddings, where each embedding is a list of floats.
                           Returns an empty list if embedding fails.
    """

    try:
        model = get_embedding_model()
        embeddings = model.encode(texts, show_progress_bar=False).tolist()
        return embeddings
    except Exception as e:
        logging.error(f"Error generating embeddings for {len(texts)} texts: {e}")
        return []


