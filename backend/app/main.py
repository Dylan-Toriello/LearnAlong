from flask import Flask, request, jsonify
from pipelines.dataupload import dataUpload
from pipelines.chat import chat
from pipelines.quiz import quiz

app = Flask(__name__)

@app.route("/upload_transcript", methods=["POST"])
def upload_video():
    data = request.json
    video_id = data.get("video_id")

    if not video_id:
        return jsonify({"error": "Missing video_id"}), 400

    try:
        result = dataUpload(video_id)
        return jsonify({"message": result}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    question = data.get("question")

    if not question:
        return jsonify({"error": "Missing question"}), 400

    try:
        response = chat(question)
        return jsonify({"answer": response}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/quiz", methods=["POST"])
def quiz():
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
