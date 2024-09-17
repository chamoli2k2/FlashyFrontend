import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";
import NavBarFlashSet from "./NavBarFlashSet.jsx";
import { constants } from "../constants/constants.js";
import FlashcardSet from "./FlashcardSet.jsx";
import { useDispatch } from "react-redux";
import { showToast } from "../Redux/reducers/toastReducer.js";

const FlashcardSetPage = () => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState("");
  const dispatch = useDispatch();
  const { folderId } = useParams(); // Fetches folderId from the URL

  useEffect(() => {
    // Retrieve the access token from local storage
    const accessToken = localStorage.getItem("accessToken");

    // Fetch flashcard sets
    axios
      .get(`${constants.BASE_URL_FLASHCARD}/${folderId}/sets`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setFlashcardSets(response.data); // Update the state with fetched flashcard sets
      })
      .catch((error) => {
        console.error("Error fetching flashcard sets:", error);
      });

    // Fetch profile photo
    axios
      .get(`${constants.BASE_URL_USER}/profile`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setProfilePhoto(response.data.imageURL || "https://via.placeholder.com/150");
      })
      .catch((error) => console.error("Error fetching profile photo:", error));
  }, [folderId]); // Re-run when folderId changes


  return (
    <>
      <div className="min-h-screen bg-gray-900 text-white">
        <NavBarFlashSet
          profilePhoto={profilePhoto}
        />
        <div className="container mx-auto py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {flashcardSets.map((set) => (
              <FlashcardSet key={set._id} flashcardSet={set} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default FlashcardSetPage;
