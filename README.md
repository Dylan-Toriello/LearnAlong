# LearnAlong 
LearnAlong is an AI-powered web app that helps users learn better from YouTube videos. Just paste a video link, and the app extracts the transcript, allowing a chatbot to answer questions and quiz you based on the content.

[Demo](https://drive.google.com/file/d/12vQtcEtouM6PA6dxjPQeFY9NsW3OXjDm/view?usp=sharing)

---

## Features
- Paste a YouTube video link and extract its transcript
- Chat with an AI assistant based on the video content
- Generate quizzes from the video to test your understanding
- Seamless, full-stack experience with context-aware chat

---

## 🛠 Tech Stack

| Layer       | Tech Used |
|------------|-----------|
| Frontend   | React, Tailwind CSS, Vite |
| Backend    | Flask (Python) |
| Database   | MongoDB (Vector Search) |
| AI         | Sentence Transformers, LLaMA 2 via Hugging Face |
| Video Data | YouTube Transcript API |

---

## Required API Keys

To run the project, you'll need to set up a `.env` file in the `backend/` directory with the following keys:

```env
MONGO_URI=your_mongodb_connection_string
HF_API_TOKEN=your_huggingface_api_token
YOUTUBE_API_KEY=your_youtube_data_v3_api_key
```

### Where to get these keys:

- **`MONGO_URI`**  
  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), sign in or create an account.  
  - Create a new cluster (you can use the free tier)
  - Set up a new database and create a database user with a password
  - Click **Connect** → **Connect your application**
  - Copy the connection string (it will look like this):  
    ```
    mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
    ```

- **`HF_API_TOKEN`**  
  Visit [Hugging Face](https://huggingface.co/) and log in or create an account.  
  - Go to [Settings → Access Tokens](https://huggingface.co/settings/tokens)
  - Click **New Token**, give it a name, and select the appropriate scopes (read access is sufficient)
  - Copy the generated token

- **`YOUTUBE_API_KEY`**  
  Go to [Google Cloud Console](https://console.cloud.google.com/), sign in with your Google account.  
  - Create a new project (or use an existing one)
  - In the left sidebar, go to **APIs & Services** → **Library**
  - Search for and enable **YouTube Data API v3**
  - Go to **Credentials** → **Create Credentials** → **API Key**
  - Copy the generated API key

### Example .env file:

```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true&w=majority
HF_API_TOKEN=hf_abcd1234yourtoken
YOUTUBE_API_KEY=AIzaSyB-your-key-example
```
---

## Local Development

### 1. Clone the repository

```bash
git clone https://github.com/Dylan-Toriello/LearnAlong.git
cd learnalong
```

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

Create a .env file in the backend/ directory and paste your API keys (see the section above for how to get them).

Run the backend server:

 ```bash
python -m app.main
```
### 3. Frontend Setup (in a separate terminal)

```bash
cd frontend
npm install
npm run dev
```
The frontend will start at: http://localhost:5173

---

## Accessing the App

Once both the backend and frontend are running:

- Backend is available at: [http://localhost:5000](http://localhost:5000)
- Frontend is available at: [http://localhost:5173](http://localhost:5173)

Open the frontend in your browser and:
1. Paste a YouTube video link
2. Wait for the transcript to load
3. Start chatting with the AI assistant
4. Take a quiz generated from the video content!

Make sure your `.env` file is properly configured and the backend server is running before using the frontend.

---

## To-Do / Future Features

- **Multi-Video Session History**  
- **User Accounts & Login**  
- **Performance Analytics** 
- **Multi-language Support**  



