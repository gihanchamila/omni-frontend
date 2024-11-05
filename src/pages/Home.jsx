import React from 'react';
import Button from '../component/button/Button.jsx';

const Home = () => {
  return (
    <div className="grid grid-cols-12 min-h-[80vh]  gap-6 rounded-lg">
      {/* Left Column: Welcome User */}
      <div className="col-start-1 col-end-8 bg-gray-50 rounded-lg  p-4 flex items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-700">Welcome to Your Dashboard!</h1>
      </div>

      {/* Right Column: Links Section */}
      <div className="col-start-8 col-end-13 bg-gray-50 rounded-lg  p-4">
        {/* First Row: Profile and Settings Links */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-200 h-[17rem] rounded-lg p-4 flex items-center justify-center hover:bg-blue-600 transition duration-200">
            <Button label="Profile" />
          </div>
          <div className="bg-green-200 rounded-lg p-4 flex items-center justify-center hover:bg-green-600 transition duration-200">
            <Button label="Settings" />
          </div>
        </div>

        {/* Second Row: Create Post Link */}
        <div className="bg-orange-200 h-[17rem] rounded-lg p-4 flex items-center justify-center hover:bg-orange-600 transition duration-200">
          <Button label="Create Post" />
        </div>
        
      </div>
    </div>
  );
};

export default Home;
