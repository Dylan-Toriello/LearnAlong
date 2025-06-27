from flask import Flask, request, jsonify
from app.pipelines.dataupload import dataUpload
from app.pipelines.chat import chat
from app.pipelines.quiz import quiz
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/upload_transcript", methods=["POST"])
def upload_video():
    data = request.json
    video_id = data.get("youtubeId")

    if not video_id:
        return jsonify({"error": "Missing video_id"}), 400

    try:
        # result = dataUpload(video_id)
        return jsonify({"chatId": video_id}), 200 #Just for testing
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/chat", methods=["POST"])
def handle_chat():
    data = request.json
    question = data.get("question")
    chat_id = data.get("chatId")
    video_id = data.get("youtubeId")

    if not question:
        return jsonify({"error": "Missing question"}), 400
    if not chat_id or not video_id:
        return jsonify({"error": "Missing chatId or youtubeId"}), 400

    try:
        response = chat(question, chat_id, video_id)
        return jsonify({"answer": response}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/quiz", methods=["POST"])
def handle_quiz():
    data = request.json
    video_id = data.get("video_id")

    if not video_id:
        return jsonify({"error": "Missing video_id"}), 400

    try:
        quiz_data = quiz(video_id)
        return jsonify({"quiz": quiz_data}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
