import { useEffect, useState, useRef } from "react";
import { VideoPlayer } from "../components/VideoPlayer";
import { ChatInterface } from "../components/Chatbox";
import { ActionButtons } from "../components/ActionsButtons";
import { LeaveSessionModal } from "../components/LeaveSessionModal"; 

export const Watch = () => {
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const shouldNavigateBack = useRef(false); 
  const [pendingAction, setPendingAction] = useState(null); 

useEffect(() => {
  const handlePopState = () => {
    if (shouldNavigateBack.current) {
      shouldNavigateBack.current = false; 
      return;
    }

    setShowLeaveModal(true);

    window.history.pushState(null, "", window.location.pathname);
  };

  window.history.pushState(null, "", window.location.pathname);
  window.addEventListener("popstate", handlePopState);

  return () => {
    window.removeEventListener("popstate", handlePopState);
  };
}, []);


  const handleStay = (e) => {
    e.preventDefault();
    setShowLeaveModal(false);
    setShouldNavigateBack(false);
    window.history.pushState(null, "", window.location.pathname);
  };

  const handleLeave = (e) => {
    e.preventDefault();
    setShowLeaveModal(false);
    shouldNavigateBack.current = true;

    window.history.back();
  };

  const handleGoHomeClick = () => {
    setPendingAction("home");
    setShowLeaveModal(true);
  };


  const videoId = sessionStorage.getItem("youtubeId");

  return (
    <div className="min-h-screen from-slate-50 pt-8 bg-base-100 px-5 md:px-[64px] overflow-visible">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-end items-center mb-10">
          <ActionButtons onGoHomeClick={handleGoHomeClick} />
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

      {/* ✅ Modal rendered here */}
      <LeaveSessionModal
        show={showLeaveModal}
        onStay={handleStay}
        onLeave={handleLeave}
      />
    </div>
  );
};