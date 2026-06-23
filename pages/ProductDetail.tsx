import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product, Review, CATEGORY_IMAGES, WHATSAPP_NUMBER } from '../types';
import { useStore } from '../store/useStore';
import { useToast } from '../store/useToast';
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
  User
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

  // Selection state
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

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
    addToCart(product, selectedColor || undefined, quantity);
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

  const handleWhatsAppPurchase = () => {
    if (!product) return;
    
    const hasDiscount = product.discount && product.discount > 0;
    const finalPrice = hasDiscount 
      ? product.price * (1 - product.discount! / 100) 
      : product.price;

    const textTemplate = `Hello Gibson Empire Essentials! I would like to buy:
📦 *Product*: ${product.name}
🌈 *Color*: ${selectedColor || 'Default'}
🔢 *Quantity*: ${quantity}
💰 *Total Price*: ₦${(finalPrice * quantity).toLocaleString()}

Please confirm availability and coordinates. Thank you!`;

    const encodedText = encodeURIComponent(textTemplate);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
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
                className="flex-1 bg-primary hover:bg-blue-800 text-white rounded-2xl h-14 font-black transition flex items-center justify-center gap-2.5 shadow-lg shadow-blue-900/10 active:scale-[0.99]"
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
            </div>

            {/* Direct WhatsApp purchasing CTA */}
            <button
              onClick={handleWhatsAppPurchase}
              className="w-full h-14 rounded-2xl bg-[#25d366] hover:bg-[#20ba56] text-white font-black transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <MessageSquare className="w-5 h-5 fill-current" />
              Order Instantly via WhatsApp
            </button>
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

    </div>
  );
};
