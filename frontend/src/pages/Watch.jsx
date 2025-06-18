import { useLocation } from "react-router-dom";
import { VideoPlayer } from "../components/VideoPlayer";

export const Watch = () => {
  const location = useLocation();
  const videoUrl = location.state?.videoUrl;

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 text-center">
      <VideoPlayer videoUrl={videoUrl} />
    </ div>
  );
};
