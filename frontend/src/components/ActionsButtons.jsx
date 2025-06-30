import React from "react";
import { useNavigate } from "react-router-dom";

export const ActionButtons = ({ onGoHomeClick, setLoading }) => {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleQuizClick = async () => {
    const chatId = sessionStorage.getItem("chatId");
    const videoId = sessionStorage.getItem("videoId");

    const existingNormal = sessionStorage.getItem("normal_questions");

    setLoading(true);
    const startTime = Date.now();

    try {
      const res = await fetch(`${backendUrl}/quiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatId, videoId }),
      });

      const data = await res.json();
      const elapsedTime = Date.now() - startTime;
      const remainingTime = 5000 - elapsedTime;

      if (remainingTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingTime));
      }

      if (res.ok) {
        if (!existingNormal) {
          sessionStorage.setItem("normal_questions", JSON.stringify(data.normal));
          sessionStorage.setItem("reinforce_questions", JSON.stringify(data.reinforce));
        } else {
          sessionStorage.setItem("reinforce_questions", JSON.stringify(data.reinforce));
        }
        setLoading(false);
        navigate("/quiz");
      } else {
        setLoading(false);
        console.error("Quiz API Error:", data.error);
      }
    } catch (err) {
      setLoading(false);
      console.error("Quiz fetch failed:", err);
    }
  };

  return (
    <>
      <button
        className="btn btn-sm sm:btn-md btn-neutral shadow-md z-[0] mr-[8px]"
        onClick={onGoHomeClick}
      >
        Go Home
      </button>
      <button
        className="btn btn-sm sm:btn-md btn-primary shadow-md"
        onClick={handleQuizClick}
      >
        Quiz Me
      </button>
    </>
  );
};
