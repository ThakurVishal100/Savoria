import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Navigation } from '../components/Navigation';

interface CartItem {
  id: number;
  menu_item_id: number;
  quantity: number;
  menu_item: {
    name: string;
    price: number;
  };
}

export function CartPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from('cart_items')
      .select('id, menu_item_id, quantity, menu_item(name, price)')
      .eq('user_id', user.id)
      .then(({ data, error }) => {
        if (!error && data) setCartItems(data as CartItem[]);
        setLoading(false);
      });
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-2xl mx-auto pt-24 pb-16 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
            <p className="text-gray-600 mb-6">You need to be signed in to view your cart.</p>
            <button
              onClick={() => navigate('/auth')}
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="max-w-2xl mx-auto pt-24 pb-16 px-4">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
        {loading ? (
          <div>Loading...</div>
        ) : cartItems.length === 0 ? (
          <div>Your cart is empty.</div>
        ) : (
          <ul className="space-y-4">
            {cartItems.map((item) => (
              <li key={item.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <div className="font-semibold">{item.menu_item.name}</div>
                  <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                </div>
                <div className="font-medium">${((item.menu_item.price * item.quantity) / 100).toFixed(2)}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 