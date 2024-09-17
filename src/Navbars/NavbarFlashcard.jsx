import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showToast } from '../Redux/reducers/toastReducer.js';
import Modal from '../Modal/Modal.jsx';
import FlashcardForm from '../Flashcard/FlashCardForm.jsx';

const Navbar = ({ profilePhoto }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    navigate('/update-profile');
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    dispatch(showToast({ message: 'You have been Logout Successfully!', type: 'success' }));
    navigate('/');
  };

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center w-full max-w-6xl mx-auto">
      {/* Left: Logo */}
      <div className="flex items-center">
        <img
          width="36"
          height="36"
          src="https://img.icons8.com/color/36/books.png"
          alt="books"
        />
        <h1 className="text-2xl font-bold text-white ml-2">FLASHY</h1>
      </div>

      {/* Center: Search */}
      <div className="flex-grow mx-4 flex items-center">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-2/3 px-4 py-2 rounded-l-lg bg-gray-700 text-white text-sm"
          placeholder="Search Flashcard Set..."
        />
        <button
          onClick={handleSearch}
          className="px-3 py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-bold rounded-r-lg text-sm"
        >
          Search
        </button>
      </div>

      {/* Right: Create Flashcard Button & Profile */}
      <div className="flex items-center">
        <button
          onClick={handleModalToggle}
          className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-3 rounded-lg mr-4 text-sm"
        >
          Create Flashcard
        </button>
        <div className="relative">
          <img
            src={profilePhoto}
            alt="Profile"
            className="w-8 h-8 rounded-full cursor-pointer"
            onClick={handleDropdownToggle}
          />
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-gray-700 rounded-lg shadow-lg">
              <a 
                href="#" 
                className="block px-4 py-2 text-white hover:bg-gray-600 text-sm"
                onClick={handleEditProfile}
              >
                Edit Profile
              </a>
              <a 
                href="#" 
                className="block px-4 py-2 text-white hover:bg-gray-600 text-sm"
                onClick={handleLogout}
              >
                Logout
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Creating Flashcard */}
      {isModalOpen && (
        <Modal onClose={handleModalToggle}>
          <FlashcardForm />
        </Modal>
      )}
    </nav>
  );
};

export default Navbar;
