import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface AddToOrderButtonProps {
  menuItemId: string;
  price: number;
  name: string;
}

export const AddToOrderButton = ({ menuItemId, price, name }: AddToOrderButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAddToOrder = async () => {
    try {
      setIsLoading(true);

      // Validate input data
      if (!menuItemId) {
        console.error('Missing menuItemId');
        toast.error('Invalid menu item');
        return;
      }

      if (!price || price <= 0) {
        console.error('Invalid price:', price);
        toast.error('Invalid price');
        return;
      }

      // Check if user is authenticated
      if (!user) {
        toast.error('Please sign in to place an order');
        navigate('/auth');
        return;
      }

      // Log the data we're about to send
      const cartItem = {
        menu_item_id: menuItemId,
        user_id: user.id,
        quantity: 1,
        price: price
      };
      
      console.log('Attempting to add item to cart:', cartItem);

      // First, verify the menu item exists
      const { data: menuItem, error: menuError } = await supabase
        .from('menu_items')
        .select('id')
        .eq('id', menuItemId)
        .single();

      if (menuError) {
        console.error('Error verifying menu item:', menuError);
        if (menuError.code === '42P01') {
          toast.error('Menu system is not properly set up. Please contact support.');
        } else {
          toast.error('Menu item not found');
        }
        return;
      }

      if (!menuItem) {
        console.error('Menu item not found:', menuItemId);
        toast.error('Menu item not found');
        return;
      }

      // Create a cart item in Supabase
      const { data, error: cartError } = await supabase
        .from('cart_items')
        .insert([cartItem])
        .select()
        .single();

      if (cartError) {
        console.error('Full cart error object:', JSON.stringify(cartError, null, 2));
        
        if (cartError.code === '42P01') {
          toast.error('Cart system is not properly set up. Please contact support.');
        } else if (cartError.code === '23505') {
          toast.error('Item is already in your cart');
        } else if (cartError.code === '23503') {
          toast.error('Invalid menu item or user');
        } else if (cartError.code === '42501') {
          toast.error('Permission denied. Please try logging in again.');
        } else {
          const errorMessage = cartError.message || 'Unknown error occurred';
          console.error('Cart error details:', {
            code: cartError.code,
            message: errorMessage,
            details: cartError.details,
            hint: cartError.hint
          });
          toast.error(`Failed to add item: ${errorMessage}`);
        }
        return;
      }

      console.log('Item added to cart successfully:', data);

      // Navigate to payment page
      navigate('/payment', {
        state: {
          amount: price * 100, // Convert to cents for Stripe
          itemName: name
        }
      });

    } catch (error) {
      console.error('Unexpected error adding to order:', error);
      
      if (error instanceof Error) {
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
        toast.error(`Error: ${error.message}`);
      } else {
        console.error('Unknown error type:', error);
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddToOrder}
      disabled={isLoading}
      className="w-full bg-amber-600 hover:bg-amber-700 text-white py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? 'Adding...' : 'Add to Order'}
    </button>
  );
}; 