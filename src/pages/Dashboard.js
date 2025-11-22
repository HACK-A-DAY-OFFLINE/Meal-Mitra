import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import DonorDashboard from '../components/DonorDashboard';
import VolunteerDashboard from '../components/VolunteerDashboard';

const Dashboard = ({ user, userType, onLogout, onSwitchUser }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        user={user} 
        userType={userType} 
        onLogout={onLogout}
        onSwitchUser={onSwitchUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      
      <div className="max-w-7xl mx-auto py-6 px-4">
        {userType === 'donor' ? (
          <DonorDashboard activeTab={activeTab} setActiveTab={setActiveTab} />
        ) : (
          <VolunteerDashboard activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;