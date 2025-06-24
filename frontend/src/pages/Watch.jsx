import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { VideoPlayer } from "../components/VideoPlayer";
import { ChatInterface } from "../components/Chatbox";
import { ActionButtons } from "../components/ActionsButtons";
import { LeaveSessionModal } from "../components/LeaveSessionModal";

export const Watch = () => {
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [shouldNavigateBack, setShouldNavigateBack] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); 
  const shouldForceLeaveRef = useRef(false); 
  const navigate = useNavigate(); 

  useEffect(() => {
    window.history.pushState({ modal: true }, "", window.location.pathname);

    const handlePopState = (event) => {
      if (shouldForceLeaveRef.current) {
        shouldForceLeaveRef.current = false;
        navigate("/"); 
        return;
      }

      if (event.state?.modal) {
        setShowLeaveModal(true);
        setShouldNavigateBack(true);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  const handleStay = (e) => {
    e.preventDefault();
    setShowLeaveModal(false);
    setShouldNavigateBack(false);
    window.history.pushState({ modal: true }, "", window.location.pathname); 
  };

  const handleLeave = (e) => {
    e.preventDefault();
    setShowLeaveModal(false);
    setShouldNavigateBack(false);
    setPendingAction(null); 
    shouldForceLeaveRef.current = true; 
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

      <LeaveSessionModal
        show={showLeaveModal}
        onStay={handleStay}
        onLeave={handleLeave}
      />
    </div>
  );
};
