// Simple localStorage wrapper for data persistence
export const storage = {
  // Save data to localStorage
  set: (key, data) => {
    try {
      localStorage.setItem(`mealmitra_${key}`, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  // Get data from localStorage
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(`mealmitra_${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },

  // Remove data from localStorage
  remove: (key) => {
    try {
      localStorage.removeItem(`mealmitra_${key}`);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }
};

// Default data structure with real location names
export const defaultData = {
  foodPosts: [
    {
      id: 1,
      type: 'veg',
      items: 'Biryani, Raita, Salad',
      quantity: 25,
      location: 'Taj Mahal Palace Hotel, Mumbai',
      address: 'Apollo Bandar, Colaba, Mumbai, Maharashtra 400001',
      coordinates: { lat: 18.9217, lng: 72.8330 },
      time: '2:00 PM - 3:00 PM',
      status: 'delivered',
      volunteer: 'Rahul Sharma',
      donor: 'Taj Hotel Kitchen',
      communityPoint: 'Community Center - Colaba',
      feedback: { rating: 5, comment: 'Great initiative! Food was fresh and delicious.' },
      timestamp: new Date('2024-01-15').getTime()
    },
    {
      id: 2,
      type: 'veg',
      items: 'Sandwiches, Fruits, Juice',
      quantity: 15,
      location: 'Tech Park Cafeteria, Andheri East',
      address: 'Mindspace, Andheri East, Mumbai, Maharashtra 400093',
      coordinates: { lat: 19.1197, lng: 72.9054 },
      time: '6:00 PM - 7:00 PM',
      status: 'pending',
      donor: 'Tech Park Kitchen',
      timestamp: new Date().getTime()
    }
  ],
  communityPoints: [
    { 
      id: 1, 
      name: 'Community Center - Colaba', 
      address: 'Colaba Community Hall, Mumbai',
      lat: 18.9067, 
      lng: 72.8107, 
      meals: 150 
    },
    { 
      id: 2, 
      name: 'Anganwadi - Andheri', 
      address: 'Andheri West Anganwadi Center',
      lat: 19.1197, 
      lng: 72.8464, 
      meals: 89 
    },
    { 
      id: 3, 
      name: 'Temple Kitchen - Dadar', 
      address: 'Shivaji Park Temple, Dadar',
      lat: 19.0176, 
      lng: 72.8420, 
      meals: 203 
    },
    { 
      id: 4, 
      name: 'School Cafeteria - Powai', 
      address: 'IIT Bombay Campus, Powai',
      lat: 19.1334, 
      lng: 72.9133, 
      meals: 67 
    }
  ],
  volunteers: [
    { 
      id: 1, 
      name: 'Rahul Sharma', 
      location: 'Colaba, Mumbai',
      lat: 18.9067, 
      lng: 72.8107, 
      status: 'available' 
    },
    { 
      id: 2, 
      name: 'Priya Patel', 
      location: 'Andheri West, Mumbai',
      lat: 19.1197, 
      lng: 72.8464, 
      status: 'busy' 
    },
    { 
      id: 3, 
      name: 'Amit Kumar', 
      location: 'Dadar, Mumbai',
      lat: 19.0176, 
      lng: 72.8420, 
      status: 'available' 
    }
  ],
  feedbacks: []
};

// Popular Mumbai locations for auto-suggest
export const popularLocations = [
  "Taj Mahal Palace Hotel, Mumbai",
  "Chatrapati Shivaji Terminus, Mumbai",
  "Gateway of India, Mumbai",
  "Marine Drive, Mumbai",
  "Juhu Beach, Mumbai",
  "Bandra Worli Sea Link, Mumbai",
  "Crawford Market, Mumbai",
  "Phoenix Marketcity, Kurla",
  "Infiniti Mall, Andheri",
  "R City Mall, Ghatkopar",
  "High Street Phoenix, Lower Parel",
  "Tech Park Cafeteria, Andheri East",
  "Corporate Office, Bandra Kurla Complex",
  "Restaurant - Kala Ghoda, Fort",
  "Hotel Sea Princess, Juhu",
  "IT Park, Malad West",
  "Shopping Mall, Thane",
  "Food Court, Vashi"
];