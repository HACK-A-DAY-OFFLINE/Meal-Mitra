import React, { useState, useEffect } from 'react';
import FoodCard from './FoodCard';
import CommunityMap from './CommunityMap';
import FeedbackSystem from './FeedbackSystem';
import History from './History';
import { storage, defaultData } from '../utils/storage';

const VolunteerDashboard = ({ activeTab, setActiveTab }) => {
  const [availableFood, setAvailableFood] = useState([]);
  const [acceptedFood, setAcceptedFood] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [realTimeLocation, setRealTimeLocation] = useState(null);

  const [volunteerStats, setVolunteerStats] = useState({
    points: 2547,
    rank: 1,
    level: "Community Champion",
    nextLevel: 3000,
    achievements: [
      { name: "First Delivery", earned: true, icon: "🎯" },
      { name: "10 Meals Hero", earned: true, icon: "🍛" },
      { name: "Weekend Warrior", earned: true, icon: "🏆" },
      { name: "Rising Star", earned: false, icon: "⭐" },
      { name: "Community Hero", earned: false, icon: "🦸" },
      { name: "Food Savior", earned: false, icon: "💫" }
    ],
    badges: [
      { type: "deliveries", count: 47, icon: "🚚" },
      { type: "meals", count: 1200, icon: "🍽️" },
      { type: "communities", count: 8, icon: "🏘️" },
      { type: "rating", count: 4.9, icon: "⭐" }
    ]
  });

  useEffect(() => {
    const savedPosts = storage.get('foodPosts');
    if (!savedPosts || savedPosts.length === 0) {
      storage.set('foodPosts', defaultData.foodPosts);
      storage.set('communityPoints', defaultData.communityPoints);
      storage.set('volunteers', defaultData.volunteers);
      setAvailableFood(defaultData.foodPosts.filter(f => f.status === 'pending'));
    } else {
      setAvailableFood(savedPosts.filter(f => f.status === 'pending'));
      setAcceptedFood(savedPosts.filter(f => f.volunteer === 'You'));
    }
  }, []);

  const handleAccept = (foodId) => {
    const food = availableFood.find(f => f.id === foodId);
    const updatedFood = { 
      ...food, 
      status: 'accepted', 
      volunteer: 'You',
      timestamp: new Date().getTime()
    };
    
    const newAvailable = availableFood.filter(f => f.id !== foodId);
    setAvailableFood(newAvailable);
    
    const newAccepted = [...acceptedFood, updatedFood];
    setAcceptedFood(newAccepted);

    const allPosts = storage.get('foodPosts', []);
    const updatedPosts = allPosts.map(post => 
      post.id === foodId ? updatedFood : post
    );
    storage.set('foodPosts', updatedPosts);

    setVolunteerStats(prev => ({
      ...prev,
      points: prev.points + 10,
      badges: prev.badges.map(badge => 
        badge.type === "deliveries" 
          ? { ...badge, count: badge.count + 1 }
          : badge
      )
    }));
  };

  const handleStatusUpdate = (foodId, newStatus) => {
    const food = acceptedFood.find(f => f.id === foodId);
    const updatedAccepted = acceptedFood.map(foodItem =>
      foodItem.id === foodId ? { ...foodItem, status: newStatus } : foodItem
    );
    setAcceptedFood(updatedAccepted);

    const allPosts = storage.get('foodPosts', []);
    const updatedPosts = allPosts.map(post =>
      post.id === foodId ? { ...post, status: newStatus } : post
    );
    storage.set('foodPosts', updatedPosts);

    if (newStatus === 'picked') {
      setVolunteerStats(prev => ({
        ...prev,
        points: prev.points + 20
      }));
    } else if (newStatus === 'delivered') {
      const mealsDelivered = food?.quantity || 15;
      setVolunteerStats(prev => ({
        ...prev,
        points: prev.points + 50 + (mealsDelivered * 2),
        badges: prev.badges.map(badge => 
          badge.type === "meals" 
            ? { ...badge, count: badge.count + mealsDelivered }
            : badge.type === "communities"
            ? { ...badge, count: badge.count + 1 }
            : badge
        )
      }));

      const totalDeliveries = volunteerStats.badges.find(b => b.type === "deliveries").count + 1;
      if (totalDeliveries === 1) {
        unlockAchievement("First Delivery");
      } else if (totalDeliveries === 10) {
        unlockAchievement("10 Meals Hero");
      }

      alert(`🎉 Delivery completed! ${mealsDelivered} meals delivered successfully. +${50 + (mealsDelivered * 2)} points earned!`);
    }
  };

  const unlockAchievement = (achievementName) => {
    setVolunteerStats(prev => ({
      ...prev,
      achievements: prev.achievements.map(ach =>
        ach.name === achievementName ? { ...ach, earned: true } : ach
      ),
      points: prev.points + 100
    }));
  };

  const handleLocationSelect = (location, locationName) => {
    setUserLocation(location);
    setRealTimeLocation({ ...location, name: locationName });
    
    setVolunteerStats(prev => ({
      ...prev,
      points: prev.points + 5
    }));
  };

  const handleTrackImpactClick = () => {
    setActiveTab('history');
  };

  const handleCommunityClick = () => {
    alert('🏘️ Community feature coming soon! Connect with other volunteers and community centers.');
  };

  const handleLeaderboardClick = () => {
    alert('🏆 Leaderboard coming soon! See how you rank among other volunteers.');
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

  const stats = {
    deliveries: acceptedFood.filter(f => f.status === 'delivered').length,
    active: acceptedFood.filter(f => f.status === 'accepted').length,
    peopleHelped: acceptedFood.reduce((sum, food) => sum + food.quantity, 0),
    rating: '4.9'
  };

  const progressPercentage = (volunteerStats.points / volunteerStats.nextLevel) * 100;

  if (activeTab === 'history') {
    return (
      <div className="space-y-6">
        <BackButton />
        <History userType="volunteer" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Volunteer Points & Rewards System */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl shadow-lg p-6 text-white">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold">🏆 Your Impact</h2>
            <p className="text-purple-100">Level: {volunteerStats.level}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{volunteerStats.points}</div>
            <div className="text-purple-100">Total Points</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress to Next Level</span>
            <span>{volunteerStats.points} / {volunteerStats.nextLevel}</span>
          </div>
          <div className="w-full bg-purple-200 rounded-full h-3">
            <div 
              className="bg-yellow-400 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Badges */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {volunteerStats.badges.map((badge, index) => (
            <div key={index} className="text-center bg-white bg-opacity-20 rounded-lg p-2">
              <div className="text-xl">{badge.icon}</div>
              <div className="text-sm font-semibold">{badge.count}</div>
              <div className="text-xs text-purple-100 capitalize">{badge.type}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions for Volunteers */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <button 
            onClick={handleTrackImpactClick}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 transition-all p-2 rounded text-sm"
          >
            📊 Impact
          </button>
          <button 
            onClick={handleCommunityClick}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 transition-all p-2 rounded text-sm"
          >
            👥 Community
          </button>
          <button 
            onClick={handleLeaderboardClick}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 transition-all p-2 rounded text-sm"
          >
            🏆 Rank #{volunteerStats.rank}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
          <div className="text-2xl font-bold text-blue-600">{stats.deliveries}</div>
          <div className="text-gray-600">Deliveries</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
          <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          <div className="text-gray-600">Active</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
          <div className="text-2xl font-bold text-purple-600">{stats.peopleHelped}</div>
          <div className="text-gray-600">People Helped</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500">
          <div className="text-2xl font-bold text-yellow-600">{stats.rating}</div>
          <div className="text-gray-600">Rating</div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-semibold mb-4">🎯 Your Achievements</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {volunteerStats.achievements.map((achievement, index) => (
            <div 
              key={index}
              className={`p-3 rounded-lg border-2 text-center transition-all ${
                achievement.earned 
                  ? 'bg-green-50 border-green-300 text-green-800' 
                  : 'bg-gray-50 border-gray-200 text-gray-400'
              }`}
            >
              <div className="text-2xl mb-1">{achievement.icon}</div>
              <div className="text-sm font-medium">{achievement.name}</div>
              <div className="text-xs mt-1">
                {achievement.earned ? '✅ Unlocked' : '🔒 Locked'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-Time Map */}
      <CommunityMap
        foodPosts={[...availableFood, ...acceptedFood]}
        communityPoints={storage.get('communityPoints', [])}
        volunteers={storage.get('volunteers', [])}
        userLocation={userLocation}
        onLocationSelect={handleLocationSelect}
      />

      {/* Available Food Donations */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Food Donations</h2>
        <div className="space-y-4">
          {availableFood.map(food => (
            <FoodCard 
              key={food.id} 
              food={food} 
              userType="volunteer" 
              onAccept={handleAccept}
            />
          ))}
          
          {availableFood.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">🍽️</div>
              <p>No available donations right now</p>
              <p className="text-sm">Check back later for new donations</p>
            </div>
          )}
        </div>
      </div>

      {/* Your Accepted Donations */}
      {acceptedFood.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Accepted Donations</h2>
          <div className="space-y-4">
            {acceptedFood.map(food => (
              <FoodCard 
                key={food.id} 
                food={food} 
                userType="volunteer" 
                onStatusUpdate={handleStatusUpdate}
              />
            ))}
          </div>
        </div>
      )}

      {/* Feedback System */}
      {acceptedFood.length > 0 && (
        <FeedbackSystem foodId={acceptedFood[0]?.id} />
      )}
    </div>
  );
};

export default VolunteerDashboard;