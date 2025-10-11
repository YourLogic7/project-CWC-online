import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditModal.css';

function EditModal({ show, onHide, data, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(data);

  useEffect(() => {
    setEditedData(data);
    setIsEditing(false); // Reset isEditing when data changes
  }, [data]);

  if (!show) {
    return null;
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_API_URL}/api/submissions/${editedData._id}`, editedData, {
        headers: { 'x-auth-token': token },
      });
      onUpdate(editedData);
      setIsEditing(false); // Set to false after saving
      onHide();
    } catch (error) {
      console.error('Error updating submission:', error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-header-title">Edit Submission</h2>
        <div className="modal-actions-top"> {/* New div for buttons */}
          {isEditing ? (
            <button onClick={handleSave}>Save</button>
          ) : (
            <button onClick={handleEditToggle}>Edit</button>
          )}
          <button onClick={onHide}>Close</button>
        </div>
        {/* Removed <button className="close-button" onClick={onHide}>X</button> */}
        <div className="modal-body">
          {Object.keys(editedData).map((key) => {
            if (key === '_id' || key === 'user' || typeof editedData[key] === 'object') return null;
            return (
              <div key={key} className="modal-field">
                <label>{key}</label>
                {isEditing ? (
                  <input
                    type="text"
                    name={key}
                    value={editedData[key]}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{editedData[key]}</p>
                )}
              </div>
            )
          })}
          {editedData.user && (
            <div className="modal-field">
              <label>User</label>
              <p>{editedData.user.nama}</p>
            </div>
          )}
        </div>
        {/* Removed modal-footer */}
      </div>
    </div>
  );
}

export default EditModal;
