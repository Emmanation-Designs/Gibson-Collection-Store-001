import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Users, Star, Award, ChevronRight } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Banner / Header */}
      <section className="relative rounded-3xl overflow-hidden bg-primary shadow-lg min-h-[35vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e40af] via-[#1e3a8a] to-[#121d45] z-0"></div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-400/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="relative z-10 p-8 md:p-16 max-w-2xl text-white space-y-4">
          <span className="text-[#60a5fa] text-xs font-bold uppercase tracking-widest block">Our Heritage</span>
          <h1 className="text-4xl font-extrabold tracking-tight">Our Story & Commitment</h1>
          <p className="text-blue-100 font-light leading-relaxed text-md md:text-lg">
            Dedicated to pure fabric materials, rigorous organic safety tests, and ultimate baby luxury since inception.
          </p>
        </div>
      </section>

      {/* Core Narrative / Introduction */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Crafted by Loving Parents, For Modern Families</h2>
          <p className="text-gray-600 font-medium leading-relaxed text-sm md:text-base">
            At Gibson Empire Essentials, we believe every child deserves the softest touch and the safest care. We started with a clear vision: to design and deliver premium daily baby care and organic apparel options that combine absolute comfort with modern design.
          </p>
          <p className="text-gray-600 font-medium leading-relaxed text-sm md:text-base">
            Each item in our catalog goes through comprehensive pediatric material inspections and durability checks. From hypoallergenic diapers to buttery soft organic clothes, everything is thoughtfully selected to fit your baby’s sensitive skin, making every precious milestone comfortable.
          </p>
          <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            <div>
              <h4 className="text-3xl font-black text-[#1e40af]">100%</h4>
              <p className="text-xs text-gray-500 font-bold uppercase mt-1">Hypoallergenic Fabrics</p>
            </div>
            <div>
              <h4 className="text-3xl font-black text-[#1e40af]">15k+</h4>
              <p className="text-xs text-gray-500 font-bold uppercase mt-1">Happy Parents Served</p>
            </div>
          </div>
        </div>
        <div className="relative rounded-2xl overflow-hidden shadow-md h-96">
          <img 
            src="https://images.unsplash.com/photo-1515488042361-404e9250afef?q=80&w=800" 
            alt="Gibson Empire Essentials Story" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#1e40af]/10"></div>
        </div>
      </section>

      {/* Values & Standards */}
      <section className="bg-white py-12 px-6 rounded-3xl border border-gray-100 shadow-sm space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[#10b981] text-xs font-bold uppercase">Our Values</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">What Guides Us Daily</h2>
          <p className="text-gray-500 text-sm font-medium">Underpinning our selections are strict standards of corporate safety and family affection.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="w-10 h-10 bg-blue-50 text-primary rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#1e40af]" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">1. Certified Safety</h3>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              We never comprise on baby skin protection. We check and filter our supplies carefully against harmful synthetics.
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">2. Meticulous Craftsmanship</h3>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              Precision stitching, tagless labels, and super stretchable fits. Every design detail focuses strictly on maximum comfort.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">3. Loving Community</h3>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              We support parents unconditionally, offering rapid product advice and customized choices to ensure happy childhood growth.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action bar */}
      <section className="bg-[#1e40af] text-white rounded-3xl p-8 md:p-12 text-center space-y-6">
        <h2 className="text-2xl md:text-3xl font-extrabold">Ready to Discover Absolute Comfort?</h2>
        <p className="text-blue-100 max-w-lg mx-auto font-light text-sm md:text-base">
          Browse through our premium catalogs including Diapering, Feeding, luxury baby garments, and accessories!
        </p>
        <div>
          <Link 
            to="/store"
            className="bg-white text-[#1e40af] px-8 py-3.5 rounded-full font-extrabold hover:bg-blue-50 transition shadow-md hover:-translate-y-0.5 inline-flex items-center gap-2"
          >
            Go To Full Store <ChevronRight className="w-4 h-4 text-[#1e40af]" />
          </Link>
        </div>
      </section>

    </div>
  );
};
