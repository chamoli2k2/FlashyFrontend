import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showToast } from "../Redux/reducers/toastReducer.js";
import { constants } from "../constants/constants.js";

const FlashcardPage = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editFlashcard, setEditFlashcard] = useState({
    frontText: "",
    backText: "",
    images: [],
    audio: "",
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { folderId, flashcardSetId } = useParams();

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await axios.get(
          `${constants.BASE_URL_FLASHCARD}/${folderId}/sets/${flashcardSetId}/flashcards`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (response.data && response.data.length > 0) {
          setFlashcards(response.data);
        } else {
          setFlashcards([]);
          dispatch(
            showToast({
              message: "No flashcards found in this set",
              type: "error",
            })
          );
        }
      } catch (error) {
        console.error("Error fetching flashcards:", error);
        dispatch(
          showToast({ message: "Error fetching flashcards", type: "error" })
        );
      } finally {
        setLoading(false);
      }
    };

    if (folderId && flashcardSetId) {
      fetchFlashcards();
    }
  }, [folderId, flashcardSetId, dispatch]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNextFlashcard = () => {
    setIsFlipped(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
    setCurrentImageIndex(0);
  };

  const handlePreviousFlashcard = () => {
    setIsFlipped(false);
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length
    );
    setCurrentImageIndex(0);
  };

  const handleDeleteFlashcard = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.put(
        `${constants.BASE_URL_FLASHCARD}/delete-flashcard/${folderId}/${flashcardSetId}/${flashcards[currentIndex]._id}`,
        {}, // Empty body
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setFlashcards((prev) =>
        prev.filter((_, index) => index !== currentIndex)
      );
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length
      );
      dispatch(
        showToast({
          message: "Flashcard deleted successfully",
          type: "success",
        })
      );
    } catch (error) {
      dispatch(
        showToast({ message: "Error deleting flashcard", type: "error" })
      );
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleNextImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex + 1) % flashcards[currentIndex].images.length
    );
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + flashcards[currentIndex].images.length) %
        flashcards[currentIndex].images.length
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (flashcards.length === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
        <h1 className="text-3xl font-bold mb-6">No Flashcards Found</h1>
        <p className="text-xl mb-4">
          It looks like there are no flashcards available in this set.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-yellow-400 text-black rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-yellow-400 mb-6">Flashcard</h1>
      </div>

      <div className="w-[60vw] h-[60vh] bg-white shadow-xl relative text-center rounded-lg overflow-hidden">
        <div
          className={`w-full h-full flex flex-col justify-center items-center p-6 transition-transform duration-500 overflow-y-auto ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          {!isFlipped ? (
            <>
              <h2 className="text-2xl mb-4">
                {flashcards[currentIndex]?.frontText}
              </h2>
              {flashcards[currentIndex]?.images &&
                flashcards[currentIndex].images.length > 0 && (
                  <div className="relative">
                    <img
                      src={flashcards[currentIndex].images[currentImageIndex]}
                      alt="Flashcard visual"
                      className="max-w-full max-h-[250px] object-contain"
                    />
                    {flashcards[currentIndex].images.length > 1 && (
                      <div className="absolute top-1/2 transform -translate-y-1/2 flex justify-between w-full px-2">
                        <button
                          onClick={handlePreviousImage}
                          className="px-2 py-1 bg-gray-600 text-white rounded"
                        >
                          Prev
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="px-2 py-1 bg-gray-600 text-white rounded"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </div>
                )}
            </>
          ) : (
            <p className="text-2xl">{flashcards[currentIndex]?.backText}</p>
          )}
        </div>
      </div>

      <div className="flex mt-4 space-x-4">
        <button
          onClick={handlePreviousFlashcard}
          className="px-4 py-2 bg-gray-600 text-white rounded"
        >
          Previous
        </button>
        <button
          onClick={handleFlip}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {isFlipped ? "Show Front" : "Show Back"}
        </button>
        <button
          onClick={handleNextFlashcard}
          className="px-4 py-2 bg-gray-600 text-white rounded"
        >
          Next
        </button>
      </div>

      <div className="absolute bottom-6 right-6 flex space-x-4">
        <button
          onClick={handleDeleteFlashcard}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Delete
        </button>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-lg text-white w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this flashcard?</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardPage;
