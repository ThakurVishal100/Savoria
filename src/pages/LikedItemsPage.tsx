import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Heart } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface LikedItem {
  id: string;
  menu_item: {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
    category: string;
  };
}

export function LikedItemsPage() {
  const { user } = useAuth();
  const [likedItems, setLikedItems] = useState<LikedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchLikedItems = async () => {
      try {
        const { data, error } = await supabase
          .from('liked_items')
          .select(`
            id,
            menu_item:menu_items (
              id,
              name,
              description,
              price,
              image_url,
              category
            )
          `)
          .eq('user_id', user.id);

        if (error) throw error;
        setLikedItems(data || []);
      } catch (error) {
        console.error('Error fetching liked items:', error);
        toast.error('Failed to load liked items');
      } finally {
        setLoading(false);
      }
    };

    fetchLikedItems();
  }, [user]);

  const handleUnlike = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('liked_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      
      setLikedItems(prev => prev.filter(item => item.id !== itemId));
      toast.success('Item removed from favorites');
    } catch (error) {
      console.error('Error removing liked item:', error);
      toast.error('Failed to remove item from favorites');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h1>
            <p className="text-gray-600 mb-6">You need to be signed in to view your liked items.</p>
            <Link
              to="/auth"
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Favorites</h1>
        
        {likedItems.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No favorites yet</h2>
            <p className="text-gray-600 mb-6">Items you like will appear here</p>
            <Link
              to="/menu"
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {likedItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="relative">
                  <img
                    src={item.menu_item.image_url || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800'}
                    alt={item.menu_item.name}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => handleUnlike(item.id)}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-amber-50 transition-colors duration-200"
                  >
                    <Heart className="h-5 w-5 text-amber-600 fill-current" />
                  </button>
                  <div className="absolute top-4 left-4 bg-amber-600/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-white font-medium">${item.menu_item.price}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.menu_item.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{item.menu_item.description}</p>
                  <Link
                    to={`/menu/${item.menu_item.id}`}
                    className="text-amber-600 hover:text-amber-700 font-semibold transition-colors duration-200"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 