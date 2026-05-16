import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';
import { ArrowLeft, Package, Clock, CheckCircle, Truck, XCircle, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Orders: React.FC = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching orders:', error);
          return;
        }

        setOrders(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return { color: 'text-yellow-600', bg: 'bg-yellow-50', icon: Clock, label: 'Pending' };
      case 'processing':
        return { color: 'text-blue-600', bg: 'bg-blue-50', icon: Package, label: 'Processing' };
      case 'shipped':
        return { color: 'text-purple-600', bg: 'bg-purple-50', icon: Truck, label: 'Shipped' };
      case 'delivered':
        return { color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle, label: 'Delivered' };
      case 'cancelled':
        return { color: 'text-red-600', bg: 'bg-red-50', icon: XCircle, label: 'Cancelled' };
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-50', icon: Clock, label: status };
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <Package className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Track Your Orders</h2>
        <p className="text-gray-500 mb-6">Please log in to view and monitor your order status.</p>
        <button 
          onClick={() => navigate('/auth')}
          className="bg-primary hover:bg-blue-800 text-white px-8 py-3 rounded-full font-medium transition shadow-lg"
        >
          Log In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center gap-2 mb-8">
        <button 
          onClick={() => navigate('/profile')} 
          className="p-2 hover:bg-gray-100 rounded-full transition"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-500">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center bg-white rounded-2xl p-10 border border-gray-100 shadow-sm">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6">When you place an order, its status will appear here.</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-primary hover:bg-blue-800 text-white px-6 py-2.5 rounded-full font-medium transition"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            const StatusIcon = statusConfig.icon;
            const itemsList = order.items || [];
            
            return (
              <div key={order.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
                <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 font-mono mb-1">ORDER #{order.id.split('-')[0].toUpperCase()}</p>
                    <p className="text-sm font-medium text-gray-800">
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className={`self-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${statusConfig.bg} ${statusConfig.color}`}>
                    <StatusIcon className="w-4 h-4" />
                    {statusConfig.label}
                  </div>
                </div>

                <div className="border-t border-b border-gray-100 py-4 my-4 space-y-3">
                  {itemsList.map((item: any, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-50 rounded hidden sm:block flex-shrink-0">
                        {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity} {item.color ? `• Color: ${item.color}` : ''}
                        </p>
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        ₦{(item.price * item.quantity).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-500">
                    <span className="hidden sm:inline">Delivering to: </span>
                    <span className="text-gray-800 truncate block sm:inline max-w-[200px]">{order.address}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-0.5">Total Amount</p>
                    <p className="text-xl font-bold text-primary">₦{Number(order.total).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
