import React from 'react';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LogOut, 
  Heart, 
  ChevronRight, 
  User, 
  Phone, 
  LayoutDashboard,
  ArrowLeft,
  Settings,
  Package,
  Globe
} from 'lucide-react';
import { ADMIN_EMAILS, WHATSAPP_NUMBER } from '../types';

export const Profile: React.FC = () => {
  const { user, setUser } = useStore();
  const navigate = useNavigate();

  // Case-insensitive check
  const isAdmin = user?.email && ADMIN_EMAILS.some(email => email.toLowerCase() === user.email?.toLowerCase());

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/');
  };

  const handleSupport = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank');
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 relative">
        <div className="absolute top-0 left-0 w-full px-4 py-2">
            <button 
              onClick={() => navigate('/')} 
              className="flex items-center gap-2 text-gray-500 hover:text-primary transition"
            >
              <ArrowLeft className="w-5 h-5" /> Back to Home
            </button>
        </div>
        <div className="bg-orange-50 p-4 rounded-full mb-4 mt-10">
          <User className="w-12 h-12 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Not Logged In</h2>
        <p className="text-gray-500 mb-6 text-center">Login to view your wishlist and manage your account.</p>
        <Link 
          to="/auth" 
          className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-[#b83d14] transition shadow-lg w-full max-w-xs text-center"
        >
          Login / Sign Up
        </Link>
      </div>
    );
  }

  // Determine Display Name and Avatar
  const displayName = user.full_name || 'Gibson Empire Customer';
  const displayAvatar = user.avatar_url;

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <div className="flex items-center gap-2 mb-6">
        <button 
          onClick={() => navigate('/')} 
          className="p-2 hover:bg-gray-100 rounded-full transition"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">My Account</h1>
      </div>

      {/* Header Profile Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full flex-shrink-0 overflow-hidden border-2 border-white shadow-sm bg-gray-100">
          {displayAvatar ? (
            <img src={displayAvatar} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1 overflow-hidden">
          <h2 className="text-lg font-bold text-gray-900 truncate">{displayName}</h2>
          {/* Email hidden as requested */}
          <div className="mt-1 flex gap-2">
             <Link to="/settings" className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
               <Settings className="w-3 h-3" /> Edit Profile
             </Link>
          </div>
        </div>
      </div>

      {/* Admin Quick Access */}
      {isAdmin && (
        <div className="mb-6">
          <Link 
            to="/admin/dashboard" 
            className="flex items-center gap-4 bg-gradient-to-r from-[#ca4c1b] to-[#ea580c] text-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition transform active:scale-95 cursor-pointer"
          >
            <div className="bg-white/20 p-2 rounded-lg">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold">Admin Dashboard</h3>
              <p className="text-orange-100 text-xs mt-0.5">Manage products, view inventory, and check orders</p>
            </div>
            <ChevronRight className="w-5 h-5 text-orange-200" />
          </Link>
        </div>
      )}

      {/* Settings Menu List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <MenuItem icon={Package} label="My Orders" to="/orders" />
        <div className="h-px bg-gray-50 my-1"></div>
        <MenuItem icon={Heart} label="My Wishlist" to="/wishlist" />
        <div className="h-px bg-gray-50 my-1"></div>
        <MenuItem icon={Settings} label="Profile Settings" to="/settings" />
        <div className="h-px bg-gray-50 my-1"></div>
        <button 
          onClick={handleSupport} 
          className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition text-left"
        >
          <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
            <Phone className="w-5 h-5" />
          </div>
          <span className="flex-1 font-medium text-gray-700">WhatsApp Support</span>
          <ChevronRight className="w-4 h-4 text-gray-300" />
        </button>
      </div>

      {/* Prominent Visit Landing Page Banner */}
      <div className="bg-stone-50 border border-stone-200/60 rounded-2xl p-5 mb-6 text-center space-y-3 shadow-xs">
        <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center mx-auto text-[#ca4c1b]">
          <Globe className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-gray-900 text-sm">Want to see the Introduction?</h4>
          <p className="text-[11px] text-gray-500 leading-relaxed max-w-md mx-auto">
            Click below to return to the root landing page. This will temporarily reset your default homepage setting.
          </p>
        </div>
        <button 
          onClick={() => {
            localStorage.setItem('overrideLanding', 'true');
            localStorage.removeItem('hasSeenLanding');
            navigate('/');
          }}
          className="w-full h-11 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl transition text-xs shadow-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          <Globe className="w-4 h-4" />
          Visit Landing Page (Reset Default View)
        </button>
      </div>

      <button 
        onClick={handleLogout}
        className="w-full bg-white border border-red-100 text-red-500 py-3.5 rounded-xl font-bold hover:bg-red-50 transition flex items-center justify-center gap-2 shadow-sm"
      >
        <LogOut className="w-5 h-5" />
        Log Out
      </button>
      
      <p className="text-center text-xs text-gray-400 mt-6">
        Gibson Empire Essentials v1.1.0
      </p>
    </div>
  );
};

// Helper Component for Menu Items
const MenuItem: React.FC<{ icon: any, label: string, to?: string, onClick?: () => void }> = ({ icon: Icon, label, to, onClick }) => {
  const content = (
    <>
      <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">
        <Icon className="w-5 h-5" />
      </div>
      <span className="flex-1 font-medium text-gray-700">{label}</span>
      <ChevronRight className="w-4 h-4 text-gray-300" />
    </>
  );

  if (to) {
    return (
      <Link to={to} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition">
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition text-left">
      {content}
    </button>
  );
};
