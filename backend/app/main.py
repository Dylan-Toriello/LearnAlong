from flask import Flask, request, jsonify
from app.pipelines.dataupload import dataUpload
from app.pipelines.chat import chat
from app.pipelines.quiz import quiz
from flask_cors import CORS
import datetime

app = Flask(__name__)
CORS(app)
chats_collection = db["chats"]

@app.route("/upload_transcript", methods=["POST"])
def upload_video():
    data = request.json
    video_id = data.get("videoId")

    if not video_id:
        return jsonify({"error": "Missing video_id"}), 400

    try:
        new_session_doc = {
            "youtubeId": video_id,
            "messages": []
            "createdAt": datetime.utcnow()
        }
        result = chats_collection.insert_one(new_session_doc)
        new_id = str(result.inserted_id) #convert objectid to string since returning via JSON
        # result = dataUpload(video_id)
        return jsonify({"chatId": new_id}), 200 
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/chat", methods=["POST"])
def handle_chat():
    data = request.json
    question = data.get("question")
    chat_id = data.get("chatId")
    video_id = data.get("videoId")

    if not question:
        return jsonify({"error": "Missing question"}), 400
    if not chat_id or not video_id:
        return jsonify({"error": "Missing chatId or youtubeId"}), 400

    try:
        session_obj_id = ObjectId(chat_id)
        
        #push the users message to the database (Before getting the answer)
        chats_collection.update_one({
            {"_id": session_obj_id},
            {"$push": {"messages": {
                "role": "user",
                "content" : question,
            }},
            }
        })
        
        response = chat(question, chat_id, video_id)
        chat_sessions_collection.update_one(
            {"_id": session_obj_id},
            {"$push": {"messages": {
                "role": "assistant",
                "content": answer,
            }}
            }
        )
        return jsonify({"answer": response}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/quiz", methods=["POST"])
def handle_quiz():
    data = request.json
    video_id = data.get("videoId")
    chat_id = data.get("chatId")

    if not video_id:
        return jsonify({"error": "Missing video_id"}), 400
    if not chat_id:
        return jsonify({"error": "Missing chat_id"}), 400
    
    try:
        normal, reinforce = quiz(chat_id, video_id)
        return jsonify({"normal": normal, "reinforce": reinforce}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
