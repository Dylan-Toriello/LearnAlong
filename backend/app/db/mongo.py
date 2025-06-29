from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import os

load_dotenv()

try:
    client = MongoClient(os.getenv("MONGO_URI"), server_api=ServerApi('1'))
    client.admin.command("ping")
    db = client["learnalong"]
except Exception as e:
    print("Failed to connect to MongoDB:", e)
