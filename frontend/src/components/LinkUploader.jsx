import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const LinkUploader = () => {
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/watch", { state: { videoUrl: url } });
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
