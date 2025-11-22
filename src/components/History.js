import React from 'react';
import { storage } from '../utils/storage';

const History = ({ userType }) => {
  const foodPosts = storage.get('foodPosts', []);
  
  const userPosts = userType === 'donor' 
    ? foodPosts.filter(post => post.donor === 'Demo Restaurant')
    : foodPosts.filter(post => post.volunteer === 'You');

  const stats = {
    totalDonations: userPosts.length,
    totalMeals: userPosts.reduce((sum, post) => sum + post.quantity, 0),
    completed: userPosts.filter(post => post.status === 'delivered').length,
    avgRating: userPosts.filter(post => post.feedback).reduce((sum, post) => sum + post.feedback.rating, 0) / 
               userPosts.filter(post => post.feedback).length || 0
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
          <div className="text-2xl font-bold text-green-600">{stats.totalDonations}</div>
          <div className="text-gray-600">Total {userType === 'donor' ? 'Donations' : 'Deliveries'}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
          <div className="text-2xl font-bold text-blue-600">{stats.totalMeals}</div>
          <div className="text-gray-600">Meals Distributed</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
          <div className="text-2xl font-bold text-purple-600">{stats.completed}</div>
          <div className="text-gray-600">Completed</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500">
          <div className="text-2xl font-bold text-yellow-600">{stats.avgRating.toFixed(1)}</div>
          <div className="text-gray-600">Avg Rating</div>
        </div>
      </div>

      {/* Community Impact */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">🌍 Community Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {storage.get('communityPoints', []).map(point => (
            <div key={point.id} className="border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">🏘️</div>
              <h3 className="font-semibold">{point.name}</h3>
              <p className="text-green-600 font-bold">{point.meals} meals served</p>
            </div>
          ))}
        </div>
      </div>

      {/* History List */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">📋 Your {userType === 'donor' ? 'Donation' : 'Delivery'} History</h2>
        <div className="space-y-4">
          {userPosts.length > 0 ? (
            userPosts.map(food => (
              <div key={food.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{food.items}</h3>
                    <p className="text-gray-600">{food.quantity} meals</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    food.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                    food.status === 'accepted' ? 'bg-blue-100 text-blue-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {food.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <p>📍 {food.location}</p>
                  <p>⏰ {food.time}</p>
                  {food.communityPoint && <p>🏘️ {food.communityPoint}</p>}
                  {food.volunteer && <p>🤝 Volunteer: {food.volunteer}</p>}
                  {food.feedback && (
                    <p className="text-yellow-600">⭐ {'⭐'.repeat(food.feedback.rating)} - {food.feedback.comment}</p>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {new Date(food.timestamp).toLocaleDateString()} at {new Date(food.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📭</div>
              <p>No {userType === 'donor' ? 'donations' : 'deliveries'} yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;