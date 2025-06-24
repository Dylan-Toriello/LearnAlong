import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { VideoPlayer } from "../components/VideoPlayer";

export const Watch = () => {
  const location = useLocation();
  const videoUrl = location.state?.videoUrl;

  const getYouTubeId = (url) => {
    try {
      const urlObj = new URL(url);
      const idFromSearch = urlObj.searchParams.get("v");
      if (idFromSearch) return idFromSearch;

      if (urlObj.hostname === "youtu.be") {
        return urlObj.pathname.slice(1);
      }

      const parts = urlObj.pathname.split("/");
      return parts.includes("embed") ? parts[parts.length - 1] : null;
    } catch (err) {
      return null;
    }
  };

  const videoId = getYouTubeId(videoUrl);

  // useEffect(() => {
  //   const sendURLtoBackend = async () => {
  //     if (!videoId) return;

  //     try {
  //       const response = await fetch("http://localhost:5000/process-video", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ videoId }),
  //       });

  //       const data = await response.json();
  //       console.log("Backend response:", data);
  //     } catch (error) {
  //       console.error("Error sending video ID to backend:", error);
  //     }
  //   };

  //   sendURLtoBackend();
  // }, [videoId]);
  console.log(videoId);

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 text-center">
      <VideoPlayer videoId={videoId} />
    </div>
  );
};