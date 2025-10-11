import React from 'react';
import './DeleteConfirmationModal.css';

function DeleteConfirmationModal({ show, onHide, onConfirm }) {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete this submission?</p>
        <div className="modal-footer">
          <button onClick={onConfirm}>Yes, Delete</button>
          <button onClick={onHide}>No, Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmationModal;
