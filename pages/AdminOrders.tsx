import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useToast } from '../store/useToast';
import { XCircle, Search, MessageSquare, ExternalLink, ChevronRight, Phone } from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const { addToast } = useToast();

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error("Failed to fetch orders", err);
      addToast("Failed to fetch orders", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      addToast(`Order status updated to ${newStatus}`, "success");
    } catch (err) {
      console.error(err);
      addToast("Failed to update status", "error");
    }
  };

  const formatWhatsAppLink = (phone: string, orderId: string, total: number) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('0') && cleanPhone.length === 11
      ? '234' + cleanPhone.slice(1)
      : cleanPhone;
    
    const shortId = orderId.split('-')[0].toUpperCase();
    const text = `Hello! This is Gibson Empire Essentials Admin regarding your Order #${shortId} (Total: ₦${Number(total).toLocaleString()}). We received your checkout details via our web boutique. We would love to confirm availability and process your delivery. Let's finalize your order!`;
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`;
  };

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.phone.includes(searchTerm) ||
    o.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-xs text-gray-400 mt-1">Manage and track your customers' WhatsApp shopping checkouts</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search ID, phone, address..." 
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ca4c1b] outline-none min-w-[250px] text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Total</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">Contact</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading orders...</td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No orders match your search.</td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600 font-semibold">
                      #{order.id.split('-')[0].toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">{order.phone}</p>
                      <p className="text-xs text-gray-500 max-w-[150px] truncate" title={order.address}>{order.address}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-extrabold text-gray-900">
                      ₦{Number(order.total).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold capitalize ${
                        order.status === 'delivered' ? 'bg-emerald-50 text-emerald-700' :
                        order.status === 'pending' ? 'bg-amber-50 text-amber-700 font-bold' :
                        order.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                        'bg-blue-50 text-blue-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <a 
                        href={formatWhatsAppLink(order.phone, order.id, Number(order.total))}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex p-2 rounded-full bg-green-50 text-[#25d366] hover:bg-[#25d366] hover:text-white transition-all shadow-xs"
                        title="Chat on WhatsApp"
                      >
                        <MessageSquare className="w-4 h-4 fill-current" />
                      </a>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="text-[#ca4c1b] hover:text-orange-850 bg-orange-50 px-3 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-900">
                Order <span className="font-mono text-gray-500">#{selectedOrder.id.split('-')[0].toUpperCase()}</span>
              </h2>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* WhatsApp Interactive Action Card */}
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#25d366] animate-pulse"></div>
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">WhatsApp Action Required</span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm">Direct Contact with Client</h4>
                  <p className="text-xs text-gray-600 leading-relaxed max-w-md">
                    Open a pre-filled direct message in WhatsApp to confirm pricing, address coordinates, and availability.
                  </p>
                </div>
                <a 
                  href={formatWhatsAppLink(selectedOrder.phone, selectedOrder.id, Number(selectedOrder.total))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-[#25d366] hover:bg-[#20ba56] text-white px-5 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95 whitespace-nowrap"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  Chat on WhatsApp
                </a>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Customer Details</h3>
                <div className="bg-gray-50 p-4 rounded-xl text-sm">
                  <p className="font-bold text-gray-900 mb-1">Phone Number: {selectedOrder.phone}</p>
                  <p className="text-gray-600">Delivery Address: {selectedOrder.address}</p>
                  <p className="text-gray-500 mt-2 text-xs">Placed: {new Date(selectedOrder.created_at).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Order Items</h3>
                <div className="space-y-3">
                  {(selectedOrder.items || []).map((item: any, idx: number) => (
                    <div key={idx} className="flex gap-4 items-center bg-white border border-gray-100 p-3 rounded-xl shadow-xs">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200"></div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 truncate text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Qty: {item.quantity} 
                          {item.color && ` | Color: ${item.color}`}
                          {item.size && ` | Size: ${item.size}`}
                        </p>
                      </div>
                      <div className="font-extrabold text-gray-900 pr-2 text-sm">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="font-medium text-gray-500">Estimated Subtotal</span>
                  <span className="text-xl font-black text-[#ca4c1b]">₦{Number(selectedOrder.total).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Update Order Status</h3>
              
              <div className="flex gap-2 flex-wrap">
                {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                  <button
                    key={status}
                    onClick={() => updateOrderStatus(selectedOrder.id, status)}
                    disabled={selectedOrder.status === status}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition cursor-pointer ${
                      selectedOrder.status === status 
                        ? 'bg-[#ca4c1b] text-white cursor-default' 
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
