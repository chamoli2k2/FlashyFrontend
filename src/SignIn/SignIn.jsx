import React, { useState } from "react";
import axios from "axios";
import { constants } from "../constants/constants.js";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showToast } from "../Redux/reducers/toastReducer.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"; // Import Firebase auth functions

const SignIn = () => {
  const dispatch = useDispatch(); // Initialize the useDispatch hook
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(constants.LOGIN_USER_URL, {
        email,
        password,
      });

      // If login is successful, show a success toast
      if (response.status === 200) {
        dispatch(showToast({ message: 'Login Successful!', type: 'success' }));
        // Extract the access token from the response
        const { token } = response.data;

        // Save the access token to local storage
        localStorage.setItem('accessToken', token);

        // Navigate to the feed page
        navigate('/feed');
      }
    } catch (error) {
      dispatch(showToast({ message: 'Login Failed!', type: 'error' }));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const googleUID = user.uid; // Get Google UID

      // Send Google UID to your backend as form data
      const response = await axios.post(constants.LOGIN_USER_URL, {
        email: user.email, // Optionally include email
        password: googleUID, // Use Google UID as password
      });

      // If login is successful, show a success toast
      if (response.status === 200) {
        dispatch(showToast({ message: 'Login Successful!', type: 'success' }));
        // Extract the access token from the response
        const { token } = response.data;

        // Save the access token to local storage
        localStorage.setItem('accessToken', token);

        // Navigate to the feed page
        navigate('/feed');
      }
    } catch (error) {
      dispatch(showToast({ message: 'Login Failed!', type: 'error' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-center mb-6">
          <img
            width="48"
            height="48"
            src="https://img.icons8.com/color/48/books.png"
            alt="books"
          />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Welcome Back to FLASHY
        </h2>

        <form onSubmit={handleClick}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring focus:border-yellow-400"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring focus:border-yellow-400"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center text-gray-600 mt-4">
          <p>or login with</p>
          <button
            type="button"
            className="mt-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg w-full flex items-center justify-center"
            onClick={handleGoogleSignIn}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="30"
              height="30"
              viewBox="0 0 48 48"
            >
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
            Don't have an account?{" "}
            <a href="/signup" className="text-yellow-400 hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
