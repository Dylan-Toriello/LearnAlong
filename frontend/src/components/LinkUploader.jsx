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
        <div className="flex h-full justify-center items-center">
            <form className="join" onSubmit={handleSubmit}>
                <div>
                <label className="input input-primary validator join-item w-[200px] md:w-[600px]">
                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
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
                        title="Must be valid URL"
                    />
                </label>
                </div>
                <button type="submit" className="btn btn-neutral join-item">Upload</button>
            </form>
        </div>
    );
};