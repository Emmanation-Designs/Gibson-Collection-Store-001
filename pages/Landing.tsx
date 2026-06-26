import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Star, 
  Award, 
  CheckCircle2, 
  Mail,
  Phone,
  MapPin,
  ShoppingBag
} from 'lucide-react';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  // Scroll to hash on mount if present
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  }, []);

  const premiumReviews = [
    {
      name: 'Adewale K.',
      role: 'Mother of 3-month-old',
      text: 'The Diapering & Daily Care essentials from Gibson Empire changed my baby care routine. Super soft, highly breathable, and zero rashes! Fully recommended.',
      rating: 5,
      location: 'Lagos'
    },
    {
      name: 'Chinyere O.',
      role: 'New Mom',
      text: 'Exquisite clothing styles! The fabrics feel ultra-premium and look absolutely adorable. I always get questions about where I shop for my little angel.',
      rating: 5,
      location: 'Abuja'
    },
    {
      name: 'Halima S.',
      role: 'Dedicated Aunt',
      text: 'Excellent service. I purchased nursery accessories as a gift. The packaging was lovely and delivery was extremely fast. Thank you!',
      rating: 5,
      location: 'Port Harcourt'
    }
  ];

  const brandValues = [
    {
      icon: ShieldCheck,
      title: 'Pediatric Safety Standards',
      desc: 'Absolutely free of formaldehydes, toxic dyes, and rough fibers. Exceeding safety benchmarks to protect delicate skin.'
    },
    {
      icon: Award,
      title: 'Certified Pure Organic',
      desc: 'Dermatologically vetted, skin-safe organic materials carefully woven for premium softness.'
    },
    {
      icon: Sparkles,
      title: 'Designed with Affection',
      desc: 'Each baby essential combines high performance with absolute comfort, supporting every developmental milestone.'
    }
  ];

  return (
    <div className="space-y-24 md:space-y-36 pb-24 font-sans bg-[#faf9f6] text-stone-900 overflow-x-hidden">
      
      {/* 1. HOME SECTION (High-end Hero Section) */}
      <section id="home" className="relative px-4 pt-4 scroll-mt-24">
        <div className="max-w-7xl mx-auto rounded-[3rem] overflow-hidden bg-white border border-stone-200/40 shadow-2xl relative min-h-[75vh] flex items-center">
          
          {/* Elegant background gradients */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#faf8f5] via-white to-[#f7f3eb]"></div>
          <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-[#ca4c1b]/[0.03] rounded-full blur-[130px] -translate-y-1/4 translate-x-1/4 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-100/10 rounded-full blur-[110px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

          {/* Inner border line */}
          <div className="absolute top-8 left-8 right-8 bottom-8 border border-stone-100/80 pointer-events-none rounded-[2.5rem] hidden md:block"></div>
          
          <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 py-16 px-6 md:p-16 lg:p-24 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-[#ca4c1b] text-[10px] font-black tracking-widest uppercase shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>The Ultimate Nursery Luxury</span>
              </div>
              
              <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-stone-900 leading-[1.05]">
                Softness to nurture <br />
                <span className="font-serif italic font-light text-[#ca4c1b] tracking-normal">their dreams</span>
              </h1>
              
              <p className="text-stone-500 text-sm md:text-base leading-relaxed font-normal max-w-xl mx-auto lg:mx-0">
                Surround your little one with dermatologist-approved, certified pure organic cotton and premium nursery essentials. Tailored with meticulous care and clinical safety.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                <Link 
                  to="/store"
                  className="bg-[#ca4c1b] hover:bg-[#b83d14] text-white px-9 py-4.5 rounded-full font-extrabold text-xs tracking-wider uppercase transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2.5"
                >
                  Explore The Boutique <ArrowRight className="w-4 h-4" />
                </Link>
                <button 
                  onClick={() => {
                    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-stone-50 hover:bg-stone-100 text-stone-850 border border-stone-200/80 px-9 py-4.5 rounded-full font-bold text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center cursor-pointer"
                >
                  Our Quality Standards
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 pt-8 border-t border-stone-200/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-stone-800 uppercase tracking-widest block leading-none">OEKO-TEX</span>
                    <span className="text-[9px] font-bold text-stone-400 block mt-0.5">100% Certified</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-[#ca4c1b] shadow-xs">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-stone-800 uppercase tracking-widest block leading-none">Hypoallergenic</span>
                    <span className="text-[9px] font-bold text-stone-400 block mt-0.5">Pediatric Vetted</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end w-full">
              <div className="relative max-w-sm w-full">
                {/* Visual Backdrop Layer */}
                <div className="absolute inset-0 bg-[#eae1d4]/30 rounded-[3.5rem] transform rotate-3 scale-95 opacity-50 z-0"></div>
                <div className="absolute inset-0 bg-stone-100 rounded-[3.5rem] transform -rotate-3 scale-[0.98] opacity-60 z-0"></div>
                
                <div className="relative z-10 bg-white rounded-[3.5rem] p-8 border border-stone-200/40 shadow-xl flex items-center justify-center overflow-hidden group">
                  <img 
                    src="/hero.png" 
                    alt="Premium Baby Care" 
                    className="max-h-[300px] md:max-h-[380px] w-auto object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  {/* Floating Luxury Tag */}
                  <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-stone-100/60 flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                    <span className="text-[10px] font-extrabold text-stone-850 uppercase tracking-wider">Premium Safe</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. ABOUT US SECTION (Highly Polished & Editorial) */}
      <section id="about" className="max-w-7xl mx-auto px-4 scroll-mt-24">
        <div className="bg-white rounded-[3rem] border border-stone-200/40 p-8 md:p-16 lg:p-20 shadow-xl relative overflow-hidden space-y-16">
          <div className="absolute top-0 left-0 w-84 h-84 bg-orange-50/10 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column: Core Narrative */}
            <div className="space-y-6">
              <span className="text-[#ca4c1b] text-xs font-black uppercase tracking-widest block font-sans">Our Heritage & Mission</span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-stone-900 tracking-tight leading-none">
                Pure Affection. <br />
                <span className="font-serif italic font-light text-[#ca4c1b] tracking-normal">Scientific Rigor.</span>
              </h2>
              <p className="text-stone-600 text-sm md:text-base leading-relaxed font-medium">
                Gibson Empire Essentials was born out of a simple, beautiful passion: to provide parents of newborns with luxury childcare solutions without any compromise. Every fabric choice, diaper selection, and baby accessory is thoroughly tested for performance and safety.
              </p>
              <p className="text-stone-500 text-xs md:text-sm leading-relaxed font-normal">
                We believe in architectural honesty and pediatric safety. We do not use harsh chemicals or toxic dyes. Instead, we harvest certified GOTS cotton and bamboo to foster absolute tranquility in your baby's daily milestones.
              </p>

              {/* Signature quote or metric */}
              <div className="border-l-4 border-[#ca4c1b] pl-4 py-1 italic text-stone-700 font-serif text-lg">
                "Surrounding your little ones with comfort that feels just like a mother's gentle hold."
              </div>
            </div>

            {/* Right Column: Premium Visual Logo Showcase */}
            <div className="relative rounded-[2rem] overflow-hidden h-80 md:h-96 bg-[#fbf9f6] flex items-center justify-center p-12 border border-stone-200/40 shadow-inner group">
              <img 
                src="/logo.png" 
                alt="Gibson Empire Logo" 
                className="w-44 h-44 object-contain opacity-90 transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-[#ca4c1b]/[0.01] pointer-events-none"></div>
              <div className="absolute inset-4 border border-stone-150 pointer-events-none rounded-[1.5rem]"></div>
            </div>
          </div>

          {/* Pillars row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-stone-200/60">
            {brandValues.map((value, idx) => (
              <div key={idx} className="space-y-3 p-6 rounded-2xl bg-[#faf9f6]/60 border border-stone-150/40 hover:bg-white hover:shadow-md transition-all duration-300">
                <div className="w-10 h-10 bg-[#ca4c1b]/5 border border-orange-100 text-[#ca4c1b] rounded-xl flex items-center justify-center shadow-xs">
                  <value.icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black text-stone-900 tracking-tight">{value.title}</h3>
                <p className="text-xs text-stone-500 leading-relaxed font-medium">{value.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. TESTIMONIALS SECTION (Warm, High-Contrast layout) */}
      <section id="testimonials" className="max-w-7xl mx-auto px-4 scroll-mt-24">
        <div className="space-y-16">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-[#ca4c1b] text-xs font-black uppercase tracking-widest block font-sans">Trusted Testimonials</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-stone-900 tracking-tight leading-none">
              Loved By <span className="font-serif italic font-light text-[#ca4c1b] tracking-normal">Modern Parents</span>
            </h2>
            <p className="text-stone-500 text-xs md:text-sm font-medium">
              Read heartfelt, genuine reviews from real families who rely on our daily safety standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {premiumReviews.map((t, idx) => (
              <div 
                key={idx} 
                className="bg-white p-8 rounded-[2.5rem] border border-stone-200/30 shadow-sm flex flex-col justify-between gap-8 hover:shadow-md hover:border-orange-100/30 transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex text-amber-400 gap-0.5">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current stroke-1" />
                    ))}
                  </div>
                  <p className="text-stone-600 text-xs md:text-sm leading-relaxed font-medium italic">
                    "{t.text}"
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                  <div>
                    <h4 className="font-bold text-stone-900 text-xs md:text-sm">{t.name}</h4>
                    <p className="text-[9px] text-stone-400 font-extrabold uppercase tracking-widest mt-0.5">{t.role}</p>
                  </div>
                  <span className="text-[10px] text-stone-400 font-extrabold uppercase tracking-widest">{t.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PRE-FOOTER CALL TO ACTION (The elegant shop prompt) */}
      <section id="contact" className="max-w-7xl mx-auto px-4 scroll-mt-24">
        <div className="relative rounded-[3rem] overflow-hidden bg-white border border-stone-200/40 shadow-xl p-8 md:p-16 text-center space-y-8">
          <div className="absolute inset-0 bg-gradient-to-br from-[#faf8f5] via-white to-[#fdfbf9] z-0"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#ca4c1b]/[0.02] rounded-full blur-[90px] pointer-events-none"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="text-[#ca4c1b] text-xs font-black uppercase tracking-widest block">Start Your Journey</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-stone-900 tracking-tight leading-none">
              Ready to Discover <br />
              <span className="font-serif italic font-light text-[#ca4c1b] tracking-normal">Absolute Nursery Comfort?</span>
            </h2>
            <p className="text-stone-500 text-xs md:text-sm font-medium leading-relaxed max-w-lg mx-auto">
              Visit our boutique store to purchase premium diapers, baby essentials, beautiful apparel, and nursery accessories heavily vetted by parents worldwide.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/store"
                className="bg-[#ca4c1b] hover:bg-[#b83d14] text-white px-9 py-4 rounded-full font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 shrink-0"
              >
                Shop Our Collection <ShoppingBag className="w-4 h-4" />
              </Link>
              <a 
                href="https://wa.me/2348033464218" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white hover:bg-stone-50 text-stone-850 border border-stone-200 px-9 py-4 rounded-full font-bold text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2"
              >
                Contact via WhatsApp <Phone className="w-4 h-4 text-emerald-500 fill-emerald-500" />
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
