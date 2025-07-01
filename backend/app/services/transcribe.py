#For testing video id: YQHsXMglC9A, ua-CiDNNj30
'''
I tested it out with a three minute video and an hour long video and they both took the same time to fetch the transcript.
It took approximately 1.20s everytime.
'''
from youtube_transcript_api import YouTubeTranscriptApi
import logging
from googleapiclient.discovery import build
from dotenv import load_dotenv
import os

load_dotenv()

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
youtube = build("youtube", "v3", developerKey=YOUTUBE_API_KEY)

def get_Transcript(video_id): 

    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)        
        return transcript

    except Exception as e:
        logging.error(f"Failed to fetch transcript: {e}")
        return None
    
def get_video_metadata(video_id):
    response = youtube.videos().list(
        part="snippet,contentDetails",
        id=video_id
    ).execute()

    if not response["items"]:
        return None

    item = response["items"][0]["snippet"]
    return {
        "title": item.get("title", ""),
        "description": item.get("description", ""),
        "channel": item.get("channelTitle", ""),
        "published_at": item.get("publishedAt", "")
    }

if __name__ == "__main__":
    print(get_video_metadata(video_id="YQHsXMglC9A"))