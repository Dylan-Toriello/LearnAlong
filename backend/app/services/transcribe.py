#backend/app/services/transcript.py

from youtube_transcript_api import YoutubeTranscriptApi
import logging

def get_Transcript(video_id: str):
    """
    Fetches the transcript for a given YouTube video ID.

    Args:
        video_id (str): The YouTube video ID (e.g., 'dQw4w9WgXcQ').

    Returns:
        dict | None: A dictionary containing the transcript segments,
                     or None if the transcript cannot be retrieved.
                     Example format:
                     [
                         {'text': 'Hello,', 'start': 0.0, 'duration': 1.5},
                         {'text': 'world!', 'start': 1.5, 'duration': 1.0},
                         ...
                     ]
    """
