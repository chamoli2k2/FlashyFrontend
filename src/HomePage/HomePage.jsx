import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="bg-gray-900 min-h-screen flex flex-col justify-center items-center">
      <header className="text-center text-white mb-10">
        <h1 className="text-5xl font-bold text-yellow-400 mb-4">Welcome to Flashy</h1>
        <p className="text-lg text-gray-300">The ultimate platform to create, share, and master flashcards.</p>
      </header>

      <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">Get Started</h2>
        <div className="flex justify-center space-x-4">
          <Link to="/signin" className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-full">
            Login
          </Link>
          <Link to="/signup" className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full">
            Sign Up
          </Link>
        </div>
      </div>

      <footer className="text-center text-gray-400 mt-12">
        <p>© 2024 Flashy. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
