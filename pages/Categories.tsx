
import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORY_CONFIG } from '../types';
import { ArrowLeft } from 'lucide-react';

export const Categories: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="flex items-center gap-2 mb-6">
        <Link 
          to="/" 
          className="p-2 hover:bg-gray-100 rounded-full transition"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Shop by Category</h1>
      </div>

      <div className="space-y-6">
        {CATEGORY_CONFIG.map((category) => (
          <Link
            key={category.name}
            to={`/?category=${encodeURIComponent(category.name)}`}
            className="block relative w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
          >
            <img 
              src={category.image} 
              alt={category.name}
              className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
              loading="lazy"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            {/* Text Content */}
            <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-blue-100 transition">
                {category.name}
              </h2>
              <span className="inline-flex items-center gap-2 text-white/90 text-sm font-medium bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full group-hover:bg-white group-hover:text-primary transition">
                Explore Collection
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
