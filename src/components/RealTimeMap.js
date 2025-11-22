import React, { useEffect, useState } from 'react';

const RealTimeMap = ({ 
  foodPosts, 
  communityPoints, 
  volunteers, 
  userLocation, 
  onLocationSelect 
}) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [tracking, setTracking] = useState(false);
  const [locationHistory, setLocationHistory] = useState([]);

  // Get current location with high accuracy
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setTracking(true);
      
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date().getTime()
          };
          
          setCurrentLocation(location);
          
          // Get address from coordinates (mock implementation)
          const address = getAddressFromCoords(location.lat, location.lng);
          setLocationName(address);
          
          // Update location history
          setLocationHistory(prev => [...prev.slice(-9), location]);
          
          // Notify parent component
          if (onLocationSelect) {
            onLocationSelect(location, address);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setTracking(false);
          alert('Unable to get your location. Please enable location services.');
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  // Mock function to get address from coordinates
  const getAddressFromCoords = (lat, lng) => {
    const locations = {
      "19.0760,72.8777": "Nariman Point, Mumbai",
      "18.9217,72.8330": "Taj Mahal Palace Hotel, Colaba",
      "19.1197,72.9054": "Tech Park, Andheri East",
      "18.9067,72.8107": "Colaba Community Center",
      "19.1197,72.8464": "Andheri West Anganwadi",
      "19.0176,72.8420": "Shivaji Park, Dadar",
      "19.1334,72.9133": "IIT Bombay, Powai"
    };
    
    const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;
    return locations[key] || `Location (${lat.toFixed(6)}, ${lng.toFixed(6)})`;
  };

  const stopTracking = () => {
    setTracking(false);
    // In a real app, we'd clear the watch position here
  };

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1); // Distance in km
  };

  // Find nearest community points
  const getNearestPoints = () => {
    if (!currentLocation) return [];
    
    return communityPoints
      .map(point => ({
        ...point,
        distance: calculateDistance(
          currentLocation.lat, 
          currentLocation.lng, 
          point.lat, 
          point.lng
        )
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);
  };

  // Find nearest available food
  const getNearestFood = () => {
    if (!currentLocation) return [];
    
    return foodPosts
      .filter(food => food.status === 'available' || food.status === 'pending')
      .map(food => ({
        ...food,
        distance: calculateDistance(
          currentLocation.lat, 
          currentLocation.lng, 
          food.coordinates.lat, 
          food.coordinates.lng
        )
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);
  };

  const nearestPoints = getNearestPoints();
  const nearestFood = getNearestFood();

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">📍 Live Location Tracking</h3>
        <div className="flex space-x-2">
          {!tracking ? (
            <button
              onClick={getCurrentLocation}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center"
            >
              📍 Start Tracking
            </button>
          ) : (
            <button
              onClick={stopTracking}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center"
            >
              ⏹️ Stop Tracking
            </button>
          )}
        </div>
      </div>

      {/* Current Location Display */}
      {currentLocation && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start">
            <span className="text-blue-600 mr-3 text-xl">📍</span>
            <div className="flex-1">
              <div className="font-semibold text-blue-800">Your Current Location</div>
              <div className="text-sm text-blue-700 mt-1">{locationName}</div>
              <div className="text-xs text-blue-600 mt-1">
                Coordinates: {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
              </div>
              <div className="text-xs text-blue-500 mt-1">
                Accuracy: ±{currentLocation.accuracy} meters
              </div>
            </div>
            {tracking && (
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
                <span className="text-green-600 text-sm">Live</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Map Visualization */}
      <div className="h-80 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border-2 border-gray-300 relative overflow-hidden mb-4">
        {/* Mock Map with Points */}
        <div className="absolute inset-0 p-4">
          {/* User Location */}
          {currentLocation && (
            <div 
              className="absolute w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"
              style={{
                left: `${50 + (currentLocation.lng - 72.8777) * 1000}%`,
                top: `${50 - (currentLocation.lat - 19.0760) * 1000}%`,
                transform: 'translate(-50%, -50%)'
              }}
              title="Your Location"
            >
              <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          )}

          {/* Community Points */}
          {nearestPoints.map((point, index) => (
            <div
              key={point.id}
              className="absolute w-5 h-5 bg-green-500 rounded-full border-2 border-white shadow-lg"
              style={{
                left: `${50 + (point.lng - 72.8777) * 1000}%`,
                top: `${50 - (point.lat - 19.0760) * 1000}%`,
                transform: 'translate(-50%, -50%)'
              }}
              title={point.name}
            >
              <div className="text-xs text-white font-bold absolute -top-6 -left-2">🏘️</div>
            </div>
          ))}

          {/* Food Donations */}
          {nearestFood.map((food, index) => (
            <div
              key={food.id}
              className="absolute w-5 h-5 bg-red-500 rounded-full border-2 border-white shadow-lg"
              style={{
                left: `${50 + (food.coordinates.lng - 72.8777) * 1000}%`,
                top: `${50 - (food.coordinates.lat - 19.0760) * 1000}%`,
                transform: 'translate(-50%, -50%)'
              }}
              title={food.items}
            >
              <div className="text-xs text-white font-bold absolute -top-6 -left-2">🍽️</div>
            </div>
          ))}

          {/* Map Center */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400 text-sm">
            {!currentLocation ? 'Start tracking to see your location' : 'Mumbai Area'}
          </div>
        </div>
      </div>

      {/* Location Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nearest Community Points */}
        <div>
          <h4 className="font-semibold mb-2 text-sm">🏘️ Nearest Community Points</h4>
          <div className="space-y-2">
            {nearestPoints.map(point => (
              <div key={point.id} className="flex justify-between items-center p-2 bg-green-50 rounded text-xs">
                <span className="font-medium">{point.name}</span>
                <span className="bg-green-500 text-white px-2 py-1 rounded">{point.distance} km</span>
              </div>
            ))}
          </div>
        </div>

        {/* Nearest Food Donations */}
        <div>
          <h4 className="font-semibold mb-2 text-sm">🍽️ Nearest Food Donations</h4>
          <div className="space-y-2">
            {nearestFood.map(food => (
              <div key={food.id} className="flex justify-between items-center p-2 bg-red-50 rounded text-xs">
                <span className="font-medium truncate">{food.items}</span>
                <span className="bg-red-500 text-white px-2 py-1 rounded">{food.distance} km</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tracking Status */}
      {tracking && (
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-center text-sm text-yellow-800">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse mr-2"></div>
            <span>Live location tracking active - Updating every few seconds</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealTimeMap;