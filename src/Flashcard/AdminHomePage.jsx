import React from 'react';
import { Link } from 'react-router-dom';

const AdminHomePage = ({ folders }) => {
  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center">
      <header className="text-center text-white mb-10">
        <h1 className="text-4xl font-bold text-yellow-400 mb-4">My Folders</h1>
      </header>

      <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Your Folders</h2>
        <ul className="space-y-4">
          {folders.map(folder => (
            <li key={folder._id} className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-sm">
              <span className="text-gray-800">{folder.name}</span>
              <Link to={`/folders/${folder._id}`} className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-full">
                View
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <Link to="/create-folder" className="mt-8 bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-full">
        Create New Folder
      </Link>

      <Link to="/" className="mt-4 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full">
        Back to Home
      </Link>
    </div>
  );
};

export default AdminHomePage;
