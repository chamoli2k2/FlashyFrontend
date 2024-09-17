import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showToast } from '../Redux/reducers/toastReducer.js';

const NavBar = ({ onCreateFolder, profilePhoto }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate(); // Initialize the useNavigate hook
  const dispatch = useDispatch(); // Initialize the useDispatch hook


  const handleDropdownToggle = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleModalToggle = () => {
    setModalOpen(!isModalOpen);
  };

  const handleCreateFolder = () => {
    onCreateFolder(newFolderName);
    setNewFolderName('');
    setModalOpen(false);
  };

  const handleSearch = () => {
    // Implement search functionality here
  };


  const handleEditProfile = () => {
    // Navigate to the profile update page
    navigate('/update-profile');
  };

  const handleLogout = () => {
    console.log("hello")
      // Delete the access token from local storage
      localStorage.removeItem('accessToken');
      dispatch(showToast({ message: 'You have been Logout Successfull!', type: 'success' }));
      // Redirect to the login page or any other page
      navigate('/');
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
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-2/3 px-4 py-2 rounded-l-lg bg-gray-700 text-white"
          placeholder="Search folders..."
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-bold rounded-r-lg"
        >
          Search
        </button>
      </div>

      {/* Right: Create Folder Button & Profile */}
      <div className="flex items-center">
        <button
          onClick={handleModalToggle}
          className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg mr-4"
        >
          Create Folder
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

      {/* Modal for Creating Folder */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
          <div className="bg-gray-800 rounded-lg p-6 w-1/3">
            <h2 className="text-xl font-bold mb-4 text-white">Create New Folder</h2>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg mb-4 bg-gray-700 text-white"
              placeholder="Folder Name"
            />
            <button
              onClick={handleCreateFolder}
              className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg"
            >
              Add Folder
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
