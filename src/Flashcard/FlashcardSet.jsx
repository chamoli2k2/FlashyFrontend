import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { showToast } from "../Redux/reducers/toastReducer.js";
import { constants } from "../constants/constants.js";
import { useParams } from "react-router-dom";
import axios from "axios";

const FlashcardSet = ({ flashcardSet }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [confirmName, setConfirmName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const popupRef = useRef();
  const dispatch = useDispatch();
  const { folderId } = useParams();

  useEffect(() => {
    // Close the modal if clicked outside
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const openPopup = () => setShowPopup(true);

  const closePopup = () => {
    setShowPopup(false);
    setShowDeleteConfirm(false);
    setConfirmName("");
    setErrorMessage("");
  };

  const handleStudyFlashcards = () => {
    navigate(`/study-flashcard/${folderId}/${flashcardSet._id}`);
  };

  const handleAddFlashcard = () => {
    navigate(`/addflashcard/${folderId}/${flashcardSet._id}`);
  };

  const handleDeleteFlashcardSet = async () => {
    if (confirmName === flashcardSet.name) {
      // Make the API call to delete the flashcard set with ID as a query parameter
      await axios
        .put(
          `${constants.BASE_URL_FLASHCARD}/delete-set`, 
          {}, // Empty body
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
            params: {
              flashcardSetId: flashcardSet._id, // Passing flashcardSet._id as a query parameter
            },
          }
        )
        .then(() => {
          // Show success message on successful deletion
          dispatch(showToast({ message: 'Flashcard set deleted successfully!', type: 'success' }));
          closePopup();
        })
        .catch((error) => {
          // Show error message if something goes wrong
          console.error('Error deleting flashcard set:', error);
          dispatch(showToast({ message: 'Failed to delete flashcard set. Please try again.', type: 'error' }));
        });
    } else {
      // Show error message if the entered name doesn't match
      dispatch(showToast({ message: `Flashcard set name doesn't match.`, type: 'error' }));
    }
  };
  
  
  

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-lg cursor-pointer" onClick={openPopup}>
      <h3 className="text-xl font-semibold text-white">{flashcardSet.name}</h3>

      {/* Modal Popup */}
      {showPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-75"
        >
          <div
            className="bg-gray-800 text-white p-6 rounded-lg relative w-96"
            ref={popupRef}
          >
            {!showDeleteConfirm ? (
              <div className="text-center">
                <h2 className="text-lg font-bold mb-4">{flashcardSet.name}</h2>
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg w-full mb-2"
                  onClick={handleAddFlashcard}
                >
                  Add Flashcard
                </button>
                <button
                  className="bg-green-500 text-white py-2 px-4 rounded-lg w-full mb-2"
                  onClick={handleStudyFlashcards}
                >
                  Study Flashcards
                </button>
                <button
                  className="bg-red-500 text-white py-2 px-4 rounded-lg w-full"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Delete Flashcard Set
                </button>
              </div>
            ) : (
              <div className="text-center">
                <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
                <p className="text-sm text-gray-400 mb-4">
                  Type the name of the flashcard set "{flashcardSet.name}" to confirm deletion:
                </p>
                <input
                  type="text"
                  className="border border-gray-500 rounded-lg p-2 mb-2 w-full bg-gray-700 text-white"
                  value={confirmName}
                  onChange={(e) => setConfirmName(e.target.value)}
                  placeholder="Enter flashcard set name"
                />
                {errorMessage && (
                  <p className="text-red-500 text-sm mb-2">{errorMessage}</p>
                )}
                <button
                  className="bg-red-500 text-white py-2 px-4 rounded-lg w-full mb-2"
                  onClick={handleDeleteFlashcardSet}
                >
                  Confirm Delete
                </button>
                <button
                  className="bg-gray-600 text-white py-2 px-4 rounded-lg w-full"
                  onClick={closePopup}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardSet;
