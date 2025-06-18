import React, { useState } from 'react';
import { Calendar, Clock, Users, MapPin, Phone, Mail, Filter, Search } from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { useAuth } from '../contexts/AuthContext';

export function ReservationsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock reservation data - in a real app, this would come from your database
  const reservations = [
    {
      id: '1',
      date: '2024-01-15',
      time: '19:00',
      party_size: 4,
      status: 'confirmed',
      special_requests: 'Window table preferred',
      created_at: '2024-01-10T10:00:00Z'
    },
    {
      id: '2',
      date: '2024-01-08',
      time: '18:30',
      party_size: 2,
      status: 'completed',
      special_requests: 'Anniversary dinner',
      created_at: '2024-01-05T15:30:00Z'
    },
    {
      id: '3',
      date: '2024-01-22',
      time: '20:00',
      party_size: 6,
      status: 'pending',
      special_requests: 'Business dinner',
      created_at: '2024-01-12T09:15:00Z'
    }
  ];

  const filteredReservations = reservations.filter(reservation => {
    const matchesFilter = filter === 'all' || reservation.status === filter;
    const matchesSearch = reservation.special_requests?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.date.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">My Reservations</h1>
            <p className="text-xl text-gray-600">
              Manage your dining reservations at Savoria
            </p>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search reservations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none bg-white min-w-[200px]"
                >
                  <option value="all">All Reservations</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Reservations List */}
          <div className="space-y-6">
            {filteredReservations.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No reservations found</h3>
                <p className="text-gray-600 mb-6">
                  {filter === 'all' 
                    ? "You haven't made any reservations yet." 
                    : `No ${filter} reservations found.`
                  }
                </p>
                <button className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
                  Make a Reservation
                </button>
              </div>
            ) : (
              filteredReservations.map((reservation) => (
                <div key={reservation.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(reservation.status)}`}>
                            {reservation.status}
                          </span>
                          <span className="text-sm text-gray-500">
                            Booked on {new Date(reservation.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center space-x-3">
                            <Calendar className="h-5 w-5 text-amber-600" />
                            <div>
                              <p className="text-sm text-gray-600">Date</p>
                              <p className="font-semibold text-gray-900">{formatDate(reservation.date)}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <Clock className="h-5 w-5 text-amber-600" />
                            <div>
                              <p className="text-sm text-gray-600">Time</p>
                              <p className="font-semibold text-gray-900">{formatTime(reservation.time)}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <Users className="h-5 w-5 text-amber-600" />
                            <div>
                              <p className="text-sm text-gray-600">Party Size</p>
                              <p className="font-semibold text-gray-900">
                                {reservation.party_size} {reservation.party_size === 1 ? 'person' : 'people'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <MapPin className="h-5 w-5 text-amber-600" />
                            <div>
                              <p className="text-sm text-gray-600">Location</p>
                              <p className="font-semibold text-gray-900">Savoria</p>
                            </div>
                          </div>
                        </div>

                        {reservation.special_requests && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-1">Special Requests</p>
                            <p className="text-gray-900">{reservation.special_requests}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row lg:flex-col space-y-2 sm:space-y-0 sm:space-x-2 lg:space-x-0 lg:space-y-2 lg:ml-6">
                        {reservation.status === 'confirmed' && (
                          <>
                            <button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                              Modify
                            </button>
                            <button className="border border-red-300 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                              Cancel
                            </button>
                          </>
                        )}
                        {reservation.status === 'pending' && (
                          <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                            View Details
                          </button>
                        )}
                        {reservation.status === 'completed' && (
                          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                            Leave Review
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Restaurant Contact Info */}
                  <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                        <div className="flex items-center space-x-1">
                          <Phone className="h-4 w-4" />
                          <span>(555) 123-4567</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Mail className="h-4 w-4" />
                          <span>info@savoria.com</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>123 Culinary Avenue, Downtown District, NY 10001</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}