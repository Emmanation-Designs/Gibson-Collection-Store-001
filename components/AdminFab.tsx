import React from 'react';
import { useStore } from '../store/useStore';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';
import { ADMIN_EMAILS } from '../types';

export const AdminFab: React.FC = () => {
  const { user } = useStore();
  const location = useLocation();

  // Case-insensitive check
  const isAuthorized = user?.email && ADMIN_EMAILS.some(email => email.toLowerCase() === user.email?.toLowerCase());

  if (!isAuthorized || location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <Link 
      to="/admin/dashboard"
      className="fixed bottom-20 md:bottom-8 right-6 z-40 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-[#b83d14] transition-transform hover:scale-105 flex items-center justify-center"
      aria-label="Admin Dashboard"
    >
      <LayoutDashboard className="w-6 h-6" />
    </Link>
  );
};