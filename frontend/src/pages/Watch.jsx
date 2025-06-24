import { useLocation, useNavigate } from "react-router-dom";
import { VideoPlayer } from "../components/VideoPlayer";
import { ChatInterface } from "../components/Chatbox";
import { ActionButtons } from "../components/ActionsButtons";

export const Watch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const videoUrl = location.state?.videoUrl;

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

  const videoId = getYouTubeId(videoUrl);

  return (
   <div className="min-h-screen from-slate-50 pt-8 bg-base-100 px-5 md:px-[64px] overflow-visible">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

      <div className="flex justify-end items-center mb-10">
        <ActionButtons />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        <div className="xl:col-span-2">
          <VideoPlayer videoId={videoId} />
        </div>

        <div className="xl:col-span-1">
          <div className="sticky top-8">
            <ChatInterface />
          </div>
        </div>
      </div>
    </div>
  </div>

  );
};
