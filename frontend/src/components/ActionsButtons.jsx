import React from "react";
import { useNavigate } from "react-router-dom";

export const ActionButtons = ({ onQuizClick }) => {
  const navigate = useNavigate();

  return (
    <>
      <button
        className="btn btn-sm sm:btn-md btn-neutral shadow-md z-[0] mr-[8px]"
        onClick={() => navigate(-1)}
      >
        Go Back
      </button>
      <button
        className="btn btn-sm sm:btn-md btn-primary shadow-md"
        onClick={() => navigate("/quiz")}
      >
        Quiz Me
      </button>
    </>
  );
};
