import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ShoppingBag, CreditCard, DollarSign, Clock, ArrowRight, MessageSquare, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: orders, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (orders) {
          const totalOrders = orders.length;
          const nonCancelledOrders = orders.filter(o => o.status !== 'cancelled');
          const pendingOrders = orders.filter(o => o.status === 'pending').length;
          const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
          
          const totalRevenue = nonCancelledOrders.reduce((sum, order) => {
            return sum + (Number(order.total) || 0);
          }, 0);

          setStats({
            totalOrders,
            totalRevenue,
            pendingOrders,
            deliveredOrders,
          });

          setRecentOrders(orders.slice(0, 5));
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#ca4c1b] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const formatWhatsAppLink = (phone: string, orderId: string, total: number) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('0') && cleanPhone.length === 11
      ? '234' + cleanPhone.slice(1)
      : cleanPhone;
    
    const shortId = orderId.split('-')[0].toUpperCase();
    const text = `Hello! This is Gibson Empire Essentials Admin regarding your Order #${shortId} (Total: ₦${Number(total).toLocaleString()}). We received your checkout details via our web boutique. We would love to confirm availability and process your delivery. Let's finalize your order!`;
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`;
  };

  const statCards = [
    { label: 'Total Sales Revenue', value: `₦${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'WhatsApp Order Leads', value: stats.totalOrders, icon: MessageSquare, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Fulfilled Orders', value: stats.deliveredOrders, icon: CreditCard, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Pending WhatsApp Confirmation', value: stats.pendingOrders, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-sm text-gray-500 mt-1">
          Monitor your customer checkouts, revenue estimates, and reach out directly to clients on WhatsApp.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{stat.label}</p>
                <h3 className="text-2xl font-extrabold text-gray-900">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Recent Checkout Requests</h2>
            <p className="text-xs text-gray-400 mt-0.5">Customers who clicked checkout and were routed to WhatsApp</p>
          </div>
          <Link to="/admin/orders" className="text-sm font-semibold text-[#ca4c1b] hover:text-[#b83d14] flex items-center gap-1">
            View All Orders <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer Contact</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Estimated Total</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No orders found.</td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600 font-semibold">
                      #{order.id.split('-')[0].toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">{order.phone}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[200px]" title={order.address}>{order.address}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-extrabold text-gray-900">
                      ₦{Number(order.total).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                        order.status === 'delivered' ? 'bg-emerald-50 text-emerald-700' :
                        order.status === 'pending' ? 'bg-amber-50 text-amber-700 font-bold' :
                        order.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                        'bg-blue-50 text-blue-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <a 
                        href={formatWhatsAppLink(order.phone, order.id, Number(order.total))}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-[#25d366] hover:bg-[#20ba56] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-sm hover:shadow"
                      >
                        <MessageSquare className="w-3.5 h-3.5 fill-current" />
                        Chat Client
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
