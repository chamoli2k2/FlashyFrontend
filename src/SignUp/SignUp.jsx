import React, { useState } from "react";
import { constants } from "../constants/constants.js";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showToast } from "../Redux/reducers/toastReducer.js";
import axios from "axios";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../firebaseConfig.jsx"; // Ensure this is your actual firebase config

// Initialize Firebase
initializeApp(firebaseConfig);

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(constants.REGISTER_USER_URL, formData);
      const data = response.data;

      if (response.status === 201) {
        dispatch(showToast({ message: "Registration Successful!", type: "success" }));

        const { token } = data;

        localStorage.setItem("accessToken", token);
        navigate("/feed");
      } else {
        dispatch(showToast({ message: data.message || "Registration Failed!", type: "error" }));
      }
    } catch (error) {
      dispatch(showToast({ message: error.message || "Registration Failed!", type: "error" }));
    } finally {
      setLoading(false);
    }
  };

  // Google Sign In
  const handleGoogleSignIn = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Construct user data to send to your backend
      const googleUserData = {
        username: user.displayName,
        email: user.email,
        password: user.uid, // Save Google UID in DB
      };

      const response = await axios.post(constants.REGISTER_USER_URL, googleUserData);
      const data = response.data;

      if (response.status === 201 || response.status === 200) {
        dispatch(showToast({ message: "Google Sign-In Successful!", type: "success" }));

        const { token } = data;

        localStorage.setItem("accessToken", token);
        navigate("/feed");
      } else {
        dispatch(showToast({ message: "Google Sign-In Failed!", type: "error" }));
      }
    } catch (error) {
      dispatch(showToast({ message: error.message || "Google Sign-In Failed!", type: "error" }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-center mb-6">
          <img
            src="https://img.icons8.com/color/48/books.png"
            alt="Flashy Logo"
            className="h-12 w-12"
          />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Get Started with FLASHY
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring focus:border-yellow-400"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring focus:border-yellow-400"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring focus:border-yellow-400"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center text-gray-600 mt-4">
          <p>or sign up with</p>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="mt-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg w-full flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              ></path>
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              ></path>
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
            </svg>
            Google
          </button>
        </div>

        <div className="text-center text-gray-600 mt-6">
          <p>
            Already have an account?{" "}
            <a href="/signin" className="text-yellow-400 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
