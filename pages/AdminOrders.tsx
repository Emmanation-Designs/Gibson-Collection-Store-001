import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useToast } from '../store/useToast';
import { Eye, CheckCircle, Clock, XCircle, Search, AlertCircle } from 'lucide-react';

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

  // Helper placeholder for manual Monnify verification
  const verifyPayment = async (orderId: string, reference: string) => {
    addToast("Verification requires a backend endpoint with MONNIFY_SECRET_KEY.", "info");
    // Implementation would call your Next.js/Vercel API or Supabase Edge Function here:
    // const res = await fetch('/api/verify-payment?reference=' + reference)
    // if successful update state
  };

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.phone.includes(searchTerm) ||
    o.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPaymentStatusColor = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      case 'refunded': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200'; // pending
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search ID, phone, address..." 
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e40af] outline-none min-w-[250px]"
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
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase">Payment</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase text-right">Action</th>
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
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">
                      {order.id.split('-')[0].toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{order.phone}</p>
                      <p className="text-xs text-gray-500 max-w-[150px] truncate" title={order.address}>{order.address}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                      ₦{Number(order.total).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${getPaymentStatusColor(order.payment_status)}`}>
                        {order.payment_status || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700 capitalize font-medium">{order.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="text-[#1e40af] hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg text-sm font-medium transition"
                      >
                        View
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
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Customer Details</h3>
                  <div className="bg-gray-50 p-4 rounded-xl text-sm">
                    <p className="font-medium text-gray-900 mb-1">Phone: {selectedOrder.phone}</p>
                    <p className="text-gray-600">Address: {selectedOrder.address}</p>
                    <p className="text-gray-500 mt-2 text-xs">Placed: {new Date(selectedOrder.created_at).toLocaleString()}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Payment Info</h3>
                  <div className={`p-4 rounded-xl text-sm border ${getPaymentStatusColor(selectedOrder.payment_status)}`}>
                    <p className="font-bold uppercase tracking-wide mb-1">Status: {selectedOrder.payment_status || 'Pending'}</p>
                    <p className="opacity-80">Ref: {selectedOrder.payment_reference || 'N/A'}</p>
                    {selectedOrder.paid_at && <p className="opacity-80 text-xs mt-1">Paid: {new Date(selectedOrder.paid_at).toLocaleString()}</p>}
                    
                    {selectedOrder.payment_status === 'pending' && selectedOrder.payment_reference && (
                      <button 
                        onClick={() => verifyPayment(selectedOrder.id, selectedOrder.payment_reference)}
                        className="mt-3 text-xs bg-white/50 px-2 py-1.5 rounded font-medium hover:bg-white/80 transition"
                      >
                        Verify with Monnify
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Order Items</h3>
                <div className="space-y-3">
                  {(selectedOrder.items || []).map((item: any, idx: number) => (
                    <div key={idx} className="flex gap-4 items-center bg-white border border-gray-100 p-3 rounded-xl shadow-sm">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200"></div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity} {item.color && `| Color: ${item.color}`}</p>
                      </div>
                      <div className="font-bold text-gray-900 pr-2">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="font-medium text-gray-500">Total</span>
                  <span className="text-xl font-black text-[#1e40af]">₦{Number(selectedOrder.total).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Update Order Status</h3>
              
              {selectedOrder.payment_status !== 'paid' ? (
                <div className="flex items-start gap-2 p-4 bg-yellow-50 text-yellow-800 rounded-xl border border-yellow-200 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p>Order status cannot be updated until payment is settled (Current Payment Status: <strong>{selectedOrder.payment_status || 'pending'}</strong>).</p>
                </div>
              ) : (
                <div className="flex gap-2 flex-wrap">
                  {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                    <button
                      key={status}
                      onClick={() => updateOrderStatus(selectedOrder.id, status)}
                      disabled={selectedOrder.status === status}
                      className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${
                        selectedOrder.status === status 
                          ? 'bg-[#1e40af] text-white cursor-default' 
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
