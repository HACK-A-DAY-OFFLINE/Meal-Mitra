import React from 'react';

const Navbar = ({ user, userType, onLogout, onSwitchUser, activeTab, setActiveTab }) => {
  return (
    <nav className="bg-white shadow-lg border-b border-green-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="bg-green-100 p-2 rounded-lg">
                <span className="text-xl">🍛</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-800">MealMitra</span>
            </div>
            
            <div className="hidden md:flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-md font-medium transition-all ${
                  activeTab === 'dashboard' 
                    ? 'bg-white text-green-700 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                📊 Dashboard
              </button>
              <button
                onClick={() => setActiveTab('post')}
                className={`px-4 py-2 rounded-md font-medium transition-all ${
                  activeTab === 'post' 
                    ? 'bg-white text-green-700 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                ➕ Post Food
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2 rounded-md font-medium transition-all ${
                  activeTab === 'history' 
                    ? 'bg-white text-green-700 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                📋 History
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-green-50 rounded-lg p-1 border border-green-200">
              <button
                onClick={() => onSwitchUser('donor')}
                className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                  userType === 'donor' 
                    ? 'bg-green-500 text-white shadow-sm' 
                    : 'text-green-700 hover:bg-green-100'
                }`}
              >
                Donor
              </button>
              <button
                onClick={() => onSwitchUser('volunteer')}
                className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                  userType === 'volunteer' 
                    ? 'bg-blue-500 text-white shadow-sm' 
                    : 'text-blue-700 hover:bg-blue-100'
                }`}
              >
                Volunteer
              </button>
            </div>
            
            <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              👋 {user.name}
            </div>
            <button
              onClick={onLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors shadow-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;