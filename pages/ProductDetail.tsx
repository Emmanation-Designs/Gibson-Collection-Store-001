import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product, Review, CATEGORY_IMAGES } from '../types';
import { useStore } from '../store/useStore';
import { useToast } from '../store/useToast';
import { ShareModal } from '../components/ShareModal';
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  ArrowLeft, 
  MessageSquare, 
  Truck, 
  ShieldCheck, 
  Calendar, 
  Tag, 
  Check, 
  AlertCircle, 
  Loader2, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Minus,
  Send,
  User,
  Share2,
  X,
  Ruler
} from 'lucide-react';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, wishlist, user } = useStore();
  const { addToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Gallery
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Sharing
  const [showShare, setShowShare] = useState(false);

  // Selection state
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const getInitialGuideTab = (prod: Product | null): string => {
    if (!prod) return 'General';
    if (prod.category === 'Clothing & Accessories' || prod.category === 'Adult Wears') {
      return 'Clothing';
    }
    if (prod.category === 'Diapering & Daily Care') {
      return 'Baby/Diapers';
    }
    if (prod.sizes && prod.sizes.some(s => ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'].includes(s))) {
      return 'Clothing';
    }
    if (prod.sizes && prod.sizes.some(s => !isNaN(Number(s)))) {
      return 'Shoes';
    }
    if (prod.sizes && prod.sizes.some(s => s.toLowerCase().includes('size') || s.toLowerCase().includes('newborn'))) {
      return 'Baby/Diapers';
    }
    return 'General';
  };

  const [activeTab, setActiveTab] = useState<string>('General');

  useEffect(() => {
    if (product) {
      setActiveTab(getInitialGuideTab(product));
    }
  }, [product]);

  // Description accordion expansion
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  // New Review Form State
  const [formRating, setFormRating] = useState<number>(5);
  const [formHoverRating, setFormHoverRating] = useState<number | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formText, setFormText] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const isWishlisted = product ? wishlist.includes(product.id) : false;

  useEffect(() => {
    if (id) {
      fetchProductAndReviews(id);
    }
  }, [id]);

  const fetchProductAndReviews = async (productId: string) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch Product
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (productError) throw productError;
      if (!productData) {
        setError('Product not found');
        return;
      }

      setProduct(productData);

      // Default the selected color if colors exist
      if (productData.colors && productData.colors.length > 0) {
        setSelectedColor(productData.colors[0]);
      }

      // 2. Fetch Reviews
      await fetchReviews(productId);

    } catch (err: any) {
      console.error('Error loading product details:', err);
      setError(err?.message || 'Failed to details load product.');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (productId: string) => {
    setReviewsLoading(true);
    try {
      const { data, error: reviewsError } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (reviewsError) {
        // Safe check in case reviews table doesn't have open security rules or has error
        console.warn('Could not fetch reviews:', reviewsError.message);
        setReviews([]);
      } else {
        setReviews(data || []);
      }
    } catch (err) {
      console.error('Reviews read error:', err);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, selectedColor || undefined, selectedSize, quantity);
    addToast(`Added ${quantity} × ${product.name} to cart!`, 'success');
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    toggleWishlist(product.id);
    if (!isWishlisted) {
      addToast("Added to wishlist", "success");
    } else {
      addToast("Removed from wishlist", "info");
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !user) return;

    if (!formText.trim()) {
      addToast('Please enter review comment text.', 'error');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const reviewPayload = {
        product_id: product.id,
        user_id: user.id,
        reviewer_name: user.full_name || user.email.split('@')[0] || 'Anonymous User',
        rating: formRating,
        title: formTitle.trim() || undefined,
        review_text: formText.trim(),
      };

      const { error: insertError } = await supabase
        .from('reviews')
        .insert([reviewPayload]);

      if (insertError) throw insertError;

      addToast('Review submitted successfully! Thank you.', 'success');
      setFormTitle('');
      setFormText('');
      setFormRating(5);
      
      // Refresh list of reviews
      await fetchReviews(product.id);
    } catch (err: any) {
      console.error('Error submitting review:', err);
      addToast(`Submission failed: ${err?.message || 'Database error'}`, 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-white px-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-gray-500 font-semibold animate-pulse">Loading premium details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto py-20 px-6 text-center">
        <div className="bg-red-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-black text-gray-800 mb-3">Product Unavailable</h2>
        <p className="text-gray-500 mb-8">{error || 'This item could not be retrieved from the store catalog.'}</p>
        <Link 
          to="/store" 
          className="inline-flex items-center gap-2 bg-[#ca4c1b] hover:bg-orange-850 text-white font-bold px-6 py-3 rounded-full shadow-md transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Return to Store
        </Link>
      </div>
    );
  }

  const images = product.image_urls && product.image_urls.length > 0
    ? product.image_urls
    : ['/logo.png'];

  const hasDiscount = product.discount && product.discount > 0;
  const finalPrice = hasDiscount
    ? product.price * (1 - product.discount! / 100)
    : product.price;

  // Calculate review score stats
  const reviewCount = reviews.length;
  const averageRating = reviewCount > 0 
    ? Number((reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviewCount).toFixed(1))
    : 5.0; // default initial fallback

  // Rating distribution calculation
  const starsCount = [0, 0, 0, 0, 0]; // Index 0 is 1 star, Index 4 is 5 star
  reviews.forEach(r => {
    const starIdx = Math.max(1, Math.min(5, r.rating)) - 1;
    starsCount[starIdx]++;
  });

  const formattedListedDate = new Date(product.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 pb-20 pt-4 animate-in fade-in duration-300">
      
      {/* Back button */}
      <button 
        onClick={() => navigate('/store')} 
        className="inline-flex items-center gap-2 text-gray-600 hover:text-primary font-semibold mb-6 group transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Back to Catalog
      </button>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left: Gallery (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Main Visual Display */}
          <div className="relative aspect-square rounded-3xl bg-gray-50 border border-gray-100 overflow-hidden shadow-sm flex items-center justify-center p-6 group">
            <img 
              src={images[selectedImageIndex]} 
              alt={product.name} 
              className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
            />
            {hasDiscount && (
              <span className="absolute top-4 left-4 bg-red-600 text-white font-black text-xs px-3.5 py-1.5 rounded-full shadow-md tracking-wider uppercase animate-pulse">
                -{product.discount}% OFF
              </span>
            )}
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto py-1 px-0.5 no-scrollbar">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl bg-gray-50 border-2 overflow-hidden flex-shrink-0 transition-all ${
                    selectedImageIndex === idx 
                      ? 'border-[#ca4c1b] scale-95 ring-4 ring-orange-50' 
                      : 'border-gray-100 hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info Area (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Title & Reviews summary header */}
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#10b981] bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
              <Tag className="w-3.5 h-3.5" />
              {product.category}
            </span>

            <h1 className="text-2xl md:text-3.5xl font-black text-gray-900 tracking-tight leading-none md:leading-tight">
              {product.name}
            </h1>

            {/* Quick Star Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-amber-500 bg-amber-50/50 px-2.5 py-1 rounded-lg border border-amber-100/50">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold text-sm">{averageRating}</span>
              </div>
              <span className="text-xs font-bold text-gray-400">•</span>
              <a href="#reviews-section" className="text-xs font-semibold text-primary hover:underline transition">
                {reviewCount} Verified {reviewCount === 1 ? 'Review' : 'Reviews'}
              </a>
            </div>
          </div>

          {/* Price Block */}
          <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-3.5xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Price</span>
              <div className="flex items-baseline gap-3">
                <span className={`text-3xl md:text-4xl font-extrabold ${hasDiscount ? 'text-red-600' : 'text-gray-900'}`}>
                  ₦{finalPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
                {hasDiscount && (
                  <span className="text-lg md:text-xl text-gray-400 line-through font-medium">
                    ₦{product.price.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Stock status indicator */}
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-bold text-emerald-600 uppercase tracking-wider">
                In Stock & Ready
              </span>
            </div>
          </div>

          {/* Details & Specs grid */}
          <div className="grid grid-cols-2 gap-4 border-t border-b border-gray-100 py-4 text-sm">
            <div className="flex items-center gap-3 text-gray-600">
              <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none">Listed Date</p>
                <p className="font-semibold text-gray-800 mt-1">{formattedListedDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-600">
              <ShieldCheck className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none">Condition</p>
                <p className="font-semibold text-gray-800 mt-1">Excellent/New</p>
              </div>
            </div>
          </div>

          {/* Colors Selection (if exists) */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Available Colors</h3>
              <div className="flex flex-wrap gap-2.5">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-full border text-xs font-bold transition-all ${
                      selectedColor === color
                        ? 'border-primary bg-blue-50 text-primary shadow-sm ring-2 ring-primary/20'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-5 p-1'
                    }`}
                  >
                    {selectedColor === color && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes Selection (if exists) */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
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
                <p className="text-[11px] text-[#ca4c1b] font-medium mt-1">
                  * Please select a size to add to cart
                </p>
              )}
            </div>
          )}

          {/* Quantity selector, Add to Cart, Wishlist & WhatsApp Layout */}
          <div className="space-y-4 pt-2">
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              
              {/* Quantity Counter box */}
              <div className="flex items-center justify-between border border-gray-200 rounded-2xl p-1.5 bg-gray-50/50 sm:w-36 h-14">
                <button
                  type="button"
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="w-10 h-10 rounded-xl hover:bg-white text-gray-500 hover:text-gray-800 transition flex items-center justify-center shadow-none hover:shadow-xs border border-transparent hover:border-gray-100"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-black text-gray-950 font-mono text-lg">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="w-10 h-10 rounded-xl hover:bg-white text-gray-500 hover:text-gray-800 transition flex items-center justify-center shadow-none hover:shadow-xs border border-transparent hover:border-gray-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart button */}
              <button
                onClick={handleAddToCart}
                disabled={
                  (product.colors && product.colors.length > 0 && !selectedColor) || 
                  (product.sizes && product.sizes.length > 0 && !selectedSize)
                }
                className="flex-1 bg-primary hover:bg-blue-800 text-white rounded-2xl h-14 font-black transition flex items-center justify-center gap-2.5 shadow-lg shadow-blue-900/10 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5 stroke-[2.5]" />
                Add to Cart
              </button>

              {/* Wishlist Heart toggle */}
              <button
                onClick={handleToggleWishlist}
                className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition flex-shrink-0 ${
                  isWishlisted 
                    ? 'border-red-200 bg-red-50 text-red-500 shadow-sm' 
                    : 'border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
                aria-label="Add to wishlist"
              >
                <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-red-500' : ''}`} />
              </button>

              {/* Share button */}
              <button
                onClick={() => setShowShare(true)}
                className="w-14 h-14 rounded-2xl border border-gray-200 text-gray-400 hover:text-primary hover:bg-orange-50/50 hover:border-orange-100 flex items-center justify-center transition flex-shrink-0"
                aria-label="Share product"
                title="Share Product"
              >
                <Share2 className="w-6 h-6" />
              </button>
            </div>

          </div>

          {/* Expandable full description */}
          <div className="border border-gray-100 rounded-3xl p-5 md:p-6 space-y-3 bg-white shadow-xs">
            <button
              onClick={() => setIsDescExpanded(!isDescExpanded)}
              className="w-full flex items-center justify-between text-left font-bold text-gray-900 text-sm md:text-md"
            >
              <span>Product Description</span>
              {isDescExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </button>
            <div className={`text-gray-600 text-sm leading-relaxed whitespace-pre-wrap transition-all overflow-hidden ${
              isDescExpanded ? 'max-h-[1000px] opacity-100 mt-2' : 'max-h-24 opacity-80 line-clamp-3'
            }`}>
              {product.description}
            </div>
            {!isDescExpanded && product.description && product.description.length > 150 && (
              <button
                onClick={() => setIsDescExpanded(true)}
                className="text-xs font-extrabold text-[#111827] hover:text-[#ca4c1b] transition mt-1 uppercase tracking-wider"
              >
                Read full details...
              </button>
            )}
          </div>

          {/* Delivery Information section */}
          <div className="bg-gray-50/50 border border-gray-100 rounded-3xl p-5 md:p-6 space-y-4">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
              <Truck className="w-4 h-4 text-primary" /> Delivery & Returns Support
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <h4 className="font-extrabold text-gray-800">Dispatch Speed</h4>
                <p className="text-gray-500 leading-relaxed">
                  Lagos order delivery in *1-2 days*. Interstate express shipping delivers within 3-5 standard business days.
                </p>
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-gray-800">Gibson Guarantee</h4>
                <p className="text-gray-500 leading-relaxed">
                  Check item fitness thoroughly. Damaged/unused items returned in packages are fully eligible for a replacement exchange in 7 days.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Break border */}
      <hr className="border-gray-100 my-16" />

      {/* Reviews Section */}
      <section id="reviews-section" className="scroll-mt-12 space-y-10">
        <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          Customer Reviews
          <span className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-500 font-bold border border-gray-200">
            {reviewCount}
          </span>
        </h2>

        {/* Statistical overview segment */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-gray-50/40 p-6 md:p-8 rounded-3.5xl border border-gray-100">
          
          <div className="md:col-span-4 text-center md:text-left space-y-2 flex flex-col items-center md:items-start justify-center">
            <p className="text-[11px] text-gray-400 font-black uppercase tracking-widest">Average Score</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5.5xl font-black text-gray-900">{averageRating}</span>
              <span className="text-lg text-gray-400 font-semibold">/ 5.0</span>
            </div>
            
            <div className="flex gap-1 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-5 h-5 ${i < Math.round(averageRating) ? 'fill-current text-amber-500' : 'text-gray-200'}`} 
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 font-medium">Based on {reviewCount} verified purchases</p>
          </div>

          <div className="md:col-span-8 space-y-2.5">
            {/* Display rating distribution bars */}
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = starsCount[stars - 1];
              const pct = reviewCount > 0 ? (count / reviewCount) * 100 : 0;
              return (
                <div key={stars} className="flex items-center gap-4 text-xs font-medium">
                  <span className="w-12 text-gray-600 font-bold text-right flex items-center justify-end gap-1">
                    {stars} <Star className="w-3.5 h-3.5 text-amber-500 fill-current shrink-0" />
                  </span>
                  
                  {/* Progress Line */}
                  <div className="flex-1 h-3 rounded-full bg-gray-100 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500" 
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>

                  <span className="w-8 text-gray-400 text-right">{count}</span>
                </div>
              );
            })}
          </div>

        </div>

        {/* Form and List Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Reviews List (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-lg font-extrabold text-gray-900 border-b border-gray-100 pb-3">
              Verified Entries
            </h3>

            {reviewsLoading ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
                <p className="text-sm text-gray-400 font-medium">Fetching verified listings...</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-16 border rounded-2xl border-dashed border-gray-200 bg-white shadow-2xs">
                <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <h4 className="font-bold text-gray-700">No Review Left Yet</h4>
                <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1 leading-relaxed">
                  Be the very first customer to write feedback on this diaper collection design!
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {reviews.map((rev) => (
                  <div 
                    key={rev.id}
                    className="p-5 bg-white border border-gray-100 rounded-2.5xl space-y-3 shadow-xs relative"
                  >
                    {/* Stars and info */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-0.5 text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current text-amber-500' : 'text-gray-200'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase font-mono">
                        {new Date(rev.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>

                    {/* Review Title & Content */}
                    <div className="space-y-1.5">
                      {rev.title && (
                        <h4 className="font-extrabold text-gray-900 text-sm md:text-md">
                          {rev.title}
                        </h4>
                      )}
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {rev.review_text}
                      </p>
                    </div>

                    {/* Review Author Badge */}
                    <div className="flex items-center gap-2 pt-1 border-t border-gray-50">
                      <span className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-primary text-[10px] font-bold">
                        {rev.reviewer_name.slice(0, 2).toUpperCase()}
                      </span>
                      <span className="text-xs font-bold text-gray-700">{rev.reviewer_name}</span>
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-black text-green-600 bg-green-50 px-1.5 py-0.5 rounded uppercase tracking-wider scale-90">
                        Verified
                      </span>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Review form block (5 Cols) */}
          <div className="lg:col-span-5 bg-white border border-gray-100 p-6 md:p-8 rounded-3.5xl space-y-6 shadow-sm">
            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-gray-900">Share Your Experience</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Your direct evaluation reviews keep Gibson Empire Essentials quality checks premium!
              </p>
            </div>

            {user ? (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                
                {/* Clickable star selection layout */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                    Your Rating
                  </label>
                  <div className="flex items-center gap-1.5 pt-1">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const starRatingValue = i + 1;
                      const isHighlighted = formHoverRating !== null 
                        ? starRatingValue <= formHoverRating 
                        : starRatingValue <= formRating;

                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setFormRating(starRatingValue)}
                          onMouseEnter={() => setFormHoverRating(starRatingValue)}
                          onMouseLeave={() => setFormHoverRating(null)}
                          className="p-1 hover:scale-110 transition shrink-0"
                          title={`${starRatingValue} Stars`}
                        >
                          <Star 
                            className={`w-8 h-8 ${
                              isHighlighted 
                                ? 'fill-current text-amber-500' 
                                : 'text-gray-200'
                            }`} 
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Cover Title */}
                <div className="space-y-1.5">
                  <label htmlFor="review-title" className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                    Review Summary (Optional)
                  </label>
                  <input
                    id="review-title"
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Excellent fit, beautiful design"
                    className="w-full h-11 border border-gray-200 rounded-xl px-4 text-xs font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                  />
                </div>

                {/* Comment area */}
                <div className="space-y-1.5">
                  <label htmlFor="review-text" className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                    Review Message *
                  </label>
                  <textarea
                    id="review-text"
                    rows={4}
                    value={formText}
                    onChange={(e) => setFormText(e.target.value)}
                    placeholder="Describe styling, fabric comfort, or overall purchase ease..."
                    className="w-full border border-gray-200 rounded-xl p-4 text-xs font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none transition resize-none leading-relaxed"
                    required
                  ></textarea>
                </div>

                {/* Submission CTA */}
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="w-full h-12 bg-[#ca4c1b] hover:bg-orange-850 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 text-xs shadow-md shadow-orange-950/10 disabled:opacity-50"
                >
                  {isSubmittingReview ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Submit Review
                    </>
                  )}
                </button>

              </form>
            ) : (
              <div className="bg-blue-50/50 border border-blue-100 rounded-2.5xl p-5 text-center space-y-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mx-auto text-primary">
                  <User className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-900 text-sm">Write Review</h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Please log into your Gibson Empire Essentials account to verify your purchase authenticity first.
                  </p>
                </div>
                <Link
                  to="/auth"
                  className="inline-flex items-center justify-center w-full h-11 bg-primary hover:bg-blue-800 text-white font-bold rounded-xl transition text-xs shadow-sm"
                >
                  Sign In / Register
                </Link>
              </div>
            )}

          </div>

        </div>

      </section>

      {showShare && (
        <ShareModal 
          product={product} 
          onClose={() => setShowShare(false)} 
        />
      )}

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
