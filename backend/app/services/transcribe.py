#For testing video id: YQHsXMglC9A, ua-CiDNNj30
'''
I tested it out with a three minute video and an hour long video and they both took the same time to fetch the transcript.
It took approximately 1.20s everytime.
'''
from youtube_transcript_api import YouTubeTranscriptApi
import logging
import time

logging.basicConfig(level=logging.INFO)

def get_Transcript(video_id):
    start_time = time.time()  

    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        duration = time.time() - start_time
        logging.info(f"Transcript fetched in {duration:.2f} seconds.")
        
        return transcript

    except Exception as e:
        logging.error(f"Failed to fetch transcript: {e}")
        return None

if __name__ == "__main__":
    get_Transcript(video_id="YQHsXMglC9A")