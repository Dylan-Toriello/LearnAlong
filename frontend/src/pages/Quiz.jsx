import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RotateCw } from "lucide-react"; 
import { LeaveSessionModal } from "../components/LeaveSessionModal";

export const QuizPage = () => {
  const [activeTab, setActiveTab] = useState("quiz");
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [pendingAction, setPendingAction] = useState(null); 
  const navigate = useNavigate();

  const sampleQuestions = [
    {
      id: 1,
      question: "What is React?",
      options: ["Library", "Framework", "Language", "Tool"],
      answer: "Library",
    },
    {
      id: 2,
      question: "What hook is used for state management?",
      options: ["useRef", "useEffect", "useState", "useContext"],
      answer: "useState",
    },
    {
      id: 3,
      question: "What is React?",
      options: ["Library", "Framework", "Language", "Tool"],
      answer: "Library",
    },
    {
      id: 4,
      question: "What is React?",
      options: ["Library", "Framework", "Language", "Tool"],
      answer: "Library",
    },
    {
      id: 5,
      question: "What is React?",
      options: ["Library", "Framework", "Language", "Tool"],
      answer: "Library",
    },
    {
      id: 6,
      question: "What is React?",
      options: ["Library", "Framework", "Language", "Tool"],
      answer: "Library",
    }
  ];

  const reinforcementQuestions = [
    {
      id: 7,
      question: "How do you pass props in React?",
      options: ["via state", "via Redux", "via attributes", "via hooks"],
      answer: "via attributes",
    },
  ];

  const handleAnswer = (qId, option) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [qId]: option,
    }));
  };

  const handleGoHomeClick = () => {
    setPendingAction("home");
    setShowLeaveModal(true);
  };
  const handleStay = () => {
    setShowLeaveModal(false);
    setPendingAction(null);
  };

  const handleLeave = () => {
    setShowLeaveModal(false);
    if (pendingAction === "home") {
      navigate("/"); 
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
  };

  const renderQuestions = (questions) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-5 md:px-[64px] mt-8">
    {questions.map((q) => (
      <div
        key={q.id}
        className="p-6 border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all bg-white min-h-[260px] flex flex-col justify-between"
      >
        <h4 className="font-semibold mb-4 text-slate-800 text-lg leading-snug">{q.question}</h4>
        <ul className="space-y-3">
          {q.options.map((opt, idx) => {
            const isSelected = selectedAnswers[q.id] === opt;
            const isCorrect = opt === q.answer;
            const showAnswer = selectedAnswers[q.id];

            return (
              <li
                key={idx}
                onClick={() => handleAnswer(q.id, opt)}
                className={`px-4 py-3 rounded-lg w-full text-center font-medium cursor-pointer border transition-all duration-150 ${
                  showAnswer
                    ? isCorrect
                      ? "bg-green-100 border-green-400 text-green-800"
                      : isSelected
                      ? "bg-red-100 border-red-400 text-red-800"
                      : "bg-slate-100 border-slate-200 text-slate-800"
                    : "text-slate-800 border-slate-300 hover:bg-slate-100"
                }`}
              >
                {opt}
              </li>
            );
          })}
        </ul>
      </div>
    ))}
  </div>
);

  return (
    <div className="min-h-screen py-8 bg-base-100 flex flex-col justify-between px-5 md:px-[64px]">
      <div>
        <h2 className="text-3xl font-bold mb-6 text-center">Quiz</h2>

        <div className="flex justify-center items-center mb-6 space-x-4">
          <button
            className={`btn ${
              activeTab === "quiz"
                ? "btn-primary"
                : "btn-neutral"
            }`}
            onClick={() => setActiveTab("quiz")}
          >
            Normal Quiz
          </button>
          <button
            className={`btn ${
              activeTab === "reinforcement"
                ?  "btn-primary"
                : "btn-neutral"
            }`}
            onClick={() => setActiveTab("reinforcement")}
          >
            Reinforcement Quiz
          </button>
          <div
            onClick={handleReset}
            className="text-gray-500 cursor-pointer"
            title="Retry Quiz"
        >
            <RotateCw className="w-6 h-6" />
        </div>
        </div>

        {activeTab === "quiz"
          ? renderQuestions(sampleQuestions)
          : renderQuestions(reinforcementQuestions)}
      </div>

      <div className="mt-12 px-6 md:px-20 pt-8 pb-2 flex justify-between items-center w-full">
        <button
        className="btn btn-sm sm:btn-md btn-primary shadow-md"
          onClick={() => navigate(-1)}
        >
          Learn More
        </button>
        <button
            className="btn btn-sm sm:btn-md btn-neutral shadow-md z-[0] mr-[8px]"
          onClick={handleGoHomeClick}
        >
          Go Home
        </button>
      </div>
      <LeaveSessionModal
              show={showLeaveModal}
              onStay={handleStay}
              onLeave={handleLeave}
      />
    </div>
  );
};
