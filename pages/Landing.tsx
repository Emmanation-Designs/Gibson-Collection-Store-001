import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product, CATEGORY_CONFIG, CATEGORY_IMAGES } from '../types';
import { useToast } from '../store/useToast';
import { 
  ArrowRight, 
  Sparkles, 
  Heart, 
  ShieldCheck, 
  Truck, 
  ThumbsUp, 
  Star, 
  Mail, 
  Loader2,
  ChevronRight,
  ShoppingBag
} from 'lucide-react';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [email, setEmail] = useState('');
  const [submittingNewsletter, setSubmittingNewsletter] = useState(false);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .limit(4);
        if (error) throw error;
        setBestSellers(data || []);
      } catch (err) {
        console.error('Error loading best sellers on landing:', err);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchBestSellers();
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('Please enter a valid email address.', 'error');
      return;
    }

    setSubmittingNewsletter(true);
    setTimeout(() => {
      addToast('Thank you for subscribing to our premium newsletter!', 'success');
      setEmail('');
      setSubmittingNewsletter(false);
    }, 1000);
  };

  const whyChooseUs = [
    {
      icon: Heart,
      title: 'Gentle & Hypoallergenic',
      desc: 'All baby item selections are extensively vetted and made of organic materials pure enough for newborns.'
    },
    {
      icon: ShieldCheck,
      title: 'Certified Child Safety First',
      desc: 'Every product in our collection meets rigorous security checks and global nursery specifications.'
    },
    {
      icon: Truck,
      title: 'Swift & Loving Care Delivery',
      desc: 'We package with secure wrapping and deliver to your doorstep with incredible care and quick turnaround.'
    },
    {
      icon: ThumbsUp,
      title: 'Premium Quality Guarantee',
      desc: 'If you or your baby are not entirely content with the choice, our client care is ready to assist.'
    }
  ];

  const testimonials = [
    {
      name: 'Adewale K.',
      role: 'Mother of 3-month-old',
      text: 'The Diapering & Daily Care essentials from Gibson Empire changed my baby care routine. Super soft, highly breathable, and zero rashes! Fully recommended.',
      rating: 5
    },
    {
      name: 'Chinyere O.',
      role: 'New Mom',
      text: 'Exquisite clothing styles! The fabrics feel ultra-premium and look absolutely adorable. I always get questions about where I shop for my little angel.',
      rating: 5
    },
    {
      name: 'Halima S.',
      role: 'Dedicated Aunt',
      text: 'Excellent service. I purchased nursery accessories as a gift. The packaging was lovely and delivery was extremely fast. Thank you!',
      rating: 5
    }
  ];

  return (
    <div className="space-y-24 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative rounded-3xl overflow-hidden bg-primary shadow-xl min-h-[60vh] md:min-h-[70vh] flex items-center">
        {/* Modern Premium Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#ca4c1b] via-[#ea580c] to-[#121d45] z-0"></div>
        
        {/* Soft Pink and Blue Ambient Lights */}
        <div className="absolute -top-10 -right-10 w-96 h-96 bg-rose-400/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-orange-300/20 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full p-8 md:p-16 gap-8">
          {/* Hero Content text */}
          <div className="max-w-2xl text-center md:text-left space-y-6 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-orange-50 text-xs font-semibold tracking-wide uppercase backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              Welcome to Pure Luxury
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black leading-tight text-white tracking-tight">
              Gentle Care for <br />
              <span className="text-orange-200">Your Precious One</span>
            </h1>
            
            <p className="text-orange-50/90 text-lg md:text-xl leading-relaxed font-light max-w-lg mx-auto md:mx-0">
               Surround your baby in absolute luxury and natural comfort. Our collections offer unmatched excellence in daily care, premium diapering, and soft organic clothing.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
              <Link 
                to="/store"
                className="bg-white text-[#ca4c1b] px-8 py-4 rounded-full font-extrabold hover:bg-orange-50 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 text-md"
              >
                Shop Now <ArrowRight className="w-5 h-5 text-[#ca4c1b]" />
              </Link>
              <Link 
                to="/about"
                className="px-8 py-4 rounded-full font-semibold text-white border border-white/30 hover:bg-white/10 transition flex items-center justify-center text-md"
              >
                Our Legacy Story
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="flex-1 flex justify-center md:justify-end">
            <div className="relative">
              <img 
                src="/hero.png" 
                alt="Gentle Premium Care" 
                className="max-h-[350px] md:max-h-[480px] w-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700 ease-out origin-bottom"
                onError={(e) => {
                  // Fallback if image doesn't exist
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED CATEGORIES SECTION */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[#10b981] text-xs font-bold uppercase tracking-wider">Curated Collections</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Shop by Category</h2>
          <p className="text-gray-500 font-medium">Explore parent favorites thoughtfully designed to elevate your baby's comfort and styling.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {CATEGORY_CONFIG.map((cat) => (
            <div 
              key={cat.name} 
              onClick={() => navigate(`/store?category=${encodeURIComponent(cat.name)}`)}
              className="group relative h-48 md:h-64 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col justify-end"
            >
              <img 
                src={CATEGORY_IMAGES[cat.name] || cat.image} 
                alt={cat.name} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=1200';
                }}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 flex flex-col justify-end text-white z-10 h-3/4">
                <h3 className="text-sm md:text-md font-bold text-white mb-1 group-hover:text-blue-300 transition-colors line-clamp-2 leading-snug">
                  {cat.name}
                </h3>
                <span className="text-[10px] font-semibold text-gray-200 flex items-center gap-0.5">
                  Discover <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. BEST SELLERS SECTION */}
      <section className="space-y-8 bg-white py-12 px-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[#10b981] text-xs font-bold uppercase tracking-wider">Customer Favorites</span>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Best Sellers</h2>
            <p className="text-gray-500 font-medium">Top-rated items loved by parents and trusted for supreme comfort.</p>
          </div>
          <Link 
            to="/store"
            className="inline-flex items-center gap-2 text-primary hover:text-blue-800 font-bold group-hover:translate-x-1 transition-transform self-start"
          >
            Explore All Store <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingProducts ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : bestSellers.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {bestSellers.map((product) => (
              <div 
                key={product.id} 
                onClick={() => navigate(`/product/${product.id}`)}
                className="bg-[#f8fafc] rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-50 flex flex-col h-full group"
              >
                <div className="relative aspect-square w-full bg-gray-100 overflow-hidden flex-shrink-0">
                  <img 
                    src={product.image_urls?.[0]} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=400';
                    }}
                  />
                  {product.discount && product.discount > 0 ? (
                    <span className="absolute top-2.5 left-2.5 bg-red-500 text-white text-[10px] font-black uppercase px-2 py-1 rounded-md tracking-wider">
                      -{product.discount}% OFF
                    </span>
                  ) : null}
                </div>
                
                <div className="p-4 flex flex-col flex-grow justify-between gap-2 bg-white">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                      {product.category}
                    </span>
                    <h4 className="font-semibold text-gray-800 text-sm md:text-base line-clamp-1 group-hover:text-primary transition-colors">
                      {product.name}
                    </h4>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-md font-black text-[#ca4c1b]">
                      ₦{product.price.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-primary flex items-center gap-1 group-hover:underline">
                      Buy <ShoppingBag className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-2xl font-medium">
            No products are currently in stock. Check back very soon or click browse!
          </div>
        )}
      </section>

      {/* 4. WHY CHOOSE US (OUR CORE PILLARS) */}
      <section className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[#10b981] text-xs font-bold uppercase tracking-wider">Our Brand Promise</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">The Gibson Essentials Promise</h2>
          <p className="text-gray-500 font-medium tracking-wide">Crafted deliberately without compromise, guaranteeing pure security and daily comfort.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {whyChooseUs.map((pillar, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center space-y-4 hover:shadow-md transition">
              <div className="w-12 h-12 bg-orange-50 text-primary rounded-full flex items-center justify-center">
                <pillar.icon className="w-6 h-6 text-[#ca4c1b]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{pillar.title}</h3>
              <p className="text-xs text-gray-500 tracking-wide leading-relaxed font-medium">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. GENTLE STORIES / OUR HERO WORK */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-[#ca4c1b]/5 rounded-3xl p-8 md:p-16 border border-[#ca4c1b]/10">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ca4c1b]/10 text-primary text-xs font-bold tracking-wider uppercase">
            Our Loving Story
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
            Designed for Pure Comfort and Absolute Safety
          </h2>
          <p className="text-gray-600 font-medium leading-relaxed">
            Gibson Empire Essentials was born out of a simple, beautiful passion: to provide parents of newborns with luxury child care solutions without any compromise. Every fabric choice, diaper selection, and baby accessory is thoroughly tested for performance and softness.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center">
                <Star className="w-3.5 h-3.5 fill-current" />
              </div>
              <span className="text-sm font-bold text-gray-700">Recommended by pediatricians</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center">
                <Star className="w-3.5 h-3.5 fill-current" />
              </div>
              <span className="text-sm font-bold text-gray-700">100% hypoallergenic organic clothing</span>
            </div>
          </div>
          <div className="pt-2">
            <Link 
              to="/about"
              className="bg-primary hover:bg-blue-800 text-white px-6 py-3 rounded-full font-bold shadow-md transition inline-flex items-center gap-2"
            >
              Read Full Mission <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <div className="relative rounded-2xl overflow-hidden h-[450px] bg-white flex items-center justify-center p-12 border border-gray-100">
          <img 
            src="/logo.png" 
            alt="Gibson Mommy Baby Care" 
            className="w-full h-full object-contain" 
          />
          <div className="absolute inset-0 bg-[#ca4c1b]/5 pointer-events-none"></div>
        </div>
      </section>

      {/* 6. TESTIMONIALS SECTION */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[#10b981] text-xs font-bold uppercase tracking-wider">Parent Stories</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Beloved by Modern Parents</h2>
          <p className="text-gray-500 font-medium">Read genuine heartwarming feedback from parents who trust Gibson Empire Essentials daily.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between gap-6 hover:shadow-md transition">
              <div className="space-y-4">
                <div className="flex text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">"{t.text}"</p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">{t.name}</h4>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-0.5">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
