import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ADMIN_EMAILS } from '../types';
import { LayoutDashboard, ShoppingBag, PlusSquare, ArrowLeft, Menu, X } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, isAuthReady } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isAuthReady) {
      const isAuthorized = user?.email && ADMIN_EMAILS.some(email => email.toLowerCase() === user.email?.toLowerCase());
      if (!isAuthorized) {
        navigate('/');
      }
    }
  }, [user, isAuthReady, navigate]);

  // Close sidebar on navigation on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  if (!isAuthReady || !user) return null;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#ca4c1b] text-white flex items-center justify-between px-4 z-30">
        <h2 className="text-lg font-bold">Admin Dashboard</h2>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-[#b83d14] transition-colors"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 bg-[#ca4c1b] text-white flex flex-col hide-scrollbar overflow-y-auto
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        <div className="p-6 border-b border-[#b83d14] hidden md:block">
          <h2 className="text-xl font-bold">Admin Dashboard</h2>
          <p className="text-orange-200 text-sm mt-1 truncate">{user.email}</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-16 md:mt-0">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-[#b83d14] text-white shadow-sm' : 'text-orange-100 hover:bg-[#b83d14]/50 hover:text-white'}`
            }
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </NavLink>
          <NavLink
            to="/admin/orders"
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-[#b83d14] text-white shadow-sm' : 'text-orange-100 hover:bg-[#b83d14]/50 hover:text-white'}`
            }
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="font-medium">Orders</span>
          </NavLink>
          <NavLink
            to="/admin/upload"
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-[#b83d14] text-white shadow-sm' : 'text-orange-100 hover:bg-[#b83d14]/50 hover:text-white'}`
            }
          >
            <PlusSquare className="w-5 h-5" />
            <span className="font-medium">Products</span>
          </NavLink>
        </nav>

        <div className="p-4 border-t border-[#b83d14]">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-4 py-3 text-orange-200 hover:text-white hover:bg-[#b83d14]/50 transition-colors rounded-lg w-full font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Store</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full pt-16 md:pt-0">
        <div className="p-4 sm:p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
