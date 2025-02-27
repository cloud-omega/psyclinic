import React from 'react';
import { Calendar, Users, CreditCard, Clock } from 'lucide-react';
import AppointmentList from '../components/appointments/AppointmentList';

const Dashboard: React.FC = () => {
  // Mock data for dashboard stats
  const stats = [
    { 
      title: 'Upcoming Appointments', 
      value: '12', 
      change: '+2.5%', 
      icon: Calendar, 
      color: 'bg-blue-500' 
    },
    { 
      title: 'Active Patients', 
      value: '48', 
      change: '+4.7%', 
      icon: Users, 
      color: 'bg-green-500' 
    },
    { 
      title: 'Monthly Revenue', 
      value: '$4,250', 
      change: '+10.3%', 
      icon: CreditCard, 
      color: 'bg-purple-500' 
    },
    { 
      title: 'Average Session', 
      value: '52 min', 
      change: '-1.2%', 
      icon: Clock, 
      color: 'bg-yellow-500' 
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's an overview of your practice.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${stat.color} text-white mr-4`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
            <div className="mt-2">
              <span className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change} from last month
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AppointmentList />
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((_, index) => (
              <div key={index} className="flex items-start pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0"></div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {['New appointment scheduled', 'Payment received', 'Session completed', 'Patient rescheduled', 'New message received'][index % 5]}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {['2 hours ago', '4 hours ago', 'Yesterday', '2 days ago', '3 days ago'][index % 5]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;