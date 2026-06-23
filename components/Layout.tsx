
import React from 'react';
import { useStore } from '../store/useStore';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Home, User, LayoutGrid, Search, LogIn, ShoppingBag, Globe, Phone, Info } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { cart, user, setSearchQuery, searchQuery } = useStore();
  const location = useLocation();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const isActive = (path: string) => location.pathname === path ? 'text-primary' : 'text-gray-400';

  // Determine if we are on corporate content (Landing, About, Contact) or inside the Store
  const isCorporateMode = ['/', '/about', '/contact'].includes(location.pathname);
  
  // Define paths where search should be visible (shop home or categories)
  const showSearch = location.pathname === '/store' || location.pathname === '/categories';
  
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-surface">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0 bg-surface">
      {/* Desktop/Mobile Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className={`flex items-center justify-between ${showSearch ? 'mb-3 md:mb-0' : ''}`}>
            <Link to="/" className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="Gibson Empire Essentials" 
                className="h-12 w-12 object-cover rounded-full bg-white border border-gray-100" 
              />
              <span className="flex flex-col">
                <h1 className="text-xl font-bold text-primary leading-tight hidden md:block">Gibson Empire Essentials</h1>
                {!isCorporateMode && (
                  <span className="text-[10px] font-black text-[#10b981] tracking-widest uppercase hidden md:block mt-0.5">
                    Premium Store
                  </span>
                )}
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-5 text-gray-600">
              {isCorporateMode ? (
                <>
                  <Link to="/" className={`hover:text-primary font-semibold text-sm transition ${location.pathname === '/' ? 'text-primary' : ''}`}>Home</Link>
                  <Link to="/about" className={`hover:text-primary font-semibold text-sm transition ${location.pathname === '/about' ? 'text-primary' : ''}`}>About Us</Link>
                  <Link to="/store" className="bg-[#1e40af] hover:bg-blue-800 text-white px-4 py-1.5 rounded-full font-bold text-sm transition flex items-center gap-1.5 shadow-sm">
                    <ShoppingBag className="w-4 h-4" />
                    <span>Shop Store</span>
                  </Link>
                  <Link to="/contact" className={`hover:text-primary font-semibold text-sm transition ${location.pathname === '/contact' ? 'text-primary' : ''}`}>Contact</Link>
                </>
              ) : (
                <>
                  <Link to="/store" className={`hover:text-primary font-semibold text-sm transition ${location.pathname === '/store' ? 'text-primary border-b-2 border-primary pb-0.5' : ''}`}>Home</Link>
                  <Link to="/categories" className={`hover:text-primary font-semibold text-sm transition ${location.pathname === '/categories' ? 'text-primary border-b-2 border-primary pb-0.5' : ''}`}>Categories</Link>
                  <Link to="/wishlist" className={`hover:text-primary font-semibold text-sm transition ${location.pathname === '/wishlist' ? 'text-primary border-b-2 border-primary pb-0.5' : ''}`}>Wishlist</Link>
                </>
              )}
              
              <span className="h-4 w-px bg-gray-200"></span>
              
              {user ? (
                <Link to="/profile" className="flex items-center gap-2 hover:text-primary font-semibold text-sm transition">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt="User" className="w-6 h-6 rounded-full object-cover border border-gray-200" />
                  ) : (
                    <User className="w-5 h-5 text-gray-400" />
                  )}
                  <span>Account</span>
                </Link>
              ) : (
                <Link to="/auth" className="flex items-center gap-2 text-primary font-bold border border-primary px-3.5 py-1 rounded-full hover:bg-blue-50 transition text-sm">
                  <LogIn className="w-4 h-4" />
                  <span>Login / Signup</span>
                </Link>
              )}

              <Link to="/cart" className="relative p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
                <ShoppingCart className="w-5 h-5 text-gray-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            </nav>
          </div>

          {/* Search Bar (Conditional) */}
          {showSearch && (
            <div className="relative w-full md:max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search diapers, bags, shoes..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-gray-100 border-none focus:ring-2 focus:ring-primary focus:bg-white transition text-sm text-gray-900 placeholder-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3.5 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-6 flex justify-between items-center md:hidden z-50">
        {isCorporateMode ? (
          <>
            <Link to="/" className={`flex flex-col items-center gap-1 ${isActive('/')}`}>
              <Home className="w-6 h-6" />
              <span className="text-[10px] font-medium">Home</span>
            </Link>
            <Link to="/about" className={`flex flex-col items-center gap-1 ${isActive('/about')}`}>
              <Info className="w-6 h-6" />
              <span className="text-[10px] font-medium">About</span>
            </Link>
            <Link to="/store" className="flex flex-col items-center gap-1 text-[#10b981] font-bold">
              <ShoppingBag className="w-6 h-6 stroke-[2.5]" />
              <span className="text-[10px] font-bold">Shop Now</span>
            </Link>
            <Link to="/contact" className={`flex flex-col items-center gap-1 ${isActive('/contact')}`}>
              <Phone className="w-6 h-6" />
              <span className="text-[10px] font-medium">Contact</span>
            </Link>
          </>
        ) : (
          <>
            <Link to="/store" className={`flex flex-col items-center gap-1 ${isActive('/store')}`}>
              <Home className="w-6 h-6" />
              <span className="text-[10px] font-medium">Home</span>
            </Link>
            <Link to="/cart" className={`flex flex-col items-center gap-1 ${isActive('/cart')} relative`}>
              <div className="relative">
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">Cart</span>
            </Link>
            <Link to="/categories" className={`flex flex-col items-center gap-1 ${isActive('/categories')}`}>
              <LayoutGrid className="w-6 h-6" />
              <span className="text-[10px] font-medium">Categories</span>
            </Link>
            <Link to={user ? "/profile" : "/auth"} className={`flex flex-col items-center gap-1 ${isActive('/profile') || isActive('/auth') || isActive('/settings')}`}>
              {user && user.avatar_url ? (
                <img src={user.avatar_url} alt="Me" className={`w-6 h-6 rounded-full object-cover border ${isActive('/profile') ? 'border-primary' : 'border-transparent'}`} />
              ) : (
                <User className="w-6 h-6" />
              )}
              <span className="text-[10px] font-medium">{user ? 'Me' : 'Login'}</span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};
