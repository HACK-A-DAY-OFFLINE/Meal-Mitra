import React, { useState } from 'react';
import { popularLocations } from '../utils/storage';

const AIEstimation = ({ onPost, onLocationSelect, userLocation }) => {
  const [formData, setFormData] = useState({
    type: 'veg',
    items: '',
    location: '',
    address: '',
    time: '',
    image: null
  });
  const [estimatedQuantity, setEstimatedQuantity] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsAnalyzing(true);
      
      // Mock AI analysis
      setTimeout(() => {
        const randomEstimate = Math.floor(Math.random() * 20) + 10;
        setEstimatedQuantity(randomEstimate);
        setIsAnalyzing(false);
        setFormData(prev => ({ ...prev, image: URL.createObjectURL(file) }));
        
        // Auto-fill location if user allows
        if (useCurrentLocation && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const location = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                accuracy: position.coords.accuracy
              };
              const locationName = "Your Current Location";
              onLocationSelect(location, locationName);
              setFormData(prev => ({ 
                ...prev, 
                location: locationName,
                address: `Coordinates: ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`
              }));
            },
            (error) => {
              console.error('Location access denied:', error);
            }
          );
        }
      }, 2000);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          const locationName = "Your Current Location";
          onLocationSelect(location, locationName);
          setFormData(prev => ({ 
            ...prev, 
            location: locationName,
            address: `Coordinates: ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`
          }));
          setUseCurrentLocation(true);
        },
        (error) => {
          alert('Please allow location access for better volunteer matching.');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000
        }
      );
    }
  };

  const handleLocationSelect = (locationName, address = "") => {
    setFormData(prev => ({ 
      ...prev, 
      location: locationName,
      address: address || locationName
    }));
    setShowLocationSuggestions(false);
    
    // Set mock coordinates based on location name
    const locationMap = {
      "Taj Mahal Palace Hotel, Mumbai": { lat: 18.9217, lng: 72.8330 },
      "Tech Park Cafeteria, Andheri East": { lat: 19.1197, lng: 72.9054 },
      "Your Current Location": { lat: 19.0760, lng: 72.8777 },
      "Mumbai, Maharashtra": { lat: 19.0760, lng: 72.8777 }
    };
    
    const coordinates = locationMap[locationName] || { lat: 19.0760, lng: 72.8777 };
    onLocationSelect(coordinates, locationName);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.location) {
      alert('Please provide a pickup location');
      return;
    }

    const foodData = {
      ...formData,
      quantity: estimatedQuantity || 15,
      status: 'pending',
      coordinates: userLocation || { lat: 19.0760, lng: 72.8777 },
      address: formData.address || formData.location
    };

    onPost(foodData);
    
    // Reset form
    setFormData({ type: 'veg', items: '', location: '', address: '', time: '', image: null });
    setEstimatedQuantity(null);
    setUseCurrentLocation(false);
    
    alert('🎉 Food posted successfully! Volunteers nearby will be notified.');
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Post Food Donation</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Food Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Food Type</label>
          <div className="grid grid-cols-3 gap-3">
            {['veg', 'non-veg', 'jain'].map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type }))}
                className={`p-3 border rounded-lg text-center capitalize transition-all ${
                  formData.type === type 
                    ? 'border-green-500 bg-green-50 text-green-700 shadow-sm' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {type === 'veg' ? '🥗 Veg' : type === 'non-veg' ? '🍗 Non-Veg' : '🪴 Jain'}
              </button>
            ))}
          </div>
        </div>

        {/* Food Items */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Food Items
          </label>
          <input
            type="text"
            placeholder="e.g., Rice, Dal, Roti, Vegetables, Fruits..."
            value={formData.items}
            onChange={(e) => setFormData(prev => ({ ...prev, items: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>

        {/* AI Image Analysis */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Food Image (AI Analysis)
          </label>
          
          <div className="mb-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={useCurrentLocation}
                onChange={(e) => setUseCurrentLocation(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-600">
                Use my current location when uploading image
              </span>
            </label>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="food-image"
            />
            <label htmlFor="food-image" className="cursor-pointer">
              <div className="text-4xl mb-2">📸</div>
              <div className="text-gray-600">Click to upload food image</div>
              <div className="text-sm text-gray-500">AI will estimate quantity automatically</div>
            </label>
          </div>

          {isAnalyzing && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span className="text-blue-700">AI is analyzing your food image...</span>
              </div>
            </div>
          )}

          {estimatedQuantity && !isAnalyzing && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-green-700 font-semibold">
                  🎯 AI Estimate: {estimatedQuantity} meals
                </span>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setEstimatedQuantity(estimatedQuantity - 1)}
                    disabled={estimatedQuantity <= 1}
                    className="bg-gray-500 text-white px-2 py-1 rounded text-sm disabled:opacity-50 hover:bg-gray-600"
                  >
                    -1
                  </button>
                  <button
                    type="button"
                    onClick={() => setEstimatedQuantity(estimatedQuantity + 1)}
                    className="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600"
                  >
                    +1
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Location */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📍 Pickup Location
          </label>
          <div className="flex space-x-2 mb-2">
            <button
              type="button"
              onClick={getCurrentLocation}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
            >
              📍 Use Current Location
            </button>
            <button
              type="button"
              onClick={() => setShowLocationSuggestions(!showLocationSuggestions)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              📋 Popular Locations
            </button>
          </div>

          {showLocationSuggestions && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
              {popularLocations.map((location, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleLocationSelect(location)}
                  className="w-full text-left px-4 py-3 hover:bg-green-50 border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium">{location}</div>
                  <div className="text-sm text-gray-500">Mumbai, Maharashtra</div>
                </button>
              ))}
            </div>
          )}

          <input
            type="text"
            placeholder="Enter pickup location or select from above"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            onFocus={() => setShowLocationSuggestions(true)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
          
          {formData.address && (
            <p className="text-sm text-green-600 mt-1 flex items-center">
              <span className="mr-1">📍</span>
              {formData.address}
            </p>
          )}
        </div>

        {/* Pickup Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ⏰ Preferred Pickup Time
          </label>
          <input
            type="text"
            placeholder="e.g., 2:00 PM - 4:00 PM, Today 6-7 PM, etc."
            value={formData.time}
            onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-4 rounded-lg font-semibold shadow-lg hover:bg-green-600 transition-all hover:scale-105 flex items-center justify-center"
        >
          🚀 Post Food Donation
        </button>
      </form>
    </div>
  );
};

export default AIEstimation;