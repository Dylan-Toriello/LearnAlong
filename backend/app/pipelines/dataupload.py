import loggging
import tiktoken #for token counting 


from services.transcribe import get_Transcript
from services.vectorization import embed_texts


logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')



def dataUpload():
    pass