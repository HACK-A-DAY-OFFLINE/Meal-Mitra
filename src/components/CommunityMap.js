import React, { useEffect, useState } from 'react';

const CommunityMap = ({ foodPosts, communityPoints, volunteers, userLocation, onLocationSelect }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    // Load Google Maps script
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=DEMO_KEY&libraries=places`;
      script.onload = () => setMapLoaded(true);
      document.head.appendChild(script);
    } else {
      setMapLoaded(true);
    }
  }, []);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          onLocationSelect(location, "Your Current Location");
          setSelectedLocation("Your Current Location");
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to Mumbai coordinates with location name
          onLocationSelect({ lat: 19.0760, lng: 72.8777 }, "Mumbai, Maharashtra");
          setSelectedLocation("Mumbai, Maharashtra");
        }
      );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">📍 Live Map View</h3>
        <button
          onClick={getLocation}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
        >
          📍 Get My Location
        </button>
      </div>

      {/* Selected Location Display */}
      {selectedLocation && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center">
            <span className="text-green-600 mr-2">📍</span>
            <div>
              <div className="font-semibold text-green-800">Selected Location</div>
              <div className="text-sm text-green-700">{selectedLocation}</div>
            </div>
          </div>
        </div>
      )}

      <div className="h-64 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
        {mapLoaded ? (
          <div className="text-center p-4">
            <div className="text-4xl mb-2">🗺️</div>
            <p className="text-gray-700 font-semibold">Google Maps Integrated</p>
            <p className="text-sm text-gray-600 mt-2">
              {selectedLocation ? 
                selectedLocation : 
                'Click "Get My Location" to see your position on map'
              }
            </p>
            
            {/* Mock Map Points */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-green-100 p-2 rounded">
                <div className="font-semibold">Community Points</div>
                <div>{communityPoints.length} locations</div>
              </div>
              <div className="bg-blue-100 p-2 rounded">
                <div className="font-semibold">Active Volunteers</div>
                <div>{volunteers.filter(v => v.status === 'available').length} nearby</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading Map...</p>
          </div>
        )}
      </div>

      {/* Map Legend */}
      <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span>Community Points ({communityPoints.length})</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span>Volunteers ({volunteers.length})</span>
        </div>
      </div>

      {/* Nearby Community Points */}
      <div className="mt-4">
        <h4 className="font-semibold mb-3">🏘️ Nearby Community Points</h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {communityPoints.map(point => (
            <div key={point.id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
              <div>
                <div className="font-medium text-green-800">{point.name}</div>
                <div className="text-xs text-green-600">{point.address}</div>
              </div>
              <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                {point.meals} meals
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Active Volunteers */}
      <div className="mt-4">
        <h4 className="font-semibold mb-3">🤝 Active Volunteers Nearby</h4>
        <div className="space-y-2">
          {volunteers.filter(v => v.status === 'available').slice(0, 3).map(volunteer => (
            <div key={volunteer.id} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div>
                <div className="font-medium text-blue-800">{volunteer.name}</div>
                <div className="text-xs text-blue-600">{volunteer.location}</div>
              </div>
              <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">
                Available
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityMap;