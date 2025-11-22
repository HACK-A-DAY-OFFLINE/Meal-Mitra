import React, { useState, useEffect } from 'react';

function App() {
  const [userType, setUserType] = useState('donor');
  const [user, setUser] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [foodPosts, setFoodPosts] = useState([]);
  const [acceptedFood, setAcceptedFood] = useState([]);
  const [currentPage, setCurrentPage] = useState('login');
  const [pageHistory, setPageHistory] = useState(['login']);
  const [stats, setStats] = useState({
    mealsSaved: 127,
    activePosts: 2,
    successRate: 89,
    volunteers: 42,
    deliveries: 47,
    mealsDelivered: 1200,
    rating: 4.9,
    rank: 1,
    farmProduceSaved: 56
  });
  const [email, setEmail] = useState('');

  // Load data from localStorage
  useEffect(() => {
    const savedFoodPosts = localStorage.getItem('mealmitra_foodPosts');
    const savedAcceptedFood = localStorage.getItem('mealmitra_acceptedFood');
    const savedStats = localStorage.getItem('mealmitra_stats');
    
    if (savedFoodPosts) setFoodPosts(JSON.parse(savedFoodPosts));
    if (savedAcceptedFood) setAcceptedFood(JSON.parse(savedAcceptedFood));
    if (savedStats) setStats(JSON.parse(savedStats));
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('mealmitra_foodPosts', JSON.stringify(foodPosts));
  }, [foodPosts]);

  useEffect(() => {
    localStorage.setItem('mealmitra_acceptedFood', JSON.stringify(acceptedFood));
  }, [acceptedFood]);

  useEffect(() => {
    localStorage.setItem('mealmitra_stats', JSON.stringify(stats));
  }, [stats]);

  // Mock data
  const mockFoodPosts = [
    {
      id: 1,
      items: 'Biryani, Salad, Raita',
      quantity: 25,
      location: 'Taj Hotel Kitchen, Colaba',
      time: '2:00 PM - 3:00 PM',
      status: 'available',
      distance: '1.2 km',
      donor: 'Taj Hotel',
      timestamp: new Date().getTime(),
      images: [],
      aiEstimate: 25,
      type: 'cooked'
    },
    {
      id: 2,
      items: 'Sandwiches & Fruits',
      quantity: 15,
      location: 'Tech Park Cafeteria, Andheri',
      time: '6:00 PM - 7:00 PM',
      status: 'available',
      distance: '0.8 km',
      donor: 'Tech Park Kitchen',
      timestamp: new Date().getTime(),
      images: [],
      aiEstimate: 15,
      type: 'cooked'
    },
    {
      id: 3,
      items: 'Fresh Tomatoes, Onions, Potatoes',
      quantity: 50,
      location: 'Farm Fresh, Nashik Highway',
      time: '8:00 AM - 5:00 PM',
      status: 'available',
      distance: '5.2 km',
      donor: 'Green Valley Farms',
      timestamp: new Date().getTime(),
      images: [],
      aiEstimate: 200,
      type: 'farm',
      category: 'vegetables'
    }
  ];

  // Initialize with mock data
  useEffect(() => {
    if (foodPosts.length === 0) {
      setFoodPosts(mockFoodPosts);
    }
  }, [foodPosts.length]);

  // Navigation
  const navigateTo = (page) => {
    setPageHistory(prev => [...prev, page]);
    setCurrentPage(page);
  };

  const handleBack = () => {
    if (pageHistory.length > 1) {
      const newHistory = [...pageHistory];
      newHistory.pop();
      const previousPage = newHistory[newHistory.length - 1];
      setPageHistory(newHistory);
      setCurrentPage(previousPage);
    }
  };

  // Login function
  const handleLogin = (email, password) => {
    const userData = { 
      email, 
      name: email.split('@')[0],
      userId: `MM${Date.now().toString().slice(-6)}`
    };
    setUser(userData);
    navigateTo('dashboard');
  };

  // Logout function
  const handleLogout = () => {
    setUser(null);
    setEmail('');
    setPageHistory(['login']);
    setCurrentPage('login');
  };

  // Location tracking
  const startLocationTracking = () => {
    if (navigator.geolocation) {
      setTracking(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          setCurrentLocation(location);
          setTracking(false);
        },
        (error) => {
          alert('Location access denied. Please enable location services.');
          setTracking(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  // AI Food Analysis - Enhanced for both cooked food and farm produce
  const analyzeFoodImage = async (imageFile, foodType = 'cooked') => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const fileName = imageFile.name.toLowerCase();
        let estimatedMeals = 0;
        let estimatedKgs = 0;
        let confidence = 0;
        let detectedItems = [];
        let analysisType = foodType === 'farm' ? 'produce' : 'meals';

        if (foodType === 'farm') {
          // Farm produce analysis
          if (fileName.includes('tomato') || fileName.includes('tomatoes')) {
            estimatedKgs = Math.floor(Math.random() * 20) + 10;
            estimatedMeals = estimatedKgs * 4; // 1kg ≈ 4 meals
            confidence = 88;
            detectedItems = ['Tomatoes', 'Fresh Vegetables', 'Farm Produce'];
          } else if (fileName.includes('potato') || fileName.includes('potatoes')) {
            estimatedKgs = Math.floor(Math.random() * 25) + 15;
            estimatedMeals = estimatedKgs * 5;
            confidence = 85;
            detectedItems = ['Potatoes', 'Root Vegetables', 'Farm Produce'];
          } else if (fileName.includes('onion') || fileName.includes('onions')) {
            estimatedKgs = Math.floor(Math.random() * 15) + 8;
            estimatedMeals = estimatedKgs * 6;
            confidence = 82;
            detectedItems = ['Onions', 'Bulb Vegetables', 'Farm Produce'];
          } else if (fileName.includes('vegetable') || fileName.includes('veg') || fileName.includes('produce')) {
            estimatedKgs = Math.floor(Math.random() * 30) + 20;
            estimatedMeals = estimatedKgs * 4;
            confidence = 80;
            detectedItems = ['Mixed Vegetables', 'Fresh Produce', 'Farm Harvest'];
          } else {
            const fileSizeInMB = imageFile.size / (1024 * 1024);
            estimatedKgs = Math.max(5, Math.floor(fileSizeInMB * 25));
            estimatedMeals = estimatedKgs * 4;
            confidence = Math.floor(Math.random() * 25) + 65;
            detectedItems = ['Fresh Farm Produce', 'Vegetables', 'Agricultural Goods'];
          }
        } else {
          // Cooked food analysis (existing logic)
          if (fileName.includes('biryani') || fileName.includes('rice') || fileName.includes('curry')) {
            estimatedMeals = Math.floor(Math.random() * 20) + 10;
            confidence = 85;
            detectedItems = ['Biryani', 'Rice', 'Curry', 'Vegetables'];
          } else if (fileName.includes('sandwich') || fileName.includes('bread')) {
            estimatedMeals = Math.floor(Math.random() * 15) + 5;
            confidence = 78;
            detectedItems = ['Sandwiches', 'Bread', 'Fillings'];
          } else if (fileName.includes('pizza') || fileName.includes('pasta')) {
            estimatedMeals = Math.floor(Math.random() * 8) + 4;
            confidence = 82;
            detectedItems = ['Pizza', 'Pasta', 'Italian Food'];
          } else {
            const fileSizeInMB = imageFile.size / (1024 * 1024);
            estimatedMeals = Math.max(5, Math.floor(fileSizeInMB * 15));
            confidence = Math.floor(Math.random() * 30) + 60;
            detectedItems = ['Prepared Food', 'Multiple Servings'];
          }
        }

        resolve({
          estimatedMeals,
          estimatedKgs: foodType === 'farm' ? estimatedKgs : undefined,
          confidence,
          detectedItems,
          analysisType,
          message: foodType === 'farm' 
            ? `AI estimates ~${estimatedKgs} kgs (${estimatedMeals} meals)` 
            : `AI estimates ~${estimatedMeals} meals`
        });
      }, 1500);
    });
  };

  // Food functions
  const handlePostFood = () => {
    navigateTo('post-food');
  };

  const handlePostFarmProduce = () => {
    navigateTo('post-farm-produce');
  };

  const handleSubmitFood = (foodData) => {
    const newFood = {
      id: Date.now(),
      ...foodData,
      status: 'available',
      timestamp: new Date().getTime(),
      donor: user?.name || 'Anonymous Donor',
      distance: `${(Math.random() * 2 + 0.5).toFixed(1)} km`,
      userId: user?.userId
    };
    
    setFoodPosts(prev => [...prev, newFood]);
    
    // Update stats based on food type
    if (foodData.type === 'farm') {
      setStats(prev => ({ 
        ...prev, 
        activePosts: prev.activePosts + 1,
        farmProduceSaved: prev.farmProduceSaved + parseInt(foodData.quantity),
        mealsSaved: prev.mealsSaved + parseInt(foodData.estimatedMeals || foodData.quantity * 4)
      }));
    } else {
      setStats(prev => ({ 
        ...prev, 
        activePosts: prev.activePosts + 1, 
        mealsSaved: prev.mealsSaved + parseInt(foodData.quantity) 
      }));
    }
    
    navigateTo('dashboard');
    alert(foodData.type === 'farm' ? '🌽 Farm produce posted successfully!' : '🍽️ Food posted successfully!');
  };

  const handleAcceptFood = (foodId) => {
    const food = foodPosts.find(f => f.id === foodId);
    const updatedFood = { ...food, status: 'accepted' };
    
    setFoodPosts(foodPosts.map(f => f.id === foodId ? updatedFood : f));
    setAcceptedFood(prev => [...prev, updatedFood]);
    
    alert(`✅ Accepted: ${food.items} (${food.quantity} ${food.type === 'farm' ? 'kgs' : 'meals'})`);
  };

  const handleMarkPicked = (foodId) => {
    setAcceptedFood(acceptedFood.map(f => 
      f.id === foodId ? { ...f, status: 'picked' } : f
    ));
    alert('🚗 Marked as picked up!');
  };

  const handleMarkDelivered = (foodId) => {
    const food = acceptedFood.find(f => f.id === foodId);
    setAcceptedFood(acceptedFood.map(f => 
      f.id === foodId ? { ...f, status: 'delivered' } : f
    ));
    setStats(prev => ({ 
      ...prev, 
      deliveries: prev.deliveries + 1,
      mealsDelivered: prev.mealsDelivered + (food.type === 'farm' ? food.estimatedMeals || food.quantity * 4 : food.quantity)
    }));
    alert('🎉 Delivery completed!');
  };

  const handleTrackImpact = () => navigateTo('impact');
  const handleCommunityConnect = () => navigateTo('community');
  const handleShareExperience = () => navigateTo('share');
  const handleViewHistory = () => navigateTo('history');

  // Login Page - Updated with farmer option
  const LoginPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-md">
        <div className="text-center mb-6 md:mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <span className="text-3xl">🍛</span>
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">MealMitra</h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base">Connecting Food, Fighting Hunger</p>
          <p className="text-green-600 text-xs mt-1">Preventing food waste & farm surplus</p>
        </div>

        <div className="flex gap-2 md:gap-4 mb-4 md:mb-6">
          <button
            onClick={() => setUserType('donor')}
            className={`flex-1 py-2 md:py-3 rounded-lg font-semibold transition-all text-sm md:text-base ${
              userType === 'donor' 
                ? 'bg-green-500 text-white shadow-lg' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            🍽️ Donor
          </button>
          <button
            onClick={() => setUserType('volunteer')}
            className={`flex-1 py-2 md:py-3 rounded-lg font-semibold transition-all text-sm md:text-base ${
              userType === 'volunteer' 
                ? 'bg-blue-500 text-white shadow-lg' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            🤝 Volunteer
          </button>
          <button
            onClick={() => setUserType('farmer')}
            className={`flex-1 py-2 md:py-3 rounded-lg font-semibold transition-all text-sm md:text-base ${
              userType === 'farmer' 
                ? 'bg-orange-500 text-white shadow-lg' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            🌾 Farmer
          </button>
        </div>

        <div className="space-y-3 md:space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm md:text-base"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm md:text-base"
          />
          <button
            onClick={() => handleLogin(email || 'demo@mealmitra.com', 'demo')}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 md:py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 text-sm md:text-base"
          >
            Login to MealMitra
          </button>
        </div>

        <div className="mt-4 md:mt-6 p-3 md:p-4 bg-green-50 rounded-lg">
          <p className="text-center text-green-800 text-xs md:text-sm">
            <strong>Demo:</strong> Choose role & click Login
          </p>
          <p className="text-center text-green-700 text-xs mt-1">
            {userType === 'farmer' ? '🌾 Upload surplus vegetables & crops' : 
             userType === 'donor' ? '🍽️ Share leftover cooked food' : 
             '🤝 Help distribute food to communities'}
          </p>
        </div>
      </div>
    </div>
  );

  // AI Analysis Component - Enhanced for farm produce
  const AIAnalysisDisplay = ({ analysis, onUseEstimate, foodType = 'cooked' }) => {
    if (!analysis) return null;

    return (
      <div className={`border rounded-lg p-4 mb-4 ${
        foodType === 'farm' ? 'bg-orange-50 border-orange-200' : 'bg-blue-50 border-blue-200'
      }`}>
        <div className="flex items-center mb-2">
          <span className="text-xl mr-2">{foodType === 'farm' ? '🌾' : '🤖'}</span>
          <h3 className={`font-semibold ${foodType === 'farm' ? 'text-orange-800' : 'text-blue-800'}`}>
            {foodType === 'farm' ? 'AI Farm Produce Analysis' : 'AI Food Analysis'}
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <span className="font-medium text-gray-700">
              {foodType === 'farm' ? 'Estimated Weight:' : 'Estimated Meals:'}
            </span>
            <div className={`text-lg font-bold ${foodType === 'farm' ? 'text-orange-600' : 'text-green-600'}`}>
              {foodType === 'farm' ? `${analysis.estimatedKgs} kgs` : analysis.estimatedMeals}
            </div>
            {foodType === 'farm' && analysis.estimatedMeals && (
              <div className="text-green-600 text-sm">
                ~{analysis.estimatedMeals} meals possible
              </div>
            )}
          </div>
          <div>
            <span className="font-medium text-gray-700">Confidence:</span>
            <div className="flex items-center">
              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                <div 
                  className={`h-2 rounded-full ${
                    foodType === 'farm' ? 'bg-orange-500' : 'bg-green-500'
                  }`} 
                  style={{ width: `${analysis.confidence}%` }}
                ></div>
              </div>
              <span className={`font-medium ${
                foodType === 'farm' ? 'text-orange-600' : 'text-green-600'
              }`}>
                {analysis.confidence}%
              </span>
            </div>
          </div>
        </div>

        {analysis.detectedItems && (
          <div className="mt-2">
            <span className="font-medium text-gray-700">Detected Items:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {analysis.detectedItems.map((item, index) => (
                <span key={index} className="bg-white px-2 py-1 rounded text-xs border">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-3">
          <button
            onClick={() => onUseEstimate(foodType === 'farm' ? analysis.estimatedKgs : analysis.estimatedMeals)}
            className={`px-4 py-2 rounded-lg text-sm font-medium text-white hover:scale-105 transition-all ${
              foodType === 'farm' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            Use AI Estimate
          </button>
          <p className="text-xs text-gray-600 mt-1">
            {foodType === 'farm' 
              ? 'Helps NGOs understand the quantity better' 
              : 'This helps volunteers understand the quantity better'}
          </p>
        </div>
      </div>
    );
  };

  // Post Food Page (for cooked food)
  const PostFoodPage = () => {
    const [formData, setFormData] = useState({
      items: '',
      quantity: '',
      location: '',
      time: '',
      type: 'veg',
    });

    const [tempImages, setTempImages] = useState([]);
    const [aiAnalysis, setAiAnalysis] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleSubmit = (e) => {
      e.preventDefault();
      if (formData.items && formData.quantity && formData.location && formData.time) {
        handleSubmitFood({
          ...formData,
          images: tempImages,
          aiEstimate: aiAnalysis?.estimatedMeals,
          aiAnalysis: aiAnalysis,
          type: 'cooked'
        });
      } else {
        alert('Please fill all required fields');
      }
    };

    const handleTempImageUpload = async (event) => {
      const files = Array.from(event.target.files);
      if (files.length === 0) return;

      const newImages = [...tempImages];
      
      for (const file of files) {
        if (file.type.startsWith('image/') && newImages.length < 5) {
          const reader = new FileReader();
          const imageData = await new Promise((resolve) => {
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
          });
          newImages.push(imageData);
          
          if (newImages.length === 1) {
            setIsAnalyzing(true);
            try {
              const analysis = await analyzeFoodImage(file, 'cooked');
              setAiAnalysis(analysis);
            } catch (error) {
              console.error('AI analysis failed:', error);
            }
            setIsAnalyzing(false);
          }
        }
      }
      
      setTempImages(newImages);
      event.target.value = '';
    };

    const handleRemoveTempImage = (index) => {
      const newImages = tempImages.filter((_, i) => i !== index);
      setTempImages(newImages);
      if (index === 0 && newImages.length === 0) {
        setAiAnalysis(null);
      }
    };

    const handleUseAiEstimate = (estimate) => {
      setFormData(prev => ({ ...prev, quantity: estimate.toString() }));
    };

    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <button 
                onClick={handleBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
              >
                <span>←</span>
                <span>Back</span>
              </button>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">➕ Post Cooked Food</h1>
              <div className="w-10"></div>
            </div>

            {user && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-800 font-semibold">Welcome, {user.name}!</p>
                    <p className="text-green-600 text-sm">User ID: {user.userId}</p>
                  </div>
                  <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs">
                    🍽️ Food Donor
                  </span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Food Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {['veg', 'non-veg', 'jain'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, type }))}
                      className={`p-2 md:p-3 border rounded-lg text-center capitalize text-xs md:text-sm transition-all ${
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Food Items *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Rice, Dal, Roti, Vegetables..."
                  value={formData.items}
                  onChange={(e) => setFormData(prev => ({ ...prev, items: e.target.value }))}
                  className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm md:text-base"
                  required
                />
              </div>

              {isAnalyzing && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    <span className="text-blue-700">🤖 AI is analyzing your food image...</span>
                  </div>
                </div>
              )}

              {aiAnalysis && !isAnalyzing && (
                <AIAnalysisDisplay 
                  analysis={aiAnalysis} 
                  onUseEstimate={handleUseAiEstimate}
                  foodType="cooked"
                />
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Meals *
                </label>
                <input
                  type="number"
                  placeholder="e.g., 10, 15, 20..."
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                  className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm md:text-base"
                  required
                />
                {aiAnalysis && (
                  <p className="text-xs text-gray-500 mt-1">
                    💡 AI suggestion: {aiAnalysis.estimatedMeals} meals
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Location *
                </label>
                <input
                  type="text"
                  placeholder="Enter pickup address"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm md:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Pickup Time *
                </label>
                <input
                  type="text"
                  placeholder="e.g., 2:00 PM - 4:00 PM"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm md:text-base"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📸 Food Photos ({tempImages.length}/5)
                </label>
                
                {tempImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-3">
                    {tempImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={image} 
                          alt={`Food preview ${index + 1}`}
                          className="w-full h-20 md:h-24 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveTempImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {tempImages.length < 5 && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleTempImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label 
                      htmlFor="image-upload"
                      className="cursor-pointer block"
                    >
                      <div className="text-2xl mb-2">📷</div>
                      <div className="text-sm text-gray-600">
                        Click to add food photos
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {5 - tempImages.length} photos remaining • AI will analyze first image
                      </div>
                    </label>
                  </div>
                )}

                {tempImages.length >= 5 && (
                  <div className="text-center text-sm text-green-600 bg-green-50 p-2 rounded-lg">
                    ✅ Maximum 5 photos added
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-green-500 text-white py-3 md:py-4 rounded-lg font-semibold shadow-lg hover:bg-green-600 transition-all hover:scale-105 text-sm md:text-base"
              >
                🚀 Post Cooked Food
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // Post Farm Produce Page (NEW)
  const PostFarmProducePage = () => {
    const [formData, setFormData] = useState({
      items: '',
      quantity: '',
      location: '',
      time: '',
      category: 'vegetables',
      description: ''
    });

    const [tempImages, setTempImages] = useState([]);
    const [aiAnalysis, setAiAnalysis] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleSubmit = (e) => {
      e.preventDefault();
      if (formData.items && formData.quantity && formData.location && formData.time) {
        handleSubmitFood({
          ...formData,
          images: tempImages,
          aiEstimate: aiAnalysis?.estimatedKgs,
          estimatedMeals: aiAnalysis?.estimatedMeals,
          aiAnalysis: aiAnalysis,
          type: 'farm',
          donor: user?.name || 'Anonymous Farmer'
        });
      } else {
        alert('Please fill all required fields');
      }
    };

    const handleTempImageUpload = async (event) => {
      const files = Array.from(event.target.files);
      if (files.length === 0) return;

      const newImages = [...tempImages];
      
      for (const file of files) {
        if (file.type.startsWith('image/') && newImages.length < 5) {
          const reader = new FileReader();
          const imageData = await new Promise((resolve) => {
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
          });
          newImages.push(imageData);
          
          if (newImages.length === 1) {
            setIsAnalyzing(true);
            try {
              const analysis = await analyzeFoodImage(file, 'farm');
              setAiAnalysis(analysis);
            } catch (error) {
              console.error('AI analysis failed:', error);
            }
            setIsAnalyzing(false);
          }
        }
      }
      
      setTempImages(newImages);
      event.target.value = '';
    };

    const handleRemoveTempImage = (index) => {
      const newImages = tempImages.filter((_, i) => i !== index);
      setTempImages(newImages);
      if (index === 0 && newImages.length === 0) {
        setAiAnalysis(null);
      }
    };

    const handleUseAiEstimate = (estimate) => {
      setFormData(prev => ({ ...prev, quantity: estimate.toString() }));
    };

    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <button 
                onClick={handleBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
              >
                <span>←</span>
                <span>Back</span>
              </button>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">🌾 Post Farm Produce</h1>
              <div className="w-10"></div>
            </div>

            {user && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-800 font-semibold">Welcome, {user.name}!</p>
                    <p className="text-orange-600 text-sm">User ID: {user.userId}</p>
                  </div>
                  <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded text-xs">
                    🌾 Farmer
                  </span>
                </div>
                <p className="text-orange-700 text-xs mt-2">
                  💡 Prevent farm waste! Upload surplus vegetables & crops that would otherwise be thrown away.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Produce Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'vegetables', label: '🥬 Vegetables', icon: '🥬' },
                    { value: 'fruits', label: '🍎 Fruits', icon: '🍎' },
                    { value: 'grains', label: '🌾 Grains', icon: '🌾' },
                    { value: 'other', label: '🌱 Other', icon: '🌱' }
                  ].map(category => (
                    <button
                      key={category.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, category: category.value }))}
                      className={`p-3 border rounded-lg text-center transition-all ${
                        formData.category === category.value 
                          ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-sm' 
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-lg">{category.icon}</div>
                      <div className="text-xs mt-1">{category.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Produce Items *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Tomatoes, Potatoes, Onions, Fresh Vegetables..."
                  value={formData.items}
                  onChange={(e) => setFormData(prev => ({ ...prev, items: e.target.value }))}
                  className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm md:text-base"
                  required
                />
              </div>

              {isAnalyzing && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                    <span className="text-orange-700">🌾 AI is analyzing your farm produce...</span>
                  </div>
                </div>
              )}

              {aiAnalysis && !isAnalyzing && (
                <AIAnalysisDisplay 
                  analysis={aiAnalysis} 
                  onUseEstimate={handleUseAiEstimate}
                  foodType="farm"
                />
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity (Kgs) *
                </label>
                <input
                  type="number"
                  placeholder="e.g., 10, 25, 50 kgs..."
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                  className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm md:text-base"
                  required
                />
                {aiAnalysis && (
                  <p className="text-xs text-gray-500 mt-1">
                    💡 AI suggestion: {aiAnalysis.estimatedKgs} kgs (~{aiAnalysis.estimatedMeals} meals)
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Description
                </label>
                <textarea
                  placeholder="e.g., Freshly harvested, surplus due to low market prices, organic..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows="2"
                  className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm md:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Location *
                </label>
                <input
                  type="text"
                  placeholder="Enter farm/facility address"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm md:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Pickup Time *
                </label>
                <input
                  type="text"
                  placeholder="e.g., 8:00 AM - 5:00 PM"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm md:text-base"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📸 Produce Photos ({tempImages.length}/5)
                </label>
                
                {tempImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-3">
                    {tempImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={image} 
                          alt={`Produce preview ${index + 1}`}
                          className="w-full h-20 md:h-24 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveTempImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {tempImages.length < 5 && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleTempImageUpload}
                      className="hidden"
                      id="farm-image-upload"
                    />
                    <label 
                      htmlFor="farm-image-upload"
                      className="cursor-pointer block"
                    >
                      <div className="text-2xl mb-2">📷</div>
                      <div className="text-sm text-gray-600">
                        Click to add produce photos
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {5 - tempImages.length} photos remaining • AI will analyze first image
                      </div>
                    </label>
                  </div>
                )}

                {tempImages.length >= 5 && (
                  <div className="text-center text-sm text-orange-600 bg-orange-50 p-2 rounded-lg">
                    ✅ Maximum 5 photos added
                  </div>
                )}
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <span className="text-green-600 text-lg">💚</span>
                  <div>
                    <h4 className="font-semibold text-green-800">Preventing Farm Waste</h4>
                    <p className="text-green-700 text-sm mt-1">
                      Your surplus produce will reach NGOs, community kitchens, and local beneficiaries 
                      who can use it immediately. Together we're fighting both food waste and farm surplus!
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-3 md:py-4 rounded-lg font-semibold shadow-lg hover:bg-orange-600 transition-all hover:scale-105 text-sm md:text-base"
              >
                🌾 Post Farm Produce
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // Impact Page - Updated with farm stats
  const ImpactPage = () => (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <button 
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <span>←</span>
              <span>Back</span>
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">📊 Your Impact</h1>
            <div className="w-10"></div>
          </div>

          {user && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-800 font-semibold">{user.name}</p>
                  <p className="text-blue-600 text-sm">ID: {user.userId} • {user.email}</p>
                </div>
                <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs">
                  {userType === 'donor' ? '🍽️ Donor' : userType === 'farmer' ? '🌾 Farmer' : '🤝 Volunteer'}
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="bg-green-50 p-3 md:p-4 rounded-lg text-center">
              <div className="text-lg md:text-2xl font-bold text-green-600">{stats.mealsSaved}</div>
              <div className="text-green-700 text-xs md:text-sm">Meals Saved</div>
            </div>
            <div className="bg-blue-50 p-3 md:p-4 rounded-lg text-center">
              <div className="text-lg md:text-2xl font-bold text-blue-600">{stats.activePosts}</div>
              <div className="text-blue-700 text-xs md:text-sm">Active Posts</div>
            </div>
            <div className="bg-orange-50 p-3 md:p-4 rounded-lg text-center">
              <div className="text-lg md:text-2xl font-bold text-orange-600">{stats.farmProduceSaved}</div>
              <div className="text-orange-700 text-xs md:text-sm">Kgs Farm Produce</div>
            </div>
            <div className="bg-purple-50 p-3 md:p-4 rounded-lg text-center">
              <div className="text-lg md:text-2xl font-bold text-purple-600">{stats.successRate}%</div>
              <div className="text-purple-700 text-xs md:text-sm">Success Rate</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-4 md:p-6 text-white text-center mb-6">
            <h2 className="text-lg md:text-xl font-bold mb-2">🌍 Community Impact</h2>
            <p className="text-sm md:text-base">
              You've helped provide <strong>{stats.mealsSaved} meals</strong> to people in need.
            </p>
            {stats.farmProduceSaved > 0 && (
              <p className="text-sm md:text-base mt-2">
                And saved <strong>{stats.farmProduceSaved} kgs</strong> of farm produce from waste!
              </p>
            )}
          </div>

          <div className="bg-gradient-to-r from-orange-400 to-green-500 rounded-xl p-4 md:p-6 text-white">
            <h2 className="text-lg md:text-xl font-bold mb-2">🌾 Fighting Farm Waste</h2>
            <p className="text-sm md:text-base">
              Our platform connects farmers with surplus vegetables/crops to NGOs and community kitchens, 
              preventing wastage and ensuring fresh produce reaches those in need immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Community Page
  const CommunityPage = () => (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <button 
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <span>←</span>
              <span>Back</span>
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">🏘️ Community</h1>
            <div className="w-10"></div>
          </div>

          {user && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-800 font-semibold">{user.name}</p>
                  <p className="text-purple-600 text-sm">User ID: {user.userId}</p>
                </div>
                <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded text-xs">
                  {userType === 'donor' ? 'Donor' : userType === 'farmer' ? 'Farmer' : 'Volunteer'}
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              { name: 'Community Center - Colaba', meals: 150, icon: '🏘️', type: 'Both' },
              { name: 'Anganwadi - Andheri', meals: 89, icon: '👶', type: 'Both' },
              { name: 'Temple Kitchen - Dadar', meals: 203, icon: '🛕', type: 'Both' },
              { name: 'Farmers Collective - Nashik', meals: 0, produce: 450, icon: '🌾', type: 'Farm' },
              { name: 'Organic Farm Co-op', meals: 0, produce: 320, icon: '🥬', type: 'Farm' },
              { name: 'NGO Center - Kurla', meals: 178, icon: '🤝', type: 'Both' }
            ].map((point, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                <div className="text-2xl mb-2">{point.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-1 text-sm md:text-base">{point.name}</h3>
                <p className="text-green-600 font-bold text-xs md:text-sm">
                  {point.meals > 0 ? `${point.meals} meals served` : ''}
                  {point.produce > 0 ? `${point.produce} kgs produce` : ''}
                </p>
                <div className="mt-1">
                  <span className={`text-xs px-2 py-1 rounded ${
                    point.type === 'Farm' 
                      ? 'bg-orange-100 text-orange-800' 
                      : point.type === 'Both'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {point.type}
                  </span>
                </div>
                <button className="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-xs md:text-sm hover:bg-blue-600 transition-colors">
                  Connect
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Share Experience Page
  const ShareExperiencePage = () => (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <button 
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <span>←</span>
              <span>Back</span>
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">🌟 Share Your Experience</h1>
            <div className="w-10"></div>
          </div>

          {user && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-800 font-semibold">Share your experience, {user.name}!</p>
                  <p className="text-yellow-600 text-sm">ID: {user.userId}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4 md:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
              <div className="flex space-x-2 justify-center">
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} className="text-2xl hover:scale-110 transition-transform">
                    ⭐
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Experience</label>
              <textarea
                placeholder="Share your MealMitra experience..."
                rows="4"
                className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm md:text-base"
              />
            </div>

            <button className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 md:py-4 rounded-lg font-semibold shadow-lg hover:scale-105 transition-all text-sm md:text-base">
              📤 Share with Community
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // History Page
  const HistoryPage = () => (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <button 
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <span>←</span>
              <span>Back</span>
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">📋 Your History</h1>
            <div className="w-10"></div>
          </div>

          {user && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-800 font-semibold">{user.name}'s Activity History</p>
                  <p className="text-gray-600 text-sm">User ID: {user.userId} • {user.email}</p>
                </div>
                <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs">
                  Total Activities: {foodPosts.length + acceptedFood.length}
                </span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {[...foodPosts, ...acceptedFood]
              .sort((a, b) => b.timestamp - a.timestamp)
              .map((item, index) => (
                <div key={index} className={`border rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow ${
                  item.type === 'farm' ? 'border-orange-200 bg-orange-50' : 'border-gray-200'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-800 text-sm md:text-base">{item.items}</h3>
                        {item.type === 'farm' && (
                          <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                            🌾 Farm
                          </span>
                        )}
                      </div>
                      <p className={`font-semibold text-xs md:text-sm ${
                        item.type === 'farm' ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        {item.quantity} {item.type === 'farm' ? 'kgs' : 'meals'}
                      </p>
                      {item.aiEstimate && (
                        <p className="text-blue-600 text-xs">
                          🤖 AI estimated: {item.aiEstimate} {item.type === 'farm' ? 'kgs' : 'meals'}
                          {item.type === 'farm' && item.estimatedMeals && (
                            <span> (~{item.estimatedMeals} meals)</span>
                          )}
                        </p>
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.status === 'available' ? 'bg-green-100 text-green-800' :
                      item.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                      item.status === 'picked' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  
                  {item.images && item.images.length > 0 && (
                    <div className="mb-3">
                      <div className="grid grid-cols-3 gap-2">
                        {item.images.map((image, imgIndex) => (
                          <img 
                            key={imgIndex}
                            src={image} 
                            alt={`${item.type === 'farm' ? 'Produce' : 'Food'} ${imgIndex + 1}`}
                            className="w-full h-16 object-cover rounded-lg border border-gray-300"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="text-xs md:text-sm text-gray-600">
                    <p>📍 {item.location}</p>
                    <p>⏰ {item.time}</p>
                    {item.description && (
                      <p className="text-gray-500">📝 {item.description}</p>
                    )}
                    <p className="text-gray-500 text-xs">
                      {new Date(item.timestamp).toLocaleDateString()} at {new Date(item.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Donor Dashboard - Updated with farm produce option
  const DonorDashboard = () => (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-4 md:mb-6">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                {userType === 'farmer' ? '🌾 MealMitra Farmer' : '🍛 MealMitra Donor'}
              </h1>
              {user && (
                <p className="text-gray-600 text-sm">Welcome, {user.name}!
                  <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                    ID: {user.userId}
                  </span>
                </p>
              )}
            </div>
            <button 
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm md:text-base"
            >
              Logout
            </button>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 md:p-6 mb-4 md:mb-6 border border-blue-200">
            <h2 className="text-lg md:text-xl font-semibold text-blue-800 mb-3 md:mb-4">📍 Live Location Tracking</h2>
            {!currentLocation ? (
              <button
                onClick={startLocationTracking}
                disabled={tracking}
                className="bg-green-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold hover:bg-green-600 disabled:bg-gray-400 transition-colors w-full text-sm md:text-base"
              >
                {tracking ? '🔄 Detecting Location...' : '📍 Detect My Location'}
              </button>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-green-600 font-semibold text-sm md:text-base">✅ Location Found!</span>
                  <button 
                    onClick={startLocationTracking}
                    className="bg-blue-500 text-white px-3 md:px-4 py-1 md:py-2 rounded-lg text-xs md:text-sm hover:bg-blue-600 transition-colors"
                  >
                    🔄 Update
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm">
                  <div className="bg-white p-2 md:p-3 rounded-lg border">
                    <div className="text-gray-600">Latitude</div>
                    <div className="font-mono font-semibold">{currentLocation.lat.toFixed(6)}</div>
                  </div>
                  <div className="bg-white p-2 md:p-3 rounded-lg border">
                    <div className="text-gray-600">Longitude</div>
                    <div className="font-mono font-semibold">{currentLocation.lng.toFixed(6)}</div>
                  </div>
                </div>
                <div className="bg-yellow-50 p-2 md:p-3 rounded-lg border border-yellow-200">
                  <div className="text-yellow-700 text-xs md:text-sm">
                    Accuracy: ±{Math.round(currentLocation.accuracy)} meters
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions - Updated for farmers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
            {userType === 'farmer' ? (
              <>
                <button 
                  onClick={handlePostFarmProduce}
                  className="bg-orange-500 text-white p-4 md:p-6 rounded-xl text-left hover:bg-orange-600 transition-colors hover:scale-105"
                >
                  <div className="text-xl md:text-2xl mb-2">🌾</div>
                  <div className="font-semibold text-sm md:text-base">Post Farm Produce</div>
                  <div className="text-orange-100 text-xs md:text-sm">Upload surplus vegetables/crops</div>
                </button>
                <button 
                  onClick={handleTrackImpact}
                  className="bg-blue-500 text-white p-4 md:p-6 rounded-xl text-left hover:bg-blue-600 transition-colors hover:scale-105"
                >
                  <div className="text-xl md:text-2xl mb-2">📊</div>
                  <div className="font-semibold text-sm md:text-base">Track Impact</div>
                  <div className="text-blue-100 text-xs md:text-sm">View farm waste prevented</div>
                </button>
                <button 
                  onClick={handleCommunityConnect}
                  className="bg-purple-500 text-white p-4 md:p-6 rounded-xl text-left hover:bg-purple-600 transition-colors hover:scale-105"
                >
                  <div className="text-xl md:text-2xl mb-2">🏘️</div>
                  <div className="font-semibold text-sm md:text-base">Community</div>
                  <div className="text-purple-100 text-xs md:text-sm">Connect with NGOs</div>
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={handlePostFood}
                  className="bg-green-500 text-white p-4 md:p-6 rounded-xl text-left hover:bg-green-600 transition-colors hover:scale-105"
                >
                  <div className="text-xl md:text-2xl mb-2">➕</div>
                  <div className="font-semibold text-sm md:text-base">Post Food</div>
                  <div className="text-green-100 text-xs md:text-sm">Share leftover food</div>
                </button>
                <button 
                  onClick={handleTrackImpact}
                  className="bg-blue-500 text-white p-4 md:p-6 rounded-xl text-left hover:bg-blue-600 transition-colors hover:scale-105"
                >
                  <div className="text-xl md:text-2xl mb-2">📊</div>
                  <div className="font-semibold text-sm md:text-base">Track Impact</div>
                  <div className="text-blue-100 text-xs md:text-sm">View your contribution</div>
                </button>
                <button 
                  onClick={handleCommunityConnect}
                  className="bg-purple-500 text-white p-4 md:p-6 rounded-xl text-left hover:bg-purple-600 transition-colors hover:scale-105"
                >
                  <div className="text-xl md:text-2xl mb-2">🏘️</div>
                  <div className="font-semibold text-sm md:text-base">Community</div>
                  <div className="text-purple-100 text-xs md:text-sm">Connect with NGOs</div>
                </button>
              </>
            )}
            <button 
              onClick={handleViewHistory}
              className="bg-orange-500 text-white p-4 md:p-6 rounded-xl text-left hover:bg-orange-600 transition-colors hover:scale-105"
            >
              <div className="text-xl md:text-2xl mb-2">📋</div>
              <div className="font-semibold text-sm md:text-base">History</div>
              <div className="text-orange-100 text-xs md:text-sm">View past activities</div>
            </button>
            <button 
              onClick={handleShareExperience}
              className="bg-pink-500 text-white p-4 md:p-6 rounded-xl text-left hover:bg-pink-600 transition-colors hover:scale-105"
            >
              <div className="text-xl md:text-2xl mb-2">🌟</div>
              <div className="font-semibold text-sm md:text-base">Share</div>
              <div className="text-pink-100 text-xs md:text-sm">Share your experience</div>
            </button>
          </div>

          {/* Stats - Updated for farm produce */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-green-50 p-3 md:p-4 rounded-lg text-center">
              <div className="text-lg md:text-2xl font-bold text-green-600">{stats.mealsSaved}</div>
              <div className="text-green-700 text-xs md:text-sm">Meals Saved</div>
            </div>
            <div className="bg-blue-50 p-3 md:p-4 rounded-lg text-center">
              <div className="text-lg md:text-2xl font-bold text-blue-600">{stats.activePosts}</div>
              <div className="text-blue-700 text-xs md:text-sm">Active Posts</div>
            </div>
            <div className="bg-orange-50 p-3 md:p-4 rounded-lg text-center">
              <div className="text-lg md:text-2xl font-bold text-orange-600">{stats.farmProduceSaved}</div>
              <div className="text-orange-700 text-xs md:text-sm">Kgs Farm Produce</div>
            </div>
            <div className="bg-purple-50 p-3 md:p-4 rounded-lg text-center">
              <div className="text-lg md:text-2xl font-bold text-purple-600">{stats.successRate}%</div>
              <div className="text-purple-700 text-xs md:text-sm">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Volunteer Dashboard
  const VolunteerDashboard = () => (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl shadow-lg p-4 md:p-6 mb-4 md:mb-6 text-white">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold">🤝 MealMitra Volunteer</h1>
              {user && (
                <p className="text-purple-100 text-sm md:text-base">
                  Welcome, {user.name}! 
                  <span className="ml-2 bg-white bg-opacity-20 px-2 py-1 rounded text-xs">
                    ID: {user.userId}
                  </span>
                </p>
              )}
              <p className="text-purple-100 text-sm md:text-base">Level: Community Hero</p>
            </div>
            <button 
              onClick={handleLogout}
              className="bg-white text-purple-600 px-3 md:px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm md:text-base"
            >
              Logout
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-center">
            <div>
              <div className="text-lg md:text-2xl font-bold">{stats.deliveries}</div>
              <div className="text-xs md:text-sm">Deliveries</div>
            </div>
            <div>
              <div className="text-lg md:text-2xl font-bold">{stats.mealsDelivered}</div>
              <div className="text-xs md:text-sm">Meals</div>
            </div>
            <div>
              <div className="text-lg md:text-2xl font-bold">{stats.rating}</div>
              <div className="text-xs md:text-sm">Rating</div>
            </div>
            <div>
              <div className="text-lg md:text-2xl font-bold">#{stats.rank}</div>
              <div className="text-xs md:text-sm">Rank</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            <button 
              onClick={handleTrackImpact}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 transition-all p-2 rounded text-xs md:text-sm"
            >
              📊 Impact
            </button>
            <button 
              onClick={handleCommunityConnect}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 transition-all p-2 rounded text-xs md:text-sm"
            >
              👥 Community
            </button>
            <button 
              onClick={handleShareExperience}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 transition-all p-2 rounded text-xs md:text-sm"
            >
              🌟 Share
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 md:mb-4">📍 Volunteer Location Tracking</h2>
          {!currentLocation ? (
            <button
              onClick={startLocationTracking}
              disabled={tracking}
              className="bg-green-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold hover:bg-green-600 disabled:bg-gray-400 transition-colors w-full text-sm md:text-base"
            >
              {tracking ? '🔄 Detecting Your Location...' : '📍 Start Location Tracking'}
            </button>
          ) : (
            <div className="space-y-3 md:space-y-4">
              <div className="bg-green-50 p-3 md:p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-green-600 text-lg md:text-xl mr-2">📍</span>
                    <div>
                      <div className="font-semibold text-green-800 text-sm md:text-base">Location Active</div>
                      <div className="text-green-600 text-xs md:text-sm">Ready for food pickups</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
                    <span className="text-green-600 text-sm md:text-base">Live</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 md:gap-4 mt-3 text-xs md:text-sm">
                  <div className="bg-white p-2 md:p-3 rounded-lg border">
                    <div className="text-gray-600">Latitude</div>
                    <div className="font-mono font-semibold">{currentLocation.lat.toFixed(6)}</div>
                  </div>
                  <div className="bg-white p-2 md:p-3 rounded-lg border">
                    <div className="text-gray-600">Longitude</div>
                    <div className="font-mono font-semibold">{currentLocation.lng.toFixed(6)}</div>
                  </div>
                </div>
                <div className="bg-yellow-50 p-2 md:p-3 rounded-lg border border-yellow-200 mt-2">
                  <div className="text-yellow-700 text-xs md:text-sm">
                    Accuracy: ±{Math.round(currentLocation.accuracy)} meters
                  </div>
                </div>
              </div>
              <button 
                onClick={startLocationTracking}
                className="bg-blue-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors w-full text-sm md:text-base"
              >
                🔄 Update Location
              </button>
            </div>
          )}
        </div>

        {/* Available Food Listings - Updated for farm produce */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">📦 Available Pickups</h2>
          
          {foodPosts.filter(food => food.status === 'available').length === 0 ? (
            <div className="text-center py-8 md:py-12">
              <div className="text-4xl md:text-6xl mb-4">🍛</div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-600 mb-2">No available posts</h3>
              <p className="text-gray-500 text-sm md:text-base">Check back later for new donations</p>
            </div>
          ) : (
            <div className="space-y-4">
              {foodPosts
                .filter(food => food.status === 'available')
                .map(food => (
                  <div key={food.id} className={`border rounded-lg p-4 md:p-6 hover:shadow-md transition-shadow ${
                    food.type === 'farm' ? 'border-orange-200 bg-orange-50' : 'border-gray-200'
                  }`}>
                    {/* Food/Produce Images */}
                    {food.images && food.images.length > 0 && (
                      <div className="mb-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {food.images.map((image, index) => (
                            <img 
                              key={index}
                              src={image} 
                              alt={`${food.type === 'farm' ? 'Produce' : 'Food'} ${index + 1}`}
                              className="w-full h-20 md:h-24 object-cover rounded-lg border border-gray-300"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-start mb-3 md:mb-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-gray-800 text-lg md:text-xl">{food.items}</h3>
                          {food.type === 'farm' && (
                            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                              🌾 Farm Produce
                            </span>
                          )}
                        </div>
                        <p className={`font-semibold text-base md:text-lg ${
                          food.type === 'farm' ? 'text-orange-600' : 'text-green-600'
                        }`}>
                          {food.quantity} {food.type === 'farm' ? 'kgs' : 'meals'} available
                        </p>
                        {food.aiEstimate && (
                          <p className="text-blue-600 text-sm">
                            🤖 AI estimate: {food.aiEstimate} {food.type === 'farm' ? 'kgs' : 'meals'}
                            {food.type === 'farm' && food.estimatedMeals && (
                              <span> (~{food.estimatedMeals} meals)</span>
                            )}
                          </p>
                        )}
                      </div>
                      <span className="bg-green-100 text-green-800 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm">
                        {food.distance} away
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 mb-3 md:mb-4 text-sm md:text-base">
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-2">📍</span>
                        <span>{food.location}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-2">⏰</span>
                        <span>{food.time}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-2">🏢</span>
                        <span>{food.donor}</span>
                      </div>
                      {food.type === 'cooked' && (
                        <div className="flex items-center">
                          <span className="text-gray-500 mr-2">🥗</span>
                          <span className="capitalize">{food.type}</span>
                        </div>
                      )}
                    </div>
                    
                    {food.type === 'farm' && food.description && (
                      <div className="mb-3 p-2 bg-white rounded border">
                        <p className="text-gray-600 text-sm">📝 {food.description}</p>
                      </div>
                    )}
                    
                    <button
                      onClick={() => handleAcceptFood(food.id)}
                      className="w-full bg-green-500 text-white py-2 md:py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors text-sm md:text-base"
                    >
                      ✅ Accept {food.type === 'farm' ? 'Produce' : 'Pickup'}
                    </button>
                  </div>
                ))}
            </div>
          )}

          {/* Accepted Food Section */}
          {acceptedFood.length > 0 && (
            <div className="mt-8 md:mt-12">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">📦 Your Accepted Pickups</h2>
              <div className="space-y-4">
                {acceptedFood.map(food => (
                  <div key={food.id} className="border border-blue-200 rounded-lg p-4 md:p-6 bg-blue-50">
                    {/* Food/Produce Images */}
                    {food.images && food.images.length > 0 && (
                      <div className="mb-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {food.images.map((image, index) => (
                            <img 
                              key={index}
                              src={image} 
                              alt={`${food.type === 'farm' ? 'Produce' : 'Food'} ${index + 1}`}
                              className="w-full h-20 md:h-24 object-cover rounded-lg border border-gray-300"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-start mb-3 md:mb-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-gray-800 text-lg md:text-xl">{food.items}</h3>
                          {food.type === 'farm' && (
                            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                              🌾 Farm
                            </span>
                          )}
                        </div>
                        <p className="text-blue-600 font-semibold text-base md:text-lg">
                          {food.quantity} {food.type === 'farm' ? 'kgs' : 'meals'}
                        </p>
                        {food.aiEstimate && (
                          <p className="text-blue-600 text-sm">
                            🤖 AI estimate: {food.aiEstimate} {food.type === 'farm' ? 'kgs' : 'meals'}
                            {food.type === 'farm' && food.estimatedMeals && (
                              <span> (~{food.estimatedMeals} meals)</span>
                            )}
                          </p>
                        )}
                      </div>
                      <span className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm ${
                        food.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                        food.status === 'picked' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {food.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 mb-4 text-sm md:text-base">
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-2">📍</span>
                        <span>{food.location}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-2">⏰</span>
                        <span>{food.time}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 md:gap-3">
                      {food.status === 'accepted' && (
                        <button
                          onClick={() => handleMarkPicked(food.id)}
                          className="flex-1 bg-yellow-500 text-white py-2 md:py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors text-sm md:text-base"
                        >
                          🚗 Mark as Picked
                        </button>
                      )}
                      {food.status === 'picked' && (
                        <button
                          onClick={() => handleMarkDelivered(food.id)}
                          className="flex-1 bg-purple-500 text-white py-2 md:py-3 rounded-lg font-semibold hover:bg-purple-600 transition-colors text-sm md:text-base"
                        >
                          🎉 Mark as Delivered
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Main App Render - Updated with farm produce page
  return (
    <div className="App">
      {currentPage === 'login' && <LoginPage />}
      {currentPage === 'dashboard' && user && (
        userType === 'volunteer' ? <VolunteerDashboard /> : <DonorDashboard />
      )}
      {currentPage === 'post-food' && <PostFoodPage />}
      {currentPage === 'post-farm-produce' && <PostFarmProducePage />}
      {currentPage === 'impact' && <ImpactPage />}
      {currentPage === 'community' && <CommunityPage />}
      {currentPage === 'share' && <ShareExperiencePage />}
      {currentPage === 'history' && <HistoryPage />}
    </div>
  );
}

export default App;