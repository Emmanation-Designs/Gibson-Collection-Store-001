
import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShoppingCart, 
  Home, 
  User, 
  LayoutGrid, 
  Search, 
  LogIn, 
  ShoppingBag, 
  Globe, 
  Phone, 
  Info, 
  Mail, 
  MapPin, 
  Shield, 
  FileText, 
  Cookie, 
  X,
  Sparkles
} from 'lucide-react';

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

  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | 'cookies' | null>(null);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    if (location.pathname !== '/') return;
    
    const handleScroll = () => {
      const sections = ['home', 'about', 'testimonials', 'contact'];
      const scrollPosition = window.scrollY + 140; // offset for sticky header

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const handleScrollTo = (id: string) => {
    if (location.pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      const topOffset = el.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  };

  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-surface">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0 bg-surface flex flex-col">
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
                  <button 
                    onClick={() => handleScrollTo('home')} 
                    className="hover:text-primary font-bold text-sm tracking-wide transition cursor-pointer relative py-1 focus:outline-none text-stone-500"
                  >
                    Home
                    {activeSection === 'home' && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                    )}
                  </button>
                  <button 
                    onClick={() => handleScrollTo('about')} 
                    className="hover:text-primary font-bold text-sm tracking-wide transition cursor-pointer relative py-1 focus:outline-none text-stone-500"
                  >
                    About Us
                    {activeSection === 'about' && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                    )}
                  </button>
                  <button 
                    onClick={() => handleScrollTo('testimonials')} 
                    className="hover:text-primary font-bold text-sm tracking-wide transition cursor-pointer relative py-1 focus:outline-none text-stone-500"
                  >
                    Testimonials
                    {activeSection === 'testimonials' && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                    )}
                  </button>
                  <button 
                    onClick={() => handleScrollTo('contact')} 
                    className="hover:text-primary font-bold text-sm tracking-wide transition cursor-pointer relative py-1 focus:outline-none text-stone-500"
                  >
                    Contact
                    {activeSection === 'contact' && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                    )}
                  </button>
                  
                  {/* Shop Now is placed at the last part of corporate mode, right before the divider! */}
                  <Link 
                    to="/store" 
                    onClick={() => {
                      localStorage.setItem('hasSeenLanding', 'true');
                      localStorage.removeItem('overrideLanding');
                    }}
                    className="bg-[#ca4c1b] hover:bg-[#b83d14] text-white px-5 py-2 rounded-full font-bold text-xs tracking-wider uppercase transition duration-300 flex items-center gap-1.5 shadow-sm"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Shop Now</span>
                  </Link>
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
                  <LogIn className="w-4 h-4 text-primary" />
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

      <main className="container mx-auto px-4 py-6 flex-grow">
        {children}
      </main>

      {/* Footer Section */}
      {location.pathname === '/' && (
        <footer className="bg-[#ca4c1b] text-orange-100 pt-16 pb-24 md:pb-12 mt-auto border-t border-orange-850/40 relative z-10 font-sans">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
              
              {/* Column 1: Info & Brand */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <img 
                    src="/logo.png" 
                    alt="Gibson Empire Essentials" 
                    className="w-10 h-10 object-cover rounded-full bg-white border border-orange-900/30" 
                  />
                  <span className="font-extrabold text-white text-md tracking-tight">Gibson Empire Essentials</span>
                </div>
                <p className="text-xs text-orange-100/85 leading-relaxed font-medium">
                  Pure fabric materials, strict organic safety tests, and ultimate baby luxury. Where Quality Meets Affection. Delivering daily nursery essentials straight to your family's doorstep.
                </p>
                <div className="flex items-center gap-1 text-[10px] text-emerald-300 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-500/20 w-fit">
                  <Sparkles className="w-3 h-3 fill-current" />
                  <span>Premium Quality Vetted</span>
                </div>
              </div>

              {/* Column 2: Explore */}
              <div className="space-y-4">
                <h4 className="font-bold text-white text-sm uppercase tracking-wider">Explore</h4>
                <ul className="space-y-2 text-xs font-semibold">
                  <li>
                    <Link to="/" className="text-orange-100/90 hover:text-white transition duration-200 block">Home</Link>
                  </li>
                  <li>
                    <Link to="/about" className="text-orange-100/90 hover:text-white transition duration-200 block">Our Mission & About</Link>
                  </li>
                  <li>
                    <Link to="/store" className="text-orange-100/90 hover:text-white transition duration-200 block">How it Works & Store</Link>
                  </li>
                  <li>
                    <Link to="/store" className="hover:text-white transition duration-200 block font-bold text-yellow-300">Our Premium Services</Link>
                  </li>
                </ul>
              </div>

              {/* Column 3: Legal stuff */}
              <div className="space-y-4">
                <h4 className="font-bold text-white text-sm uppercase tracking-wider">Legal Notice</h4>
                <div className="space-y-2 text-xs font-semibold flex flex-col items-start">
                  <button 
                    onClick={() => setLegalModal('privacy')}
                    className="text-orange-100/90 hover:text-white transition duration-200 text-left cursor-pointer"
                  >
                    Privacy Policy
                  </button>
                  <button 
                    onClick={() => setLegalModal('terms')}
                    className="text-orange-100/90 hover:text-white transition duration-200 text-left cursor-pointer"
                  >
                    Terms of Service
                  </button>
                  <button 
                    onClick={() => setLegalModal('cookies')}
                    className="text-orange-100/90 hover:text-white transition duration-200 text-left cursor-pointer"
                  >
                    Cookie Settings
                  </button>
                </div>
              </div>

              {/* Column 4: Contact / Reach Out */}
              <div className="space-y-4">
                <h4 className="font-bold text-white text-sm uppercase tracking-wider">Reach Out</h4>
                <ul className="space-y-3.5 text-xs font-medium">
                  <li className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-white shrink-0 mt-0.5" />
                    <span className="text-orange-100/85 leading-relaxed">
                      Saka bisiolu complex, ojuore market, oppositre under bridge. shop 123, ogun state, nigeria
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-white shrink-0" />
                    <a href="mailto:gibsonempireessentials@gmail.com" className="text-orange-100/85 hover:text-white transition truncate">
                      gibsonempireessentials@gmail.com
                    </a>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-white shrink-0" />
                    <a href="https://wa.me/2348033464218" target="_blank" className="text-orange-100/85 hover:text-white transition">
                      +234 803 346 4218
                    </a>
                  </li>
                </ul>
              </div>

            </div>

            <hr className="border-orange-850/50 my-8" />

            {/* Copyright line */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-orange-200/70 font-medium">
              <p>&copy; {new Date().getFullYear()} Gibson Empire Essentials. All rights reserved.</p>
              <p className="flex items-center gap-1.5 bg-orange-950/20 px-3 py-1.5 rounded-lg text-white">
                Designed with Affection & Premium Family Care
              </p>
            </div>
          </div>
        </footer>
      )}

      {/* Interactive Compliance legal modal */}
      {legalModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-250">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 flex flex-col animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-50 bg-[#ca4c1b] text-white">
              <div className="flex items-center gap-2.5">
                {legalModal === 'privacy' && <Shield className="w-5 h-5 text-white" />}
                {legalModal === 'terms' && <FileText className="w-5 h-5 text-white" />}
                {legalModal === 'cookies' && <Cookie className="w-5 h-5 text-white" />}
                
                <h3 className="font-extrabold text-sm md:text-md uppercase tracking-wider">
                  {legalModal === 'privacy' && 'Privacy Policy'}
                  {legalModal === 'terms' && 'Terms of Service'}
                  {legalModal === 'cookies' && 'Cookie Settings'}
                </h3>
              </div>
              <button 
                onClick={() => setLegalModal(null)}
                className="p-1 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh] text-xs md:text-sm text-gray-600 leading-relaxed space-y-4">
              {legalModal === 'privacy' && (
                <>
                  <p className="font-bold text-gray-900">Last updated: June 2026</p>
                  <p>
                    At Gibson Empire Essentials, your family's privacy and skin comfort is our absolute priority. We collect only necessary user data to safely process and manage your premium baby care orders. This consists of your delivery addresses, name details, contact emails, and phone channels.
                  </p>
                  <p>
                    We protect all account records using modern encryption methods, and we never rent or provide family databases to third party agencies.
                  </p>
                  <p>
                    Feel free to contact us at <strong>gibsonempireessentials@gmail.com</strong> if you wish to review, update, or safely request deletion of any of your details.
                  </p>
                </>
              )}
              
              {legalModal === 'terms' && (
                <>
                  <p className="font-bold text-gray-900">Last updated: June 2026</p>
                  <p>
                    By visiting and conducting purchases on the Gibson Empire Essentials catalog, you agree to comply with our commercial terms:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 mt-2">
                    <li>All pricing listed is presented in Nigerian Naira (₦).</li>
                    <li>Nursery and baby clothes stocks are updated in real-time, subject to material availability.</li>
                    <li>Replacements for standard package orders are fully eligible for processing within 7 days.</li>
                    <li>Copying assets or branding photos of our catalog constitutes copyright infringement.</li>
                  </ul>
                </>
              )}

              {legalModal === 'cookies' && (
                <>
                  <p className="font-bold text-gray-900">Usage of Cookies</p>
                  <p>
                    We use cookies and web key-value caches to maintain your shopping cart items, preserve your active sessions, and personalize your experience. No confidential identity records are tracked.
                  </p>
                  <p className="mt-2 text-[11px] text-gray-400">
                    Your choice is completely saved locally. Clear cache at any time to resets.
                  </p>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setLegalModal(null)}
                className="bg-primary hover:bg-[#b83d14] text-white font-bold px-5 py-2.5 rounded-xl text-xs transition"
              >
                Acknowledge
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-6 flex justify-between items-center md:hidden z-50">
        {isCorporateMode ? (
          <>
            <button 
              onClick={() => handleScrollTo('home')} 
              className={`flex flex-col items-center gap-1 focus:outline-none transition-colors ${activeSection === 'home' ? 'text-primary font-bold' : 'text-gray-400'}`}
            >
              <Home className="w-6 h-6" />
              <span className="text-[10px] font-medium">Home</span>
            </button>
            <button 
              onClick={() => handleScrollTo('about')} 
              className={`flex flex-col items-center gap-1 focus:outline-none transition-colors ${activeSection === 'about' ? 'text-primary font-bold' : 'text-gray-400'}`}
            >
              <Info className="w-6 h-6" />
              <span className="text-[10px] font-medium">About</span>
            </button>
            <Link 
              to="/store" 
              onClick={() => {
                localStorage.setItem('hasSeenLanding', 'true');
                localStorage.removeItem('overrideLanding');
              }}
              className="flex flex-col items-center gap-1 text-[#ca4c1b] font-bold"
            >
              <ShoppingBag className="w-6 h-6 stroke-[2.5]" />
              <span className="text-[10px] font-bold">Shop Now</span>
            </Link>
            <button 
              onClick={() => handleScrollTo('contact')} 
              className={`flex flex-col items-center gap-1 focus:outline-none transition-colors ${activeSection === 'contact' ? 'text-primary font-bold' : 'text-gray-400'}`}
            >
              <Phone className="w-6 h-6" />
              <span className="text-[10px] font-medium">Contact</span>
            </button>
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
