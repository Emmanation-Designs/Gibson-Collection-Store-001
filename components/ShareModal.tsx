import React, { useState } from 'react';
import { Product } from '../types';
import { X, Copy, Check, MessageSquare, Facebook, Twitter, Share2 } from 'lucide-react';
import { useToast } from '../store/useToast';

interface ShareModalProps {
  product: Product;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ product, onClose }) => {
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);

  // Generate share URL using standard HashRouter URL path
  const shareUrl = `${window.location.origin}/#/product/${product.id}`;
  
  const hasDiscount = product.discount && product.discount > 0;
  const finalPrice = hasDiscount 
    ? product.price * (1 - product.discount! / 100) 
    : product.price;

  // As requested: always use the cover image (first image) for situations with multiple images
  const coverImageUrl = product.image_urls && product.image_urls.length > 0
    ? product.image_urls[0]
    : '/logo.png';

  const titleText = `Gibson Empire Essentials | ${product.name}`;
  const descriptionText = `₦${finalPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })} • ${product.category}. Pure premium quality vetted for your family's daily nursery essentials.`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      addToast('Product link copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      addToast('Failed to copy link. Please copy it manually.', 'error');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: titleText,
          text: descriptionText,
          url: shareUrl,
        });
        addToast('Shared successfully!', 'success');
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    }
  };

  const shareTextWhatsApp = `Check out this amazing product from Gibson Empire Essentials!\n🌟 *${product.name}*\n💰 Price: ₦${finalPrice.toLocaleString()}\n\nView details here: ${shareUrl}`;
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTextWhatsApp)}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Gibson Empire Essentials - ${product.name}`)}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop click closer */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Main Container */}
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative z-10 p-6 flex flex-col gap-6 animate-in zoom-in-95 duration-200 border border-gray-100">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-orange-50 text-primary rounded-xl">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 text-sm md:text-md uppercase tracking-wider">Share Product</h3>
              <p className="text-xs text-gray-400">Spread the love with family and friends</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Simulated OpenGraph Preview Card */}
        <div className="space-y-2">
          <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest block">
            Link Preview (OpenGraph Appearance)
          </span>
          
          <div className="border border-gray-200 rounded-2xl overflow-hidden bg-[#f2f4f7] shadow-inner transition hover:shadow-md duration-300">
            {/* Cover Image representing the OpenGraph preview */}
            <div className="relative aspect-[1.91/1] w-full bg-white flex items-center justify-center overflow-hidden border-b border-gray-100 p-2">
              <img 
                src={coverImageUrl} 
                alt={product.name} 
                className="max-h-full max-w-full object-contain transition-transform duration-500 hover:scale-105"
                referrerPolicy="no-referrer"
              />
              {hasDiscount && (
                <div className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow">
                  -{product.discount}% OFF
                </div>
              )}
            </div>

            {/* Content Preview */}
            <div className="p-3.5 bg-white space-y-1">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                gibsonempireessentials.com
              </span>
              <h4 className="text-sm font-bold text-gray-800 line-clamp-1">
                {titleText}
              </h4>
              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                {descriptionText}
              </p>
            </div>
          </div>
        </div>

        {/* Real-time Link Display */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest block">
            Product Link
          </label>
          <div className="flex gap-2">
            <input 
              type="text" 
              readOnly 
              value={shareUrl} 
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 text-xs font-mono text-gray-600 select-all outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="px-4 py-2.5 bg-primary hover:bg-[#b83d14] text-white rounded-xl font-bold text-xs transition flex items-center gap-1.5 shrink-0 shadow-md active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300 stroke-[3]" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Link
                </>
              )}
            </button>
          </div>
        </div>

        {/* Social Platforms Row */}
        <div className="space-y-2">
          <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest block">
            Share Directly To
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {/* WhatsApp */}
            <a 
              href={whatsappShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-3 border border-gray-100 hover:border-emerald-100 rounded-xl bg-white hover:bg-emerald-50 text-gray-700 hover:text-emerald-600 font-bold text-xs transition shadow-xs hover:shadow-md"
            >
              <MessageSquare className="w-4 h-4 text-emerald-500 fill-emerald-500" />
              WhatsApp
            </a>

            {/* Facebook */}
            <a 
              href={facebookShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-3 border border-gray-100 hover:border-blue-100 rounded-xl bg-white hover:bg-blue-50 text-gray-700 hover:text-blue-600 font-bold text-xs transition shadow-xs hover:shadow-md"
            >
              <Facebook className="w-4 h-4 text-blue-600 fill-blue-600" />
              Facebook
            </a>

            {/* Twitter / X */}
            <a 
              href={twitterShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-3 border border-gray-100 hover:border-gray-200 rounded-xl bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 font-bold text-xs transition col-span-2 sm:col-span-1 shadow-xs hover:shadow-md"
            >
              <Twitter className="w-4 h-4 text-sky-500 fill-sky-500" />
              Twitter / X
            </a>
          </div>
        </div>

        {/* Native share button if supported */}
        {navigator.share && (
          <button
            onClick={handleNativeShare}
            className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <Share2 className="w-4 h-4 text-gray-600" />
            Use System Share Tray
          </button>
        )}

      </div>
    </div>
  );
};
