import React, { useState } from "react";
import { FaSyncAlt, FaPlus, FaTrashAlt } from "react-icons/fa";
import axios from "axios";
import { useDispatch } from 'react-redux';
import { showToast } from "../Redux/reducers/toastReducer.js";
import { constants } from "../constants/constants.js";
import { useParams } from "react-router-dom";
import { PulseLoader } from 'react-spinners';
import { useNavigate } from "react-router-dom";

const FlashcardCreatePage = () => {
  const [frontText, setFrontText] = useState("");
  const [backText, setBackText] = useState("");
  const [images, setImages] = useState([]);
  const [audio, setAudio] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { folderId, flashcardSetId } = useParams();
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]); // Appending multiple images
  };

  const handleAudioChange = (e) => {
    setAudio(e.target.files[0]);
  };

  const handleImageRemove = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index)); // Remove image by index
  };

  const handleAudioRemove = () => {
    setAudio(null); // Remove audio file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("frontText", frontText);
    formData.append("backText", backText);
    images.forEach((image) => formData.append("images", image));
    if (audio) formData.append("voice", audio);

    try {
      setIsLoading(true); // Start loading
      await axios.post(
        `${constants.BASE_URL_FLASHCARD}/${folderId}/${flashcardSetId}/add-flashcard`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      dispatch(showToast({ message: "Flashcard added successfully!", type: "success" }));

      // Reset form fields
      setFrontText("");
      setBackText("");
      setImages([]);
      setAudio(null);
    } catch (error) {
      dispatch(showToast({ message: "Failed to add flashcard. Try again.", type: "error" }));
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const handleStudyFlashcards = () => {
    navigate(`/study-flashcard/${folderId}/${flashcardSetId}`);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-yellow-400 mb-6">Create Flashcard</h1>
        <p className="text-lg text-gray-300">Add a new flashcard to your set</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg max-w-[700px] w-full">
        {/* Front Text */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Front Text</label>
          <input
            type="text"
            value={frontText}
            onChange={(e) => setFrontText(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* Back Text */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Back Text</label>
          <input
            type="text"
            value={backText}
            onChange={(e) => setBackText(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* Image Input and Preview */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />

          {/* Image Previews */}
          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`preview-${index}`}
                    className="w-full h-32 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleImageRemove(index)}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Audio Input and Preview */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Audio</label>
          <input
            type="file"
            accept="audio/*"
            onChange={handleAudioChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />

          {/* Audio Preview */}
          {audio && (
            <div className="mt-4 flex items-center">
              <audio controls src={URL.createObjectURL(audio)} className="mr-4" />
              <button
                type="button"
                onClick={handleAudioRemove}
                className="bg-red-600 text-white rounded-full p-2 hover:bg-red-700"
              >
                <FaTrashAlt />
              </button>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 bg-yellow-400 text-black rounded-lg shadow-lg hover:bg-yellow-500 flex items-center text-lg"
          >
            {isLoading ? <PulseLoader size={8} color={"#000"} /> : <FaPlus className="mr-2" />}
            {isLoading ? "Adding..." : "Add Flashcard"}
          </button>

          <button
            type="button"
            className="px-8 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 flex items-center text-lg"
            onClick={handleStudyFlashcards}
          >
            <FaSyncAlt className="mr-2" />
            Study Flashcard Set
          </button>
        </div>
      </form>
    </div>
  );
};

export default FlashcardCreatePage;
