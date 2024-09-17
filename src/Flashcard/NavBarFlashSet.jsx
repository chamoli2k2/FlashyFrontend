import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { showToast } from "../Redux/reducers/toastReducer.js";
import Modal from "../Modal/Modal.jsx";
import { constants } from "../constants/constants.js";
import { useParams } from "react-router-dom";

const NavBarFlashSet = ({ profilePhoto }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { folderId } = useParams();

  const handleDropdownToggle = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleModalToggle = () => {
    setModalOpen(!isModalOpen);
  };

  const handleSearch = () => {
    // Implement search functionality here
  };

  const handleEditProfile = () => {
    navigate("/update-profile");
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    dispatch(
      showToast({
        message: "You have been logged out successfully!",
        type: "success",
      })
    );
    navigate("/");
  };

  const handleSubmit = async () => {
    if (!name) {
      dispatch(showToast("Name is required", "error"));
      return;
    }

    try {
      await axios.post(`${constants.BASE_URL_FLASHCARD}/${folderId}/sets/create`, {
        name,
        description,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      dispatch(showToast({ message: 'Flashcard set created successfully!!', type: 'success' }));
      setName("");
      setDescription("");
      handleModalToggle();
    } catch (error) {
      dispatch(showToast({ message: 'Error creating flashcard set!!', type: 'error' }));
      console.error("Error creating flashcard set:", error);
    }
  };

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      {/* Left: Logo */}
      <div className="flex items-center">
        <img
          width="48"
          height="48"
          src="https://img.icons8.com/color/48/books.png"
          alt="books"
        />
        <h1 className="text-3xl font-bold text-white ml-2">FLASHY</h1>
      </div>

      {/* Center: Search */}
      <div className="flex-grow mx-4 flex items-center">
        <input
          type="text"
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-2/3 px-4 py-2 rounded-l-lg bg-gray-700 text-white"
          placeholder="Search Flashcard Set..."
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-bold rounded-r-lg"
        >
          Search
        </button>
      </div>

      {/* Right: Create Set Button & Profile */}
      <div className="flex items-center">
        <button
          onClick={handleModalToggle}
          className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg mr-4"
        >
          Create Set
        </button>
        <div className="relative">
          <img
            src={profilePhoto}
            alt="Profile"
            className="w-10 h-10 rounded-full cursor-pointer"
            onClick={handleDropdownToggle}
          />
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-lg">
              <a
                href="#"
                className="block px-4 py-2 text-white hover:bg-gray-600"
                onClick={handleEditProfile}
              >
                Edit Profile
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-white hover:bg-gray-600"
                onClick={handleLogout}
              >
                Logout
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Creating Flashcard Set */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <Modal onClose={handleModalToggle}>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-2xl font-bold text-yellow-400 mb-4">Create Flashcard Set</h2>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2" htmlFor="name">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
                  placeholder="Enter flashcard set name"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-300 mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
                  placeholder="Enter flashcard set description"
                  rows="4"
                />
              </div>
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-white font-bold rounded-lg"
              >
                Submit
              </button>
            </div>
          </Modal>
        </div>
      )}
    </nav>
  );
};

export default NavBarFlashSet;
