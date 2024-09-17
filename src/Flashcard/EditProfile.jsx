import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useDispatch } from 'react-redux';
import { showToast } from "../Redux/reducers/toastReducer.js";
import axios from 'axios';
import { constants } from '../constants/constants.js';
import { useNavigate } from 'react-router-dom';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: '400px',
    background: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    borderRadius: '8px',
    padding: '20px',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(8px)',
  },
};

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [profilePhoto, setProfilePhoto] = useState("https://via.placeholder.com/150");
  const [username, setUsername] = useState('JohnDoe');
  const [email, setEmail] = useState('JohnDoe@mail.com');
  const [password, setPassword] = useState('********');
  const [otp, setOtp] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editField, setEditField] = useState('');
  const [newValue, setNewValue] = useState('');
  const [isOtpRequested, setIsOtpRequested] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const accessToken = localStorage.getItem('accessToken');

    axios
      .get(`${constants.BASE_URL_USER}/profile`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setProfilePhoto(response.data.imageURL || "https://via.placeholder.com/150");
        setUsername(response.data.name);
        setEmail(response.data.email);
      })
      .catch((error) => console.error("Error fetching profile:", error));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      const accessToken = localStorage.getItem('accessToken');

      axios
        .put(`${constants.BASE_URL_USER}/update-photo`, formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          setProfilePhoto(response.data.imageURL);
          dispatch(showToast({ message: 'Profile Photo Updated Successfully!', type: 'success' }));
        })
        .catch((error) => {
          dispatch(showToast({ message: 'An error occurred. Please try again.', type: 'error' }));
          console.error("Error updating profile photo:", error);
        });
    }
  };

  const openModal = (field) => {
    setEditField(field);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewValue('');
    setOtp('');
    setIsOtpRequested(false);
    setIsDeleteModalOpen(false);
  };

  const handleSave = () => {
    dispatch(showToast({ message: 'Profile updated successfully!', type: 'success' }));
    navigate('/feed');
  };

  const handleDelete = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.put(`${constants.BASE_URL_USER}/delete-account`, { feedback, otp }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200) {
        dispatch(showToast({ message: `Account deletion requested. If you don't log in within 15 days, your account will be deleted.`, type: 'success' }));
        // Logout user
        localStorage.clear();
        navigate('/');
      }
      else {
        dispatch(showToast({ message: 'Failed to delete account. Please try again.', type: 'error' }));
      }
      
    } catch (error) {
      dispatch(showToast({ message: 'Failed to delete account. Please try again.', type: 'error' }));
      console.error('Error deleting account:', error);
    }
  };

  const requestOtp = async () => {
    const accessToken = localStorage.getItem('accessToken');

    try {
      const response = await axios.post(`${constants.BASE_URL_USER}/generate-otp`, { email }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200) {
        setIsOtpRequested(true);
        dispatch(showToast({ message: 'OTP sent successfully!', type: 'success' }));
      }
    } catch (error) {
      dispatch(showToast({ message: 'Error sending OTP. Please try again.', type: 'error' }));
      console.error('Error sending OTP:', error);
    }
  };

  const handleOtpVerification = async () => {
    let updateData;
    let updateUrl = '';

    switch (editField) {
      case 'username':
        updateUrl = `${constants.BASE_URL_USER}/update-username`;
        updateData = { newUsername: newValue, otp };
        break;
      case 'password':
        updateUrl = `${constants.BASE_URL_USER}/update-password`;
        updateData = { newPassword: newValue, otp };
        break;
      default:
        dispatch(showToast({ message: 'Invalid field for update.', type: 'error' }));
        return;
    }

    try {
      const response = await axios.put(updateUrl, updateData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if(response.status === 200) {
        if (editField === 'username') setUsername(newValue);
        if (editField === 'password') setPassword(newValue);

        dispatch(showToast({ message: `${editField.charAt(0).toUpperCase() + editField.slice(1)} updated successfully!`, type: 'success' }));
        closeModal();
      }
    } catch (error) {
      dispatch(showToast({ message: 'Failed to update data. Please try again.', type: 'error' }));
      console.error('Error updating data:', error);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col justify-center items-center">
      <div className="bg-gray-800 text-white rounded-lg shadow-md p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <img
            className="w-24 h-24 rounded-full mx-auto object-cover"
            src={profilePhoto}
            alt="Profile"
          />
          <button
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-1 px-4 rounded-full mt-4"
            onClick={() => document.getElementById('upload-dp').click()}
          >
            Change DP
          </button>
          <input
            type="file"
            id="upload-dp"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-gray-300">Username</label>
              <input
                type="text"
                className="w-full mt-1 p-2 rounded bg-gray-700 text-white"
                value={username}
                readOnly
              />
            </div>
            <button
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-1 px-4 rounded-full"
              onClick={() => openModal('username')}
            >
              Change
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-gray-300">Email</label>
              <input
                type="email"
                className="w-full mt-1 p-2 rounded bg-gray-700 text-white"
                value={email}
                readOnly
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-gray-300">Password</label>
              <input
                type="password"
                className="w-full mt-1 p-2 rounded bg-gray-700 text-white"
                value={password}
                readOnly
              />
            </div>
            <button
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-1 px-4 rounded-full"
              onClick={() => openModal('password')}
            >
              Change
            </button>
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-full"
              onClick={handleSave}
            >
              Save Changes
            </button>
            <button
              type="button"
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Change Profile Field"
      >
        <h2 className="text-lg font-semibold mb-4">Change {editField}</h2>
        {!isOtpRequested ? (
          <>
            <input
              type="text"
              className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
              placeholder={`New ${editField}`}
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
            />
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full"
              onClick={requestOtp}
              disabled={newValue.trim() === ''}
            >
              Send OTP
            </button>
          </>
        ) : (
          <>
              <h3 className="text-sm font-semibold mb-2">Enter the OTP</h3>
              <input
                type="text"
                className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-full"
                disabled={otp.trim() === ''}
                onClick={handleOtpVerification}
              >
                Submit
              </button>
            </>
        )}
        <button
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full mt-4"
          onClick={closeModal}
        >
          Cancel
        </button>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Delete Account"
      >
        <h2 className="text-lg font-semibold mb-4">Delete Account</h2>
        {!isOtpRequested ? (
          <>
            <textarea
              className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
              placeholder="Provide your feedback (optional)"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full"
              onClick={requestOtp}
              disabled={feedback.trim() === ''}
            >
              Send OTP
            </button>
          </>
        ) : (
          <>
            <h3 className="text-sm font-semibold mb-2">Enter the OTP</h3>
            <input
              type="text"
              className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-full"
              disabled={otp.trim() === ''}
              onClick={handleDelete}
            >
              Submit
            </button>
          </>
        )}
        <button
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full mt-4"
          onClick={closeModal}
        >
          Cancel
        </button>
      </Modal>

    </div>
  );
};

export default EditProfile;
