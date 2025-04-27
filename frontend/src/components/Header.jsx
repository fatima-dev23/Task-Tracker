import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdLogout } from "react-icons/md";
import { IoAddCircleOutline } from "react-icons/io5";

const Header = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="bg-gray-900 shadow-sm py-4 px-6 flex items-center justify-between">
      <div className="flex-1"><h1 className='text-3xl font-bold text-white'>TrackIt</h1></div> 

      <div className="flex-1 flex justify-center">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full px-4 py-2 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                onSearch('');
              }}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>
   
      <div className="flex-1 flex justify-end">
        <button
          onClick={handleLogout}
          className="bg-green-500 w-[90px] text-white px-4 py-2 rounded-sm hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;