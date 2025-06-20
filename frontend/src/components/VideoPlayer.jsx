import React from "react";
import { useNavigate } from "react-router-dom";

export const VideoPlayer = ({ videoId }) => {
  const navigate = useNavigate();

  if (!videoId) {
    return (
      <div className="hero min-h-[calc(100vh-80px)]">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h2 className="text-2xl font-semibold mb-4 text-error">Invalid YouTube link.</h2>
            <p className="text-base-content mb-4">Double-check the URL format and try again.</p>
            <button
              type="button"
              className="btn btn-neutral join-item"
              onClick={() => navigate("/")}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

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
