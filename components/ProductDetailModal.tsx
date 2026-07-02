
import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../store/useStore';
import { useToast } from '../store/useToast';
import { X, ShoppingCart, Check, Heart, ShieldCheck, Truck, Ruler } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const { addToast } = useToast();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.colors && product.colors.length > 0 ? product.colors[0] : undefined
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const getInitialGuideTab = (): string => {
    if (product.category === 'Clothing & Accessories' || product.category === 'Adult Wears') {
      return 'Clothing';
    }
    if (product.category === 'Diapering & Daily Care') {
      return 'Baby/Diapers';
    }
    if (product.sizes && product.sizes.some(s => ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'].includes(s))) {
      return 'Clothing';
    }
    if (product.sizes && product.sizes.some(s => !isNaN(Number(s)))) {
      return 'Shoes';
    }
    if (product.sizes && product.sizes.some(s => s.toLowerCase().includes('size') || s.toLowerCase().includes('newborn'))) {
      return 'Baby/Diapers';
    }
    return 'General';
  };

  const [activeTab, setActiveTab] = useState<string>(getInitialGuideTab());

  const images = product.image_urls && product.image_urls.length > 0 
    ? product.image_urls 
    : [`/logo.png`];

  const hasDiscount = product.discount && product.discount > 0;
  const finalPrice = hasDiscount 
    ? product.price * (1 - product.discount! / 100) 
    : product.price;

  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedColor, selectedSize);
    addToast(`${product.name} added to cart!`, 'success');
    onClose();
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product.id);
    if (!isWishlisted) {
      addToast("Added to wishlist", "success");
    } else {
      addToast("Removed from wishlist", "info");
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="bg-white w-full md:w-full max-w-5xl max-h-[90vh] md:h-auto md:max-h-[85vh] rounded-2xl shadow-2xl relative flex flex-col md:flex-row z-10 animate-in zoom-in-95 duration-200 overflow-y-auto md:overflow-hidden">
        
        {/* Close Button */}
        <div className="absolute top-4 right-4 z-20">
          <button 
            onClick={onClose}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-gray-100 transition shadow-sm border border-gray-100"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Left Side: Images */}
        <div className="w-full md:w-1/2 bg-gray-50 flex flex-col flex-shrink-0">
          {/* Main Image */}
          <div className="relative h-72 sm:h-80 md:h-96 w-full flex-shrink-0 bg-gray-50">
            <img 
              src={images[selectedImageIndex]} 
              alt={product.name} 
              className="w-full h-full object-contain md:object-cover mix-blend-multiply md:mix-blend-normal"
            />
            {hasDiscount && (
              <div className="absolute top-4 left-4 bg-red-600 text-white font-bold px-3 py-1 rounded-full shadow-lg">
                -{product.discount}% OFF
              </div>
            )}
          </div>
          
          {/* Thumbnails */}
          <div className="p-4 flex gap-2 overflow-x-auto no-scrollbar justify-center bg-white border-t border-gray-100 min-h-[100px]">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`w-16 h-16 rounded-lg border-2 overflow-hidden flex-shrink-0 transition ${
                  selectedImageIndex === idx ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-gray-200'
                }`}
              >
                <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Info */}
        <div className="w-full md:w-1/2 flex flex-col bg-white md:h-full md:overflow-y-auto">
          <div className="p-6 md:p-8 flex flex-col h-full relative">
            {/* Header */}
            <div className="mb-4 pr-8">
              <span className="text-sm font-medium text-primary bg-blue-50 px-2 py-1 rounded-md mb-2 inline-block">
                {product.category}
              </span>
              <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-2">
                {product.name}
              </h2>
              
              {/* Price Block */}
              <div className="flex items-baseline gap-3 mt-3">
                <span className={`text-3xl font-bold ${hasDiscount ? 'text-red-600' : 'text-gray-900'}`}>
                  ₦{finalPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
                {hasDiscount && (
                  <span className="text-lg text-gray-400 line-through decoration-gray-400">
                    ₦{product.price.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            <hr className="border-gray-100 mb-6" />

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center justify-between">
                  Select Color
                  <span className="text-primary font-normal">{selectedColor}</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-full border transition flex items-center gap-2 cursor-pointer ${
                        selectedColor === color 
                          ? 'border-primary bg-blue-50 text-primary font-medium ring-1 ring-primary' 
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {selectedColor === color && <Check className="w-3 h-3" />}
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    Select Size
                    {selectedSize && <span className="text-[#ca4c1b] font-bold">({selectedSize})</span>}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-[#ca4c1b] hover:text-[#b83d14] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer bg-amber-50/50 hover:bg-amber-100/60 px-3 py-1.5 rounded-xl border border-amber-100"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Size Guide</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[3.5rem] h-11 px-4 rounded-xl border text-xs font-bold tracking-wider transition-all cursor-pointer flex items-center justify-center ${
                        selectedSize === size
                          ? 'border-[#ca4c1b] bg-amber-50/40 text-[#ca4c1b] font-bold shadow-xs ring-1 ring-[#ca4c1b]'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 bg-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {!selectedSize && (
                  <p className="text-[11px] text-[#ca4c1b] font-medium mt-2">
                    * Please select a size to add to cart
                  </p>
                )}
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
                <Truck className="w-4 h-4 text-green-600" />
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Quality Guarantee</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8 flex-grow">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                {product.description}
              </p>
            </div>

            {/* Action Buttons - Sticky on mobile */}
            <div className="mt-auto pt-4 border-t border-gray-100 grid grid-cols-[auto_1fr] gap-4 sticky bottom-0 bg-white pb-2 md:static md:pb-0 z-10">
              <button 
                onClick={handleToggleWishlist}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-1 transition w-20 ${
                  isWishlisted 
                    ? 'border-red-200 bg-red-50 text-red-500' 
                    : 'border-gray-200 text-gray-400 hover:bg-gray-50'
                }`}
              >
                <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
                <span className="text-[10px] font-medium">Save</span>
              </button>
              
              <button 
                onClick={handleAddToCart}
                disabled={
                  (product.colors && product.colors.length > 0 && !selectedColor) || 
                  (product.sizes && product.sizes.length > 0 && !selectedSize)
                }
                className="bg-primary hover:bg-blue-800 text-white rounded-xl font-bold text-lg shadow-xl shadow-blue-900/20 transition transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Size Guide Modal Overlay */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-3xl rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] shadow-2xl relative flex flex-col z-10 max-h-[92vh] md:max-h-[85vh] border border-stone-200/40 overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-6 md:p-8 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
              <div className="flex items-center gap-3">
                <div className="bg-amber-50 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border border-amber-100 shrink-0">
                  <Ruler className="w-4 h-4 sm:w-5 sm:h-5 text-[#ca4c1b]" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-stone-900 leading-tight">
                    Gibson Essentials Size Guide
                  </h3>
                  <p className="text-[10px] sm:text-xs text-stone-500 mt-0.5">Find your perfect fit with our comprehensive charts.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(false)}
                className="p-1.5 sm:p-2 hover:bg-stone-100 rounded-full transition-colors cursor-pointer font-bold shrink-0 ml-2"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-stone-500" />
              </button>
            </div>

            {/* Guide Tabs */}
            <div className="px-4 sm:px-6 md:px-8 pt-4 bg-stone-50/20 border-b border-stone-100 flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
              {['Clothing', 'Shoes', 'Baby/Diapers', 'General'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2.5 sm:py-3 px-3.5 sm:px-4 font-bold text-[11px] sm:text-xs uppercase tracking-wider transition-all border-b-2 relative whitespace-nowrap cursor-pointer ${
                    activeTab === tab
                      ? 'border-[#ca4c1b] text-[#ca4c1b]'
                      : 'border-transparent text-stone-400 hover:text-stone-600'
                  }`}
                >
                  {tab === 'Baby/Diapers' ? 'Baby & Diapers' : tab}
                </button>
              ))}
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 md:p-8 overflow-y-auto space-y-6 sm:space-y-8 flex-grow">
              
              {/* Illustration and Summary Column */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 sm:gap-6 items-center bg-stone-50 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-stone-200/50">
                <div className="md:col-span-2 flex justify-center py-2 md:py-0">
                  {activeTab === 'Clothing' && (
                    <svg viewBox="0 0 120 120" className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32">
                      {/* Elegant Torso Shape representing Human Body */}
                      <path 
                        d="M 60,18 C 55,18 52,23 52,28 C 52,32 40,36 32,45 C 28,50 26,62 26,75 L 34,75 C 34,68 36,55 42,52 L 44,105 L 76,105 L 78,52 C 84,55 86,68 86,75 L 94,75 C 94,62 92,50 88,45 C 80,36 68,32 68,28 C 68,23 65,18 60,18 Z" 
                        fill="#f5f5f4" 
                        stroke="#44403c" 
                        strokeWidth="1.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                      />
                      {/* Head representation for proportion */}
                      <circle cx="60" cy="10" r="6" fill="#f5f5f4" stroke="#44403c" strokeWidth="1.5" />
                      
                      {/* Chest/Bust measuring tape wrapping around body */}
                      <ellipse cx="60" cy="60" rx="20" ry="5" fill="none" stroke="#ca4c1b" strokeWidth="2" strokeDasharray="3,2" />
                      <path d="M 32,60 L 40,60 M 80,60 L 88,60" stroke="#ca4c1b" strokeWidth="1.5" />
                      <path d="M 32,60 L 36,57 M 32,60 L 36,63 M 88,60 L 84,57 M 88,60 L 84,63" stroke="#ca4c1b" strokeWidth="1.5" />
                      
                      {/* Shoulder width measuring tape */}
                      <path d="M 32,44 L 88,44" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="2,2" />
                      <circle cx="32" cy="44" r="2.5" fill="#0ea5e9" />
                      <circle cx="88" cy="44" r="2.5" fill="#0ea5e9" />

                      {/* Height length tape */}
                      <path d="M 50,44 L 50,105" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3,2" />
                      <path d="M 48,44 L 52,44 M 48,105 L 52,105" stroke="#10b981" strokeWidth="1.5" />
                      
                      {/* Clear Labels with background pill for high contrast readability */}
                      <g transform="translate(60, 60)">
                        <rect x="-16" y="-6" width="32" height="10" rx="3" fill="#ca4c1b" />
                        <text x="0" y="1" textAnchor="middle" fontSize="6.5" fill="#ffffff" fontWeight="bold">CHEST</text>
                      </g>
                      <g transform="translate(60, 39)">
                        <rect x="-24" y="-5" width="48" height="9" rx="3" fill="#0ea5e9" />
                        <text x="0" y="2" textAnchor="middle" fontSize="6" fill="#ffffff" fontWeight="bold">SHOULDER</text>
                      </g>
                      <g transform="translate(50, 80) rotate(-90)">
                        <rect x="-14" y="-5" width="28" height="9" rx="3" fill="#10b981" />
                        <text x="0" y="2" textAnchor="middle" fontSize="6" fill="#ffffff" fontWeight="bold">LENGTH</text>
                      </g>
                    </svg>
                  )}

                  {activeTab === 'Shoes' && (
                    <svg viewBox="0 0 120 120" className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32">
                      {/* Ground floor line */}
                      <line x1="15" y1="100" x2="105" y2="100" stroke="#d6d3d1" strokeWidth="2" strokeLinecap="round" />
                      
                      {/* Foot side-profile silhouette */}
                      <path 
                        d="M 52,22 
                           L 48,45 
                           C 45,55 33,65 30,78 
                           C 27,91 33,96 42,96 
                           C 52,93 68,93 88,96 
                           C 96,96 100,91 100,84 
                           C 100,77 94,73 89,71 
                           C 78,67 70,54 67,45 
                           L 64,22 Z" 
                        fill="#f5f5f4" 
                        stroke="#44403c" 
                        strokeWidth="1.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                      />
                      
                      {/* Vertical alignment guides */}
                      <line x1="30" y1="70" x2="30" y2="108" stroke="#ca4c1b" strokeWidth="1" strokeDasharray="2,2" />
                      <line x1="100" y1="80" x2="100" y2="108" stroke="#ca4c1b" strokeWidth="1" strokeDasharray="2,2" />
                      
                      {/* Measuring tape / Arrow under the foot */}
                      <path d="M 30,105 L 100,105" stroke="#ca4c1b" strokeWidth="1.5" />
                      <path d="M 30,105 L 34,102 M 30,105 L 34,108 M 100,105 L 96,102 M 100,105 L 96,108" stroke="#ca4c1b" strokeWidth="1.5" />
                      
                      {/* Contrast Label Pill */}
                      <g transform="translate(65, 105)">
                        <rect x="-24" y="-5" width="48" height="10" rx="3" fill="#ca4c1b" />
                        <text x="0" y="2" textAnchor="middle" fontSize="6" fill="#ffffff" fontWeight="bold">FOOT LENGTH</text>
                      </g>
                    </svg>
                  )}

                  {activeTab === 'Baby/Diapers' && (
                    <svg viewBox="0 0 120 120" className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32">
                      {/* Baby hip/diaper silhouette */}
                      <path 
                        d="M 35,30 
                           C 35,22 45,18 60,18 
                           C 75,18 85,22 85,30 
                           C 85,45 92,52 92,62 
                           C 92,72 82,85 60,85 
                           C 38,85 28,72 28,62 
                           C 28,52 35,45 35,30 Z" 
                        fill="#f5f5f4" 
                        stroke="#44403c" 
                        strokeWidth="1.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                      />
                      
                      {/* Diaper shape overlaid on baby hip */}
                      <path 
                        d="M 30,44 
                           C 42,48 78,48 90,44 
                           C 92,54 88,76 60,82 
                           C 32,76 28,54 30,44 Z" 
                        fill="#ffffff" 
                        stroke="#44403c" 
                        strokeWidth="1.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                      />
                      
                      {/* Diaper waist elastic band */}
                      <path d="M 31,48 L 89,48" stroke="#ca4c1b" strokeWidth="2" strokeDasharray="2,1" />
                      
                      {/* Leg leg-seal cuff elastic rings */}
                      <ellipse cx="45" cy="70" rx="10" ry="6" fill="none" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="2,1" />
                      <ellipse cx="75" cy="70" rx="10" ry="6" fill="none" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="2,1" />

                      {/* Labels and weights */}
                      <g transform="translate(60, 32)">
                        <rect x="-24" y="-5" width="48" height="9" rx="3.5" fill="#ca4c1b" />
                        <text x="0" y="2" textAnchor="middle" fontSize="5.5" fill="#ffffff" fontWeight="bold">WAIST SNUG</text>
                      </g>
                      
                      <g transform="translate(60, 70)">
                        <rect x="-24" y="-5" width="48" height="9" rx="3.5" fill="#0ea5e9" />
                        <text x="0" y="2" textAnchor="middle" fontSize="5.5" fill="#ffffff" fontWeight="bold">LEG CUFF</text>
                      </g>
                      
                      {/* Cute belly button */}
                      <circle cx="60" cy="28" r="1.5" fill="#44403c" />
                    </svg>
                  )}

                  {activeTab === 'General' && (
                    <svg viewBox="0 0 120 120" className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32">
                      {/* Elegant Full Body Silhouette */}
                      <path 
                        d="M 60,12 C 57,12 55,14 55,17 C 55,20 57,22 60,22 C 63,22 65,20 65,17 C 65,14 63,12 60,12 Z
                           M 60,23 C 58,23 57,24 57,26 L 57,29 C 52,31 46,34 43,40 C 40,46 41,60 41,70 L 45,70 C 45,62 45,52 48,46 L 49,98 L 57,98 L 59,65 L 61,65 L 63,98 L 71,98 L 72,46 C 75,52 75,62 75,70 L 79,70 C 79,60 80,46 77,40 C 74,34 68,31 63,29 L 63,26 C 63,24 62,23 60,23 Z" 
                        fill="#f5f5f4" 
                        stroke="#44403c" 
                        strokeWidth="1.2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                      />
                      
                      {/* Universal Fit Zone Indicators */}
                      <circle cx="60" cy="38" r="4" fill="none" stroke="#ca4c1b" strokeWidth="1.5" />
                      <line x1="48" y1="38" x2="72" y2="38" stroke="#ca4c1b" strokeWidth="1" strokeDasharray="2,2" />
                      
                      <circle cx="60" cy="48" r="4" fill="none" stroke="#0ea5e9" strokeWidth="1.5" />
                      <line x1="49" y1="48" x2="71" y2="48" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="2,2" />
                      
                      <circle cx="60" cy="58" r="4" fill="none" stroke="#10b981" strokeWidth="1.5" />
                      <line x1="50" y1="58" x2="70" y2="58" stroke="#10b981" strokeWidth="1" strokeDasharray="2,2" />

                      {/* Label Pill */}
                      <g transform="translate(60, 80)">
                        <rect x="-28" y="-5" width="56" height="10" rx="3.5" fill="#ca4c1b" />
                        <text x="0" y="2" textAnchor="middle" fontSize="5.5" fill="#ffffff" fontWeight="bold">ALL-BODY FIT</text>
                      </g>
                    </svg>
                  )}
                </div>
                
                <div className="md:col-span-3 space-y-3">
                  <h4 className="text-base font-black text-stone-900 flex items-center gap-2">
                    <span className="w-2 h-4 bg-[#ca4c1b] rounded-xs block"></span>
                    Step-by-Step Measurement Guide
                  </h4>
                  
                  <div className="text-xs text-stone-700 space-y-2.5 font-medium">
                    {activeTab === 'Clothing' && (
                      <ol className="list-decimal pl-4 space-y-1.5 leading-relaxed text-stone-800">
                        <li><strong className="text-stone-900 font-bold">Chest / Bust:</strong> Measure around the fullest part of your chest, keeping the tape horizontal and flat across your shoulder blades.</li>
                        <li><strong className="text-stone-900 font-bold">Shoulders:</strong> Measure from the outer edge of one shoulder bone straight across your back to the opposite shoulder bone.</li>
                        <li><strong className="text-stone-900 font-bold">Total Length:</strong> Measure from the highest point of your shoulder (at the collar base) straight down to the garment hem.</li>
                      </ol>
                    )}
                    {activeTab === 'Shoes' && (
                      <ol className="list-decimal pl-4 space-y-1.5 leading-relaxed text-stone-800">
                        <li><strong className="text-stone-900 font-bold">Step on Paper:</strong> Place a blank sheet of paper flat on the floor against a straight wall, then step on it with your heel lightly touching the wall.</li>
                        <li><strong className="text-stone-900 font-bold">Mark Length:</strong> Mark the furthest tip of your longest toe on the paper with a pen held completely upright (90 degrees).</li>
                        <li><strong className="text-stone-900 font-bold">Measure Distance:</strong> Use a ruler to measure the straight-line distance from the wall edge to your marked point in centimeters.</li>
                      </ol>
                    )}
                    {activeTab === 'Baby/Diapers' && (
                      <ol className="list-decimal pl-4 space-y-1.5 leading-relaxed text-stone-800">
                        <li><strong className="text-stone-900 font-bold">Prioritize Weight:</strong> Always prioritize the baby's actual weight over their age group, as diaper absorbency scales directly with volume.</li>
                        <li><strong className="text-stone-900 font-bold">Aim for Mid-Range:</strong> For a leakproof seal, choose the size where your baby's current weight falls squarely in the middle of the diaper range.</li>
                        <li><strong className="text-stone-900 font-bold">Flare the Cuffs:</strong> After putting the diaper on, run your fingers around the leg bands to ensure the elastic leg cuffs are fully flared outwards.</li>
                      </ol>
                    )}
                    {activeTab === 'General' && (
                      <ol className="list-decimal pl-4 space-y-1.5 leading-relaxed text-stone-800">
                        <li><strong className="text-stone-900 font-bold">One Size (OS):</strong> Designed with loose silhouettes, dropped shoulders, or drape-heavy materials to flatter shapes from Small to X-Large.</li>
                        <li><strong className="text-stone-900 font-bold">Free Size:</strong> Features flexible elements like premium elastic headbands, adjustable drawstrings, or high-stretch ribbing up to XXL.</li>
                        <li><strong className="text-stone-900 font-bold">Fit Recommendation:</strong> If you prefer a tailored look, you can confidently size down. For a relaxed aesthetic, purchase your regular size.</li>
                      </ol>
                    )}
                  </div>
                  
                  <div className="pt-2 flex items-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#ca4c1b]/10 text-[#ca4c1b]">
                      Premium Fitting Guaranteed
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-stone-100 text-stone-600">
                      Standardized ISO Metrics
                    </span>
                  </div>
                </div>
              </div>

              {/* Table rendering */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-stone-400">
                  {activeTab} Measurement Chart
                </h4>
                
                <div className="border border-stone-200/60 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs bg-white">
                  <div className="overflow-x-auto w-full">
                    {activeTab === 'Clothing' && (
                      <table className="w-full min-w-[500px] text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-stone-50 border-b border-stone-200/60 font-black text-stone-900">
                            <th className="p-3 sm:p-4">Size</th>
                            <th className="p-3 sm:p-4">Chest / Bust</th>
                            <th className="p-3 sm:p-4">Shoulder Width</th>
                            <th className="p-3 sm:p-4">Total Length</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 text-stone-600">
                          <tr>
                            <td className="p-3 sm:p-4 font-bold text-stone-900">S</td>
                            <td className="p-3 sm:p-4">92 cm (36.2 in)</td>
                            <td className="p-3 sm:p-4">42 cm (16.5 in)</td>
                            <td className="p-3 sm:p-4">68 cm (26.7 in)</td>
                          </tr>
                          <tr>
                            <td className="p-3 sm:p-4 font-bold text-stone-900">M</td>
                            <td className="p-3 sm:p-4">98 cm (38.5 in)</td>
                            <td className="p-3 sm:p-4">44 cm (17.3 in)</td>
                            <td className="p-3 sm:p-4">70 cm (27.5 in)</td>
                          </tr>
                          <tr>
                            <td className="p-3 sm:p-4 font-bold text-stone-900">L</td>
                            <td className="p-3 sm:p-4">104 cm (40.9 in)</td>
                            <td className="p-3 sm:p-4">46 cm (18.1 in)</td>
                            <td className="p-3 sm:p-4">72 cm (28.3 in)</td>
                          </tr>
                          <tr>
                            <td className="p-3 sm:p-4 font-bold text-stone-900">XL</td>
                            <td className="p-3 sm:p-4">110 cm (43.3 in)</td>
                            <td className="p-3 sm:p-4">48 cm (18.9 in)</td>
                            <td className="p-3 sm:p-4">74 cm (29.1 in)</td>
                          </tr>
                          <tr>
                            <td className="p-3 sm:p-4 font-bold text-stone-900">XXL</td>
                            <td className="p-3 sm:p-4">116 cm (45.6 in)</td>
                            <td className="p-3 sm:p-4">50 cm (19.6 in)</td>
                            <td className="p-3 sm:p-4">76 cm (29.9 in)</td>
                          </tr>
                          <tr>
                            <td className="p-3 sm:p-4 font-bold text-stone-900">XXXL</td>
                            <td className="p-3 sm:p-4">122 cm (48.0 in)</td>
                            <td className="p-3 sm:p-4">52 cm (20.4 in)</td>
                            <td className="p-3 sm:p-4">78 cm (30.7 in)</td>
                          </tr>
                        </tbody>
                      </table>
                    )}

                    {activeTab === 'Shoes' && (
                      <table className="w-full min-w-[500px] text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-stone-50 border-b border-stone-200/60 font-black text-stone-900">
                            <th className="p-3 sm:p-4">EU/CN Size</th>
                            <th className="p-3 sm:p-4">Foot Length (cm)</th>
                            <th className="p-3 sm:p-4">US Men</th>
                            <th className="p-3 sm:p-4">US Women</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 text-stone-600">
                          <tr>
                            <td className="p-3 sm:p-4 font-bold text-stone-900">38</td>
                            <td className="p-3 sm:p-4">24.0 cm</td>
                            <td className="p-3 sm:p-4">6.0</td>
                            <td className="p-3 sm:p-4">7.5</td>
                          </tr>
                          <tr>
                            <td className="p-3 sm:p-4 font-bold text-stone-900">39</td>
                            <td className="p-3 sm:p-4">24.5 cm</td>
                            <td className="p-3 sm:p-4">6.5</td>
                            <td className="p-3 sm:p-4">8.0</td>
                          </tr>
                          <tr>
                            <td className="p-3 sm:p-4 font-bold text-stone-900">40</td>
                            <td className="p-3 sm:p-4">25.0 cm</td>
                            <td className="p-3 sm:p-4">7.0</td>
                            <td className="p-3 sm:p-4">8.5</td>
                          </tr>
                          <tr>
                            <td className="p-3 sm:p-4 font-bold text-stone-900">41</td>
                            <td className="p-3 sm:p-4">25.5 cm</td>
                            <td className="p-3 sm:p-4">8.0</td>
                            <td className="p-3 sm:p-4">9.5</td>
                          </tr>
                          <tr>
                            <td className="p-3 sm:p-4 font-bold text-stone-900">42</td>
                            <td className="p-3 sm:p-4">26.0 cm</td>
                            <td className="p-3 sm:p-4">8.5</td>
                            <td className="p-3 sm:p-4">10.0</td>
                          </tr>
                          <tr>
                            <td className="p-3 sm:p-4 font-bold text-stone-900">43</td>
                            <td className="p-3 sm:p-4">26.5 cm</td>
                            <td className="p-3 sm:p-4">9.5</td>
                            <td className="p-3 sm:p-4">11.0</td>
                          </tr>
                          <tr>
                            <td className="p-3 sm:p-4 font-bold text-stone-900">44</td>
                            <td className="p-3 sm:p-4">27.0 cm</td>
                            <td className="p-3 sm:p-4">10.0</td>
                            <td className="p-3 sm:p-4">11.5</td>
                          </tr>
                          <tr>
                            <td className="p-3 sm:p-4 font-bold text-stone-900">45</td>
                            <td className="p-3 sm:p-4">27.5 cm</td>
                            <td className="p-3 sm:p-4">11.0</td>
                            <td className="p-3 sm:p-4">12.5</td>
                          </tr>
                        </tbody>
                      </table>
                    )}

                    {activeTab === 'Baby/Diapers' && (
                      <table className="w-full min-w-[500px] text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-stone-50 border-b border-stone-200/60 font-black text-stone-900">
                            <th className="p-3 sm:p-4">Diaper Size</th>
                            <th className="p-3 sm:p-4">Recommended Weight (kg)</th>
                            <th className="p-3 sm:p-4">Recommended Weight (lbs)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 text-stone-600">
                          <tr>
                            <td className="p-3 sm:p-4 font-bold text-stone-900">Newborn</td>
                            <td className="p-3 sm:p-4">Up to 5 kg</td>
                            <td className="p-3 sm:p-4">Up to 11 lbs</td>
                          </tr>
                          <tr>
                            <td className="p-3 sm:p-4 font-bold text-stone-900">Size 1</td>
                            <td className="p-3 sm:p-4">4 - 8 kg</td>
                            <td className="p-3 sm:p-4">9 - 18 lbs</td>
                          </tr>
                          <tr>
                            <td className="p-3 sm:p-4 font-bold text-stone-900">Size 2</td>
                            <td className="p-3 sm:p-4">6 - 11 kg</td>
                            <td className="p-3 sm:p-4">13 - 24 lbs</td>
                          </tr>
                          <tr>
                            <td className="p-3 sm:p-4 font-bold text-stone-900">Size 3</td>
                            <td className="p-3 sm:p-4">9 - 14 kg</td>
                            <td className="p-3 sm:p-4">20 - 31 lbs</td>
                          </tr>
                          <tr>
                            <td className="p-3 sm:p-4 font-bold text-stone-900">Size 4</td>
                            <td className="p-3 sm:p-4">12 - 17 kg</td>
                            <td className="p-3 sm:p-4">26 - 37 lbs</td>
                          </tr>
                          <tr>
                            <td className="p-3 sm:p-4 font-bold text-stone-900">Size 5</td>
                            <td className="p-3 sm:p-4">15+ kg</td>
                            <td className="p-3 sm:p-4">33+ lbs</td>
                          </tr>
                          <tr>
                            <td className="p-3 sm:p-4 font-bold text-stone-900">Size 6</td>
                            <td className="p-3 sm:p-4">16+ kg</td>
                            <td className="p-3 sm:p-4">35+ lbs</td>
                          </tr>
                        </tbody>
                      </table>
                    )}

                    {activeTab === 'General' && (
                      <table className="w-full min-w-[500px] text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-stone-50 border-b border-stone-200/60 font-black text-stone-900">
                            <th className="p-3 sm:p-4">Size Tag</th>
                            <th className="p-3 sm:p-4">Fit Characteristics</th>
                            <th className="p-3 sm:p-4">Best Fits Bodies</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 text-stone-600">
                          <tr>
                            <td className="p-3 sm:p-4 font-bold text-stone-900">One Size</td>
                            <td className="p-3 sm:p-4">Highly adjustable or loose unstructured cut.</td>
                            <td className="p-3 sm:p-4">Standard Small to X-Large.</td>
                          </tr>
                          <tr>
                            <td className="p-3 sm:p-4 font-bold text-stone-900">Free Size</td>
                            <td className="p-3 sm:p-4">Built with elasticated bands or drawstring adjustments.</td>
                            <td className="p-3 sm:p-4">Standard Medium to XX-Large.</td>
                          </tr>
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 border-t border-stone-100 bg-stone-50/50 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(false)}
                className="w-full sm:w-auto bg-stone-900 hover:bg-stone-850 text-white px-6 sm:px-8 py-3.5 rounded-xl font-bold text-[11px] sm:text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer text-center"
              >
                Close Guide
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
