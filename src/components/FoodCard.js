import React from 'react';

const FoodCard = ({ food, userType, onAccept, onStatusUpdate }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'picked': return 'bg-yellow-100 text-yellow-800';
      case 'delivered': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available': return '🟢';
      case 'accepted': return '🔵';
      case 'picked': return '🟡';
      case 'delivered': return '🟣';
      default: return '⚪';
    }
  };

  const handleStatusUpdate = (newStatus) => {
    if (onStatusUpdate) {
      onStatusUpdate(food.id, newStatus);
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow bg-white">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-3">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(food.status)}`}>
            {getStatusIcon(food.status)} {food.status.charAt(0).toUpperCase() + food.status.slice(1)}
          </div>
          <div className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-700">
            {food.type === 'veg' ? '🥗 Veg' : food.type === 'non-veg' ? '🍗 Non-Veg' : '🪴 Jain'}
          </div>
        </div>
        <div className="text-lg font-bold text-green-600">
          {food.quantity} meals
        </div>
      </div>

      <div className="mb-3">
        <h3 className="font-semibold text-gray-800 text-lg">{food.items}</h3>
        {food.communityPoint && (
          <p className="text-sm text-green-600 mt-1">
            🏘️ To: {food.communityPoint}
          </p>
        )}
      </div>

      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div className="flex items-start">
          <span className="mr-2 mt-1">📍</span>
          <div>
            <div className="font-medium">{food.location}</div>
            {food.address && food.address !== food.location && (
              <div className="text-xs text-gray-500">{food.address}</div>
            )}
          </div>
        </div>
        <div className="flex items-center">
          <span className="mr-2">⏰</span>
          <span>{food.time}</span>
        </div>
        {food.distance && (
          <div className="flex items-center">
            <span className="mr-2">📏</span>
            <span>{food.distance} away</span>
          </div>
        )}
        {food.donor && (
          <div className="flex items-center">
            <span className="mr-2">👨‍🍳</span>
            <span>{food.donor}</span>
          </div>
        )}
      </div>

      {food.volunteer && (
        <div className="mb-3 p-2 bg-blue-50 rounded text-sm text-blue-700">
          <strong>Volunteer:</strong> {food.volunteer}
        </div>
      )}

      {food.feedback && (
        <div className="mb-3 p-2 bg-yellow-50 rounded text-sm text-yellow-700">
          <strong>Feedback:</strong> {'⭐'.repeat(food.feedback.rating)} - {food.feedback.comment}
        </div>
      )}

      {userType === 'volunteer' && food.status === 'available' && (
        <button
          onClick={() => onAccept(food.id)}
          className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors"
        >
          ✅ Accept Donation
        </button>
      )}

      {userType === 'volunteer' && food.status === 'accepted' && (
        <div className="flex space-x-2">
          <button 
            onClick={() => handleStatusUpdate('picked')}
            className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            🚗 Mark Picked Up
          </button>
          <button 
            onClick={() => handleStatusUpdate('delivered')}
            className="flex-1 bg-purple-500 text-white py-2 rounded-lg font-semibold hover:bg-purple-600 transition-colors"
          >
            ✅ Mark Delivered
          </button>
        </div>
      )}

      {userType === 'volunteer' && food.status === 'picked' && (
        <button 
          onClick={() => handleStatusUpdate('delivered')}
          className="w-full bg-purple-500 text-white py-2 rounded-lg font-semibold hover:bg-purple-600 transition-colors"
        >
          🎉 Mark as Delivered
        </button>
      )}

      {food.timestamp && (
        <div className="text-xs text-gray-500 mt-2">
          Posted: {new Date(food.timestamp).toLocaleDateString()} at {new Date(food.timestamp).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default FoodCard;