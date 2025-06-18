import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, Settings, Edit3, Save, X, Heart } from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.user_metadata?.first_name || '',
    lastName: user?.user_metadata?.last_name || '',
    email: user?.email || '',
    phone: user?.user_metadata?.phone || '',
  });

  const handleSave = () => {
    // Here you would typically update the user profile
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.user_metadata?.first_name || '',
      lastName: user?.user_metadata?.last_name || '',
      email: user?.email || '',
      phone: user?.user_metadata?.phone || '',
    });
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-32"></div>
            <div className="relative px-8 pb-8">
              <div className="flex items-center space-x-6 -mt-16">
                <div className="bg-white p-2 rounded-full shadow-lg">
                  <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center">
                    <User className="h-12 w-12 text-amber-600" />
                  </div>
                </div>
                <div className="pt-16">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
                  </h1>
                  <p className="text-gray-600">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2 text-amber-600 hover:text-amber-700 transition-colors duration-200"
                    >
                      <Edit3 className="h-5 w-5" />
                      <span>Edit</span>
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSave}
                        className="flex items-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                      >
                        <Save className="h-4 w-4" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center space-x-2 border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors duration-200"
                      >
                        <X className="h-4 w-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900 py-3">{formData.firstName || 'Not provided'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900 py-3">{formData.lastName || 'Not provided'}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <p className="text-gray-900">{formData.email}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <p className="text-gray-900">{formData.phone || 'Not provided'}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Member Since
                    </label>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <p className="text-gray-900">
                        {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Account Settings</span>
                </h3>
                <div className="space-y-4">
                  <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <div className="font-medium text-gray-900">Change Password</div>
                    <div className="text-sm text-gray-600">Update your password</div>
                  </button>
                  <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <div className="font-medium text-gray-900">Email Preferences</div>
                    <div className="text-sm text-gray-600">Manage email notifications</div>
                  </button>
                  <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <div className="font-medium text-gray-900">Privacy Settings</div>
                    <div className="text-sm text-gray-600">Control your privacy</div>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Reservations</span>
                    <span className="font-semibold text-gray-900">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Favorite Dishes</span>
                    <span className="font-semibold text-gray-900">5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Reviews Written</span>
                    <span className="font-semibold text-gray-900">3</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4">
                <Link
                  to="/liked"
                  className="w-full flex items-center justify-center gap-2 border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white py-3 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg mb-2"
                >
                  <Heart className="h-5 w-5" />
                  My Liked Items
                </Link>
                <Link
                  to="/reservations"
                  className="w-full flex items-center justify-center gap-2 border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white py-3 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  My Reservations
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}