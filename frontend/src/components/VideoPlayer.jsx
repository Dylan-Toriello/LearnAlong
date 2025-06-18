import React from "react";

export const VideoPlayer = ({ videoUrl }) => {
  if (!videoUrl) return (
    <div className="hero min-h-[calc(100vh-80px)]">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h2 className="text-2xl font-semibold mb-4">No video URL provided.</h2>
          <p className="text-base-content">Please return to the homepage and upload a YouTube link.</p>
        </div>
      </div>
    </div>
  );

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

  if (!videoId) return (
    <div className="hero min-h-[calc(100vh-80px)]">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h2 className="text-2xl font-semibold mb-4 text-error">Invalid YouTube link.</h2>
          <p className="text-base-content">Double-check the URL format and try again.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="hero min-h-[calc(100vh-80px)]">
      <div className="hero-content flex-col text-center">
        <div className="md:w-[60vw] md:h-[50vh] w-[35vh] h-[30vh]">
            <iframe
                className="w-full h-full rounded-box shadow-xl"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        </div>
      </div>
    </div>
  );
};
