import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "./NavBar.jsx";
import { constants } from "../constants/constants.js";
import Folder from "./Folder.jsx";
import { useDispatch } from "react-redux";
import { showToast } from "../Redux/reducers/toastReducer.js";


const FeedPage = () => {
  const [folders, setFolders] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState("");
  const dispatch = useDispatch(); // Initialize the useDispatch hook

  useEffect(() => {
    // Retrieve the access token from local storage
    const accessToken = localStorage.getItem("accessToken");

    // Make the GET request with Authorization header
    axios
      .get(constants.BASE_URL_FLASHCARD + "/fetchallfolder", {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Set the Authorization header
        },
      })
      .then((response) => {
        setFolders(response.data); // Update the state with fetched folders
      })
      .catch((error) => {
        console.error("Error fetching folders:", error); // Handle errors
      });

    // Fetch profile photo from backend
    axios
      .get(`${constants.BASE_URL_USER}/profile`, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Set the Authorization header
        },
      })
      .then((response) => {
        setProfilePhoto(
          response.data.imageURL || "https://via.placeholder.com/150"
        ); // Fallback to dummy photo
      })
      .catch((error) => console.error("Error fetching profile photo:", error));
  }, []);

  const handleCreateFolder = (name) => {
    // Send folder name to backend
    axios
      .post(
        constants.BASE_URL_FLASHCARD,
        { name },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Set the Authorization header
          },
        }
      )
      .then((response) => {
        setFolders([...folders, response.data]);
        dispatch(showToast({ message: "Folder created successfully!", type: "success" }));
      })
      .catch((error) => {
        dispatch(showToast({ message: "Error creating folder!", type: "error" }));
        console.error("Error creating folder:", error);
      });
  };

  return (
    <>
      <div className="min-h-screen bg-gray-900 text-white">
        <NavBar
          onCreateFolder={handleCreateFolder}
          profilePhoto={profilePhoto}
        />
        <div className="container mx-auto py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {folders.map((folder) => (
              <Folder key={folder._id} folder={folder} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default FeedPage;
