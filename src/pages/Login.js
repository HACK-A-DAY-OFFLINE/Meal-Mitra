import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('donor');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password, userType);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <span className="text-3xl">🍛</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">MealMitra</h1>
          <p className="text-gray-600 mt-2">Connecting Food, Fighting Hunger</p>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setUserType('donor')}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
              userType === 'donor' 
                ? 'bg-green-500 text-white shadow-lg' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            🍽️ Food Donor
          </button>
          <button
            onClick={() => setUserType('volunteer')}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
              userType === 'volunteer' 
                ? 'bg-blue-500 text-white shadow-lg' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            🤝 Volunteer
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            Login to MealMitra
          </button>
        </form>

        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <p className="text-center text-green-800 text-sm">
            <strong>Demo Login:</strong> Use any email & password
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;