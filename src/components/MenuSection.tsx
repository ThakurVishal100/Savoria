import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useMenuItems } from '../hooks/useMenuItems';

export function MenuSection() {
  const { menuItems, loading, error } = useMenuItems();

  if (loading) {
    return (
      <section id="menu" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-amber-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading our delicious menu...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="menu" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">Error loading menu: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  // Show only featured items (first 6) on homepage
  const featuredItems = menuItems.slice(0, 6);

  // Group menu items by category
  const groupedItems = featuredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof featuredItems>);

  const categoryOrder = ['appetizer', 'main', 'dessert'];
  const categoryNames = {
    appetizer: 'Appetizers',
    main: 'Main Courses',
    dessert: 'Desserts'
  };

  return (
    <section id="menu" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Signature
            <span className="block text-amber-600">Creations</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our carefully curated selection of dishes, each crafted with the finest ingredients 
            and presented with artistic flair.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredItems.map((item) => (
            <Link
              key={item.id}
              to={`/menu/${item.id}`}
              className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={item.image_url || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'} 
                  alt={item.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-amber-600 font-bold text-lg">${item.price}</span>
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-bold text-gray-900 mb-3">{item.name}</h4>
                <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">{item.description}</p>
                <div className="text-amber-600 hover:text-amber-700 font-semibold flex items-center space-x-2 group-hover:translate-x-2 transition-transform duration-200">
                  <span>View Details</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/menu"
            className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 transform hover:scale-105"
          >
            View Full Menu
          </Link>
        </div>
      </div>
    </section>
  );
}