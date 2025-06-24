import React, { useRef, useEffect } from 'react';

export const VideoPlayer = ({ videoId }) => {
  return (
    <div className="w-full">
      <div
        className="relative w-full bg-black rounded-2xl overflow-hidden shadow-2xl"
      >
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?rel=0&showinfo=0&modestbranding=1&controls=1`}
            title="Video Player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};
