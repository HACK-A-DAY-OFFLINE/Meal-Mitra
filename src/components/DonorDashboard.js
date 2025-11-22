import React, { useState, useEffect } from 'react';
import AIEstimation from './AIEstimation';
import FoodCard from './FoodCard';
import CommunityMap from './CommunityMap';
import FeedbackSystem from './FeedbackSystem';
import History from './History';
import { storage, defaultData } from '../utils/storage';

const DonorDashboard = ({ activeTab, setActiveTab }) => {
  const [foodPosts, setFoodPosts] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  // Load data from storage on component mount
  useEffect(() => {
    const savedPosts = storage.get('foodPosts');
    if (!savedPosts || savedPosts.length === 0) {
      storage.set('foodPosts', defaultData.foodPosts);
      storage.set('communityPoints', defaultData.communityPoints);
      storage.set('volunteers', defaultData.volunteers);
      setFoodPosts(defaultData.foodPosts);
    } else {
      setFoodPosts(savedPosts);
    }
  }, []);

  const stats = {
    totalMeals: foodPosts.reduce((sum, post) => sum + post.quantity, 0),
    activePosts: foodPosts.filter(post => post.status === 'pending' || post.status === 'accepted').length,
    completed: foodPosts.filter(post => post.status === 'delivered').length,
    impact: Math.floor(foodPosts.reduce((sum, post) => sum + post.quantity, 0) * 0.3)
  };

  const handlePostFood = (foodData) => {
    const communityPoints = storage.get('communityPoints', defaultData.communityPoints);
    const randomPoint = communityPoints[Math.floor(Math.random() * communityPoints.length)];
    
    const newPost = {
      ...foodData,
      id: Date.now(),
      status: 'pending',
      donor: 'Demo Restaurant',
      communityPoint: randomPoint.name,
      coordinates: userLocation || { lat: 19.0760, lng: 72.8777 },
      address: foodData.address || foodData.location,
      timestamp: new Date().getTime()
    };

    const updatedPosts = [...foodPosts, newPost];
    setFoodPosts(updatedPosts);
    storage.set('foodPosts', updatedPosts);

    const updatedPoints = communityPoints.map(point =>
      point.name === randomPoint.name 
        ? { ...point, meals: point.meals + foodData.quantity }
        : point
    );
    storage.set('communityPoints', updatedPoints);

    setActiveTab('dashboard');
  };

  const handleLocationSelect = (location) => {
    setUserLocation(location);
  };

  const handlePostFoodClick = () => {
    setActiveTab('post');
  };

  const handleTrackImpactClick = () => {
    setActiveTab('history');
  };

  const handleCommunityClick = () => {
    alert('🏘️ Community feature coming soon! This will connect you with local NGOs and community centers.');
  };

  const handleBackClick = () => {
    setActiveTab('dashboard');
  };

  // Back Button Component
  const BackButton = () => (
    <button
      onClick={handleBackClick}
      className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors mb-4"
    >
      <span>⬅️</span>
      <span>Back to Dashboard</span>
    </button>
  );

  if (activeTab === 'post') {
    return (
      <div className="space-y-6">
        <BackButton />
        <AIEstimation 
          onPost={handlePostFood} 
          onLocationSelect={handleLocationSelect}
          userLocation={userLocation}
        />
        <CommunityMap
          foodPosts={foodPosts}
          communityPoints={storage.get('communityPoints', [])}
          volunteers={storage.get('volunteers', [])}
          userLocation={userLocation}
          onLocationSelect={handleLocationSelect}
        />
      </div>
    );
  }

  if (activeTab === 'history') {
    return (
      <div className="space-y-6">
        <BackButton />
        <History userType="donor" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
          <div className="text-2xl font-bold text-green-600">{stats.totalMeals}+</div>
          <div className="text-gray-600">Meals Saved</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
          <div className="text-2xl font-bold text-blue-600">{stats.activePosts}</div>
          <div className="text-gray-600">Active Donations</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
          <div className="text-2xl font-bold text-purple-600">{stats.completed}</div>
          <div className="text-gray-600">Successful</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-500">
          <div className="text-2xl font-bold text-orange-600">{stats.impact}</div>
          <div className="text-gray-600">Lives Impacted</div>
        </div>
      </div>

      {/* Map and Active Posts Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CommunityMap
          foodPosts={foodPosts}
          communityPoints={storage.get('communityPoints', [])}
          volunteers={storage.get('volunteers', [])}
          userLocation={userLocation}
          onLocationSelect={handleLocationSelect}
        />
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Active Donations</h2>
          <div className="space-y-4">
            {foodPosts
              .filter(food => food.status === 'pending' || food.status === 'accepted')
              .map(food => (
                <FoodCard key={food.id} food={food} userType="donor" />
              ))}
            
            {foodPosts.filter(food => food.status === 'pending' || food.status === 'accepted').length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">🍽️</div>
                <p>No active donations</p>
                <p className="text-sm">Post some food to get started!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feedback System */}
      {foodPosts.length > 0 && (
        <FeedbackSystem foodId={foodPosts[0]?.id} />
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button 
          onClick={handlePostFoodClick}
          className="bg-green-500 text-white p-6 rounded-xl shadow-sm hover:bg-green-600 transition-all hover:scale-105 text-left group"
        >
          <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">➕</div>
          <div className="font-semibold">Post New Food</div>
          <div className="text-green-100 text-sm">Share leftover food</div>
        </button>
        
        <button 
          onClick={handleTrackImpactClick}
          className="bg-blue-500 text-white p-6 rounded-xl shadow-sm hover:bg-blue-600 transition-all hover:scale-105 text-left group"
        >
          <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📱</div>
          <div className="font-semibold">Track Impact</div>
          <div className="text-blue-100 text-sm">View your contribution</div>
        </button>
        
        <button 
          onClick={handleCommunityClick}
          className="bg-purple-500 text-white p-6 rounded-xl shadow-sm hover:bg-purple-600 transition-all hover:scale-105 text-left group"
        >
          <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">👥</div>
          <div className="font-semibold">Community</div>
          <div className="text-purple-100 text-sm">Connect with NGOs</div>
        </button>
      </div>
    </div>
  );
};

// In DonorDashboard component - already present
<div className="flex justify-between items-center mb-4 md:mb-6">
  <h1 className="text-xl md:text-2xl font-bold text-gray-800">🍛 MealMitra Donor</h1>
  <button 
    onClick={handleLogout}
    className="bg-red-500 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm md:text-base"
  >
    Logout
  </button>
</div>

export default DonorDashboard;
