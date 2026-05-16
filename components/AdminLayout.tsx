import React, { useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ADMIN_EMAILS } from '../types';
import { LayoutDashboard, ShoppingBag, PlusSquare, ArrowLeft } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, isAuthReady } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthReady) {
      const isAuthorized = user?.email && ADMIN_EMAILS.some(email => email.toLowerCase() === user.email?.toLowerCase());
      if (!isAuthorized) {
        navigate('/');
      }
    }
  }, [user, isAuthReady, navigate]);

  if (!isAuthReady || !user) return null;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1e40af] text-white flex flex-col hide-scrollbar overflow-y-auto">
        <div className="p-6 border-b border-blue-800">
          <h2 className="text-xl font-bold">Admin Dashboard</h2>
          <p className="text-blue-300 text-sm mt-1">{user.email}</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-800/50 hover:text-white'}`
            }
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/admin/orders"
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-800/50 hover:text-white'}`
            }
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Orders</span>
          </NavLink>
          <NavLink
            to="/admin/upload"
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-800/50 hover:text-white'}`
            }
          >
            <PlusSquare className="w-5 h-5" />
            <span>Products</span>
          </NavLink>
        </nav>

        <div className="p-4 border-t border-blue-800">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 px-4 py-3 text-blue-200 hover:text-white hover:bg-blue-800/50 transition-colors rounded-lg w-full"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Store</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};
