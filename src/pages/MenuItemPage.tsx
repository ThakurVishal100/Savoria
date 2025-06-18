import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Users, Star, Heart, Share2 } from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { useMenuItems } from '../hooks/useMenuItems';
import { ReservationForm } from '../components/ReservationForm';
import { AddToOrderButton } from '../components/AddToOrderButton';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export function MenuItemPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { menuItems, loading } = useMenuItems();
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);

  const menuItem = menuItems.find(item => item.id === id);

  const handleLike = async () => {
    if (!user) {
      toast.error('Please sign in to like items');
      navigate('/auth');
      return;
    }

    try {
      if (isLiked) {
        // Unlike: Delete from database
        const { error } = await supabase
          .from('liked_items')
          .delete()
          .eq('user_id', user.id)
          .eq('menu_item_id', id);

        if (error) throw error;
        toast.success('Removed from favorites');
      } else {
        // Like: Insert into database
        const { error } = await supabase
          .from('liked_items')
          .insert([
            {
              user_id: user.id,
              menu_item_id: id
            }
          ]);

        if (error) throw error;
        toast.success('Added to favorites');
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update favorites');
    }
  };

  // Add useEffect to check if item is liked
  useEffect(() => {
    const checkIfLiked = async () => {
      if (!user || !id) return;

      try {
        const { data, error } = await supabase
          .from('liked_items')
          .select('id')
          .eq('user_id', user.id)
          .eq('menu_item_id', id)
          .single();

        if (error && error.code !== 'PGRST116') throw error;
        setIsLiked(!!data);
      } catch (error) {
        console.error('Error checking like status:', error);
      }
    };

    checkIfLiked();
  }, [user, id]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: menuItem?.name,
          text: `Check out ${menuItem?.name} at Savoria!`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        toast.error('Failed to share');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="pt-24 flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
      </div>
    );
  }

  if (!menuItem) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="pt-24 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Menu Item Not Found</h2>
            <p className="text-gray-600 mb-8">The menu item you're looking for doesn't exist.</p>
            <Link
              to="/menu"
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Back to Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const categoryNames = {
    appetizer: 'Appetizer',
    main: 'Main Course',
    dessert: 'Dessert',
    beverage: 'Beverage'
  };

  const relatedItems = menuItems
    .filter(item => item.category === menuItem.category && item.id !== menuItem.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="pt-16">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-amber-600 transition-colors duration-200 mb-8"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
        </div>

        {/* Menu Item Details */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Image */}
            <div className="relative">
              <img
                src={menuItem.image_url || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800'}
                alt={menuItem.name}
                className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-amber-600 font-bold text-xl">${menuItem.price}</span>
              </div>
              <div className="absolute top-6 left-6 bg-amber-600/90 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-white font-medium capitalize">
                  {categoryNames[menuItem.category as keyof typeof categoryNames] || menuItem.category}
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {menuItem.name}
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {menuItem.description}
              </p>

              <div className="flex items-center space-x-6 mb-8">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-amber-600" />
                  <span className="text-gray-600">15-20 min prep</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-amber-600" />
                  <span className="text-gray-600">Serves 1-2</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-amber-600 fill-current" />
                  <span className="text-gray-600">4.9/5</span>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-8">
                <span className="text-3xl font-bold text-amber-600">${menuItem.price}</span>
                <div className="flex space-x-2">
                  <button 
                    onClick={handleLike}
                    className={`p-3 border rounded-full transition-all duration-200 transform hover:scale-110 ${
                      isLiked 
                        ? 'border-amber-600 bg-amber-600 text-white' 
                        : 'border-gray-300 hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                  </button>
                  <button 
                    onClick={handleShare}
                    className="p-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-all duration-200 transform hover:scale-110"
                  >
                    <Share2 className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <AddToOrderButton
                  menuItemId={menuItem.id}
                  price={menuItem.price}
                  name={menuItem.name}
                />
                <Link
                  to="/#contact"
                  className="w-full border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-center block"
                >
                  Make Reservation
                </Link>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Ingredients & Allergens</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Key Ingredients:</h4>
                  <p className="text-gray-600">Premium ingredients sourced from local farms and trusted suppliers worldwide.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Allergen Information:</h4>
                  <p className="text-gray-600">Please inform our staff of any allergies or dietary restrictions.</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Chef's Notes</h3>
              <p className="text-gray-600 leading-relaxed">
                This dish represents our commitment to culinary excellence, combining traditional techniques 
                with modern innovation. Each element is carefully crafted to create a harmonious balance of 
                flavors and textures that will delight your palate.
              </p>
            </div>
          </div>

          {/* Related Items */}
          {relatedItems.length > 0 && (
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                You Might Also Like
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedItems.map((item) => (
                  <Link
                    key={item.id}
                    to={`/menu/${item.id}`}
                    className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                  >
                    <div className="relative overflow-hidden">
                      <img 
                        src={item.image_url || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'} 
                        alt={item.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-amber-600 font-bold">${item.price}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">{item.name}</h4>
                      <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Reservation Section */}
          <div className="mt-20 bg-gray-50 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to Dine?</h3>
              <p className="text-xl text-gray-600">Make a reservation to experience this dish and more.</p>
            </div>
            <ReservationForm />
          </div>
        </div>
      </div>
    </div>
  );
}