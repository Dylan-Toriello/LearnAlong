import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const LinkUploader = ({ setLoading }) => {
  const [url, setUrl] = useState("");
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const videoId = getYouTubeId(url);

    if (!videoId) {
      alert("Invalid YouTube URL");
      return;
    }

    setLoading(true);

    const startTime = Date.now();

    try {
      const res = await fetch(`http://127.0.0.1:5000/upload_transcript`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId: videoId }),
      });

      const data = await res.json();
      const elapsedTime = Date.now() - startTime;

      const remainingTime = 5000 - elapsedTime;
      if (remainingTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingTime));
      }

      if (data.chatId) {
        const oldYoutubeId = sessionStorage.getItem("videoId");
        sessionStorage.removeItem("videoId");
        sessionStorage.removeItem("chatId");
        sessionStorage.removeItem(`chatMessages_${oldYoutubeId}`);
        sessionStorage.removeItem("normal_questions")
        sessionStorage.removeItem("reinforce_questions")

        sessionStorage.setItem("videoId", videoId);
        sessionStorage.setItem("chatId", data.chatId);
        setLoading(false);
        navigate("/watch");
      } else {
        alert("Could not start session");
        setLoading(false);
        navigate("/"); 
      }
    } catch (err) {
      console.error(err);
      alert("Server error starting session");
      setLoading(false);
      navigate("/"); 
    }
  };


    const getYouTubeId = (url) => {
        try {
          const urlObj = new URL(url);
          const idFromSearch = urlObj.searchParams.get("v");
          if (idFromSearch) return idFromSearch;
          if (urlObj.hostname === "youtu.be") return urlObj.pathname.slice(1);
          const parts = urlObj.pathname.split("/");
          return parts.includes("embed") ? parts[parts.length - 1] : null;
        } catch (err) {
          return null;
        }
      };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-xl"
    >
      <label className="input input-bordered input-primary flex items-center gap-2 w-full rounded-l-md rounded-r-none">
        <svg
          className="w-4 h-4 opacity-50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </g>
        </svg>
        <input
          type="url"
          required
          placeholder="Upload Video Link"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          pattern="^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$"
          title="Must be a valid YouTube URL"
          className="grow bg-transparent focus:outline-none focus:ring-0 focus:border-none"
        />
      </label>

      <button
        type="submit"
        className="btn btn-neutral rounded-l-none rounded-r-md"
      >
        Upload
      </button>
    </form>
  );
};
