import React from 'react';
import { Link } from 'react-router-dom';

const Folder = ({ folder }) => {
  return (
    <Link to={`/flashcard-sets/${folder._id}`} className="block p-4 bg-gray-800 rounded-lg shadow-lg hover:bg-gray-700">
      <div className="text-xl font-bold text-white">{folder.name}</div>
    </Link>
  );
};

export default Folder;
