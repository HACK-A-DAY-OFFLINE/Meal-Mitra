import React, { useState } from 'react';
import { storage } from '../utils/storage';

const FeedbackSystem = ({ foodId, onFeedbackSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const feedback = {
      id: Date.now(),
      foodId,
      rating,
      comment,
      timestamp: new Date().getTime()
    };

    // Save to storage
    const existingFeedbacks = storage.get('feedbacks', []);
    storage.set('feedbacks', [...existingFeedbacks, feedback]);

    // Update food post with feedback
    const foodPosts = storage.get('foodPosts', []);
    const updatedPosts = foodPosts.map(post => 
      post.id === foodId ? { ...post, feedback } : post
    );
    storage.set('foodPosts', updatedPosts);

    if (onFeedbackSubmit) {
      onFeedbackSubmit(feedback);
    }

    setRating(0);
    setComment('');
    setShowForm(false);
    alert('Thank you for your feedback! 🌟');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-xl font-semibold mb-4">💬 Share Your Experience</h3>
      
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
        >
          📝 Give Feedback
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How was your experience?
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-300'
                  } hover:text-yellow-400 transition-colors`}
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Comments
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this food donation..."
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              Submit Feedback
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Recent Feedbacks */}
      <div className="mt-6">
        <h4 className="font-semibold mb-3">Recent Feedback</h4>
        <div className="space-y-3">
          {storage.get('feedbacks', []).slice(-3).map(feedback => (
            <div key={feedback.id} className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex">
                  {'⭐'.repeat(feedback.rating)}
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(feedback.timestamp).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700 mt-1">{feedback.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedbackSystem;