

export const LeaveSessionModal = ({ show, onStay, onLeave }) => {
  if (!show) return null;

  return (
    <dialog id="leave_modal" className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Leave this session?</h3>
        <p className="py-4">Are you sure you want to go back and close this session?</p>
        <div className="modal-action">
          <form method="dialog" className="flex gap-2">
            <button className="btn btn-neutral" onClick={onStay}>Stay</button>
            <button className="btn btn-error" onClick={onLeave}>Leave</button>
          </form>
        </div>
      </div>
    </dialog>
  );
};
