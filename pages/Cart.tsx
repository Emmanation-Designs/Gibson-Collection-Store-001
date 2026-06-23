
import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { useToast } from '../store/useToast';
import { Minus, Plus, Trash2, Rocket, ArrowLeft, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, user } = useStore();
  const { addToast } = useToast();
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const calculateItemPrice = (item: any) => {
    if (item.discount && item.discount > 0) {
      return item.price * (1 - item.discount / 100);
    }
    return item.price;
  };

  const subtotal = cart.reduce((sum, item) => sum + (calculateItemPrice(item) * item.quantity), 0);
  
  const handleCheckout = async () => {
    if (!address.trim() || !phone.trim()) {
      addToast("Please enter your delivery address and phone number.", "error");
      return;
    }

    try {
      setIsSubmitting(true);

      const orderData = {
        user_id: user?.id || null, // Allow guest checkout if not signed in
        phone: phone.trim(),
        address: address.trim(),
        subtotal: subtotal,
        total: subtotal.toString(),
        items: cart.map(item => ({
          product_id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: calculateItemPrice(item),
          color: item.selectedColor,
          image: item.image_urls?.[0] || null
        })),
        status: 'pending'
      };

      const { data, error } = await supabase.from('orders').insert(orderData).select('id').single();

      if (error || !data) {
        console.error("Order error:", error);
        addToast("Failed to submit order. Please try again.", "error");
      } else {
        addToast("Order placed successfully! Monitor your order status in your profile.", "success");
        clearCart();
        if (user) {
          navigate('/orders');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      console.error(err);
      addToast("An unexpected error occurred.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-gray-100 p-6 rounded-full mb-6">
          <Trash2 className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
        <Link to="/store" className="bg-primary text-white px-8 py-3 rounded-full font-medium hover:bg-blue-800 transition">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="flex items-center gap-2 mb-6">
        <button 
          onClick={() => navigate('/store')} 
          className="p-2 hover:bg-gray-100 rounded-full transition"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Shopping Cart ({cart.length})</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="md:col-span-2 space-y-4">
          {cart.map((item) => {
             const finalPrice = calculateItemPrice(item);
             return (
              <div key={`${item.id}-${item.selectedColor || 'default'}`} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
                <div className="w-24 h-24 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden relative">
                  <img 
                    src={item.image_urls?.[0] || `https://picsum.photos/seed/${item.id}/200`} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  {item.discount && item.discount > 0 && (
                    <div className="absolute top-0 left-0 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-br">
                      -{item.discount}%
                    </div>
                  )}
                </div>
                
                <div className="flex-grow flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800 line-clamp-1">{item.name}</h3>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm text-gray-500">{item.category}</p>
                        {item.selectedColor && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 w-fit">
                            Color: {item.selectedColor}
                          </span>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id, item.selectedColor)}
                      className="text-gray-400 hover:text-red-500 transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex justify-between items-end mt-2">
                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                      <button 
                        onClick={() => updateQuantity(item.id, -1, item.selectedColor)}
                        className="p-1 hover:bg-white rounded-md transition shadow-sm"
                      >
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>
                      <span className="font-medium text-gray-700 w-6 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1, item.selectedColor)}
                        className="p-1 hover:bg-white rounded-md transition shadow-sm"
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary text-lg">
                        ₦{(finalPrice * item.quantity).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </p>
                      {item.discount && item.discount > 0 && (
                        <p className="text-xs text-gray-400 line-through">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Checkout Summary */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h3 className="font-bold text-lg mb-4">Order Summary</h3>
            
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-bold">₦{subtotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between py-3 mb-6">
              <span className="text-gray-600 font-bold">Total</span>
              <span className="font-bold text-xl text-primary">₦{subtotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm text-gray-900 bg-white placeholder-gray-400"
                placeholder="e.g. 08012345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Address
              </label>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm text-gray-900 bg-white placeholder-gray-400"
                rows={3}
                placeholder="e.g. 123 Lagos Street, Ikeja"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <button
              onClick={handleCheckout}
              disabled={isSubmitting}
              className={`w-full bg-primary hover:bg-blue-800 text-white py-4 rounded-xl font-bold shadow-lg transition flex items-center justify-center gap-2 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing Order...
                </>
              ) : (
                <>
                  <Rocket className="w-5 h-5" />
                  Place Order Now
                </>
              )}
            </button>
            
            <p className="text-xs text-center text-gray-500 mt-4">
              By placing this order, you agree to our delivery terms. We will contact you at the provided phone number.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
