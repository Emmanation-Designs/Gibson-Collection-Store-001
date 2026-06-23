import React, { useState } from 'react';
import { useToast } from '../store/useToast';
import { Mail, Phone, MapPin, Send, Loader2, Sparkles, MessageSquare } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../types';

export const Contact: React.FC = () => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      addToast('Please fill out all required fields.', 'error');
      return;
    }

    setSubmitting(true);

    const messageTemplate = `Hello Gibson Empire Essentials! I have a new contact message:
👤 *Name*: ${formData.name}
📧 *Email*: ${formData.email}
📝 *Subject*: ${formData.subject || 'None'}
💬 *Message*: ${formData.message}`;

    const encodedText = encodeURIComponent(messageTemplate);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;

    setTimeout(() => {
      addToast('Redirecting to WhatsApp to send message...', 'success');
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setSubmitting(false);
    }, 800);
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Structural Hero Banner */}
      <section className="relative rounded-3xl overflow-hidden bg-primary shadow-lg min-h-[35vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#ca4c1b] via-[#ea580c] to-[#121d45] z-0"></div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-400/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="relative z-10 p-8 md:p-16 max-w-2xl text-white space-y-4">
          <span className="text-orange-200 text-xs font-bold uppercase tracking-widest block">Get in Touch</span>
          <h1 className="text-4xl font-extrabold tracking-tight">We are Here to Support You</h1>
          <p className="text-blue-100 font-light leading-relaxed text-md md:text-lg">
            Have questions about sizes, fabrics, fast deliveries, or orders? Contact our specialized parents-care team.
          </p>
        </div>
      </section>

      {/* Forms & Contact Info Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left column: Info Cards */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-105 shadow-sm space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-primary text-xs font-bold uppercase">
              <Sparkles className="w-3 h-3 text-[#ca4c1b]" />
              Always Connected
            </div>
            <h2 className="text-2xl font-bold text-gray-900 pt-2">Our Channels</h2>
            <p className="text-gray-500 font-medium text-xs leading-relaxed">
              We look forward to hearing from you. Reaching out directly is easy and fast.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-orange-50 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-[#ca4c1b]" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-sm">Call / WhatsApp</h4>
                <p className="text-xs text-gray-500 mt-1">+{WHATSAPP_NUMBER}</p>
                <a 
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  className="text-xs text-[#ca4c1b] font-bold hover:underline mt-1.5 block"
                >
                  Direct WhatsApp Chat &rarr;
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-sm">Email Support</h4>
                <p className="text-xs text-gray-500 mt-1">gibsonempireessentials@gmail.com</p>
                <span className="text-xs text-gray-400 font-medium block mt-1">24 Hour response timeframe</span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-sm">Our Location</h4>
                <p className="text-xs text-gray-500 leading-relaxed mt-1">
                  Saka bisiolu complex, ojuore market, oppositre under bridge. shop 123, ogun state, nigeria
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Columns: Interactive Contact Form */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#ca4c1b]" /> Send us a Message
            </h3>
            <p className="text-sm text-gray-500 font-medium">Have something to ask? Please use the secure form below.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Your Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Joy Alao"
                  className="px-4 py-3 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary text-sm text-gray-900 placeholder-gray-400"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Your Email <span className="text-red-500">*</span></label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g. joy@example.com"
                  className="px-4 py-3 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary text-sm text-gray-900 placeholder-gray-400"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Subject</label>
              <input 
                type="text" 
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="e.g., Question about diaper sizing"
                className="px-4 py-3 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary text-sm text-gray-900 placeholder-gray-400"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Message <span className="text-red-500">*</span></label>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={5}
                placeholder="Write your beautiful query or feedback here..."
                className="px-4 py-3 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary text-sm text-gray-900 placeholder-gray-400 resize-none"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-[#ca4c1b] hover:bg-orange-850 text-white font-bold py-3.5 px-8 rounded-xl transition shadow flex items-center justify-center gap-2 ml-auto cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Send Message
                </>
              )}
            </button>
          </form>
        </div>

      </section>

    </div>
  );
};
