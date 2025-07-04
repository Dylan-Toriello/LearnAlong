from flask import Flask, request, jsonify
from app.pipelines.dataupload import dataUpload
from app.pipelines.chat import chat
from app.pipelines.quiz import quiz
from flask_cors import CORS


app = Flask(__name__)
CORS(app, supports_credentials=True)

@app.route("/upload_transcript", methods=["POST"])
def upload_video():
    data = request.json
    video_id = data.get("videoId")

    if not video_id:
        return jsonify({"error": "Missing video_id"}), 400

    try:
        result = dataUpload(video_id)
        return jsonify({"chatId": result}), 200 
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
        answer = chat(question, chat_id, video_id)
        return jsonify({"answer": answer}), 200
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
