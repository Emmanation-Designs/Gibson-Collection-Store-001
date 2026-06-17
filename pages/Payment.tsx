import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useToast } from '../store/useToast';
import { ArrowLeft, CreditCard, Loader2, CheckCircle } from 'lucide-react';
import { useStore } from '../store/useStore';

declare global {
  interface Window {
    MonnifySDK: any;
  }
}

export const Payment: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { user } = useStore();
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (error) throw error;
        setOrder(data);
      } catch (err) {
        console.error('Error fetching order', err);
        addToast('Order not found', 'error');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId, navigate, addToast]);

  const handlePayment = () => {
    if (!order) return;
    
    // Check if Monnify SDK is loaded
    if (!window.MonnifySDK) {
       addToast("Payment service is currently unavailable. Please try again later.", "error");
       return;
    }

    setPaying(true);

    const amount = Number(order.total);
    const customerFullName = user?.user_metadata?.full_name || "Customer";
    const customerEmail = user?.email || "customer@example.com";
    
    // Extract Monnify config from env if available, else use placeholder config
    const apiKey = import.meta.env.VITE_MONNIFY_API_KEY || import.meta.env.NEXT_PUBLIC_MONNIFY_API_KEY || "MK_TEST_XXXXXXXX";
    const contractCode = import.meta.env.VITE_MONNIFY_CONTRACT_CODE || import.meta.env.MONNIFY_CONTRACT_CODE || "1234567890";
    
    window.MonnifySDK.initialize({
      amount: amount,
      currency: "NGN",
      reference: new String(new Date().getTime()),
      customerFullName: customerFullName,
      customerEmail: customerEmail,
      apiKey: apiKey,
      contractCode: contractCode,
      paymentDescription: `Payment for Order #${order.id.split('-')[0].toUpperCase()}`,
      metadata: {
        orderId: order.id
      },
      onLoadStart: () => {
        console.log("loading has started");
      },
      onLoadComplete: () => {
        setPaying(false);
        console.log("SDK is UP");
      },
      onComplete: async (response: any) => {
        console.log(response);
        if (response.paymentStatus === "PAID") {
          try {
            await supabase
              .from('orders')
              .update({ 
                payment_status: 'paid',
                payment_reference: response.paymentReference,
                paid_at: new Date().toISOString()
               })
              .eq('id', order.id);
              
            setPaymentSuccess(true);
            addToast("Payment successful! Your order will be processed.", "success");
            
            setTimeout(() => {
              navigate(user ? '/orders' : '/');
            }, 3000);
            
          } catch(err) {
            console.error(err);
            addToast("Payment recorded, but we had trouble updating the order.", "error");
          }
        } else {
            addToast("Payment was not completed.", "error");
        }
      },
      onClose: (data: any) => {
        setPaying(false);
        console.log(data);
      }
    });
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#1e40af] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) return null;

  if (paymentSuccess) {
    return (
        <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-500 mb-6">Thank you for your purchase. We are processing your order.</p>
            <Loader2 className="w-6 h-6 animate-spin text-[#1e40af] mx-auto" />
            <p className="text-sm text-gray-400 mt-2">Redirecting to your orders...</p>
        </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-10">
      <div className="flex items-center gap-2 mb-8">
        <button 
          onClick={() => navigate('/cart')} 
          className="p-2 hover:bg-gray-100 rounded-full transition"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Complete Payment</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800">Order Summary</h2>
            <p className="text-sm font-mono text-gray-500 mt-1">Order #{order.id.split('-')[0].toUpperCase()}</p>
        </div>
        
        <div className="p-6">
            <div className="space-y-4 mb-6">
                {(order.items || []).map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                        <div className="flex flex-col">
                            <span className="font-medium text-gray-800">{item.name}</span>
                            <span className="text-gray-500 text-xs">Qty: {item.quantity} {item.color && `| Color: ${item.color}`}</span>
                        </div>
                        <span className="font-medium text-gray-900">
                            ₦{(item.price * item.quantity).toLocaleString()}
                        </span>
                    </div>
                ))}
            </div>

            <div className="border-t border-gray-100 py-4 mb-6">
                <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Total Amount Due</span>
                    <span className="text-2xl font-bold text-primary">₦{Number(order.total).toLocaleString()}</span>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                    <CreditCard className="w-5 h-5 text-[#1e40af] flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-semibold text-[#1e40af] mb-1">Secure Payment with Monnify</h4>
                        <p className="text-xs text-blue-800/80">
                            You will be redirected to our secure payment gateway to complete your transaction via bank transfer or card.
                        </p>
                    </div>
                </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={paying || order.payment_status === 'paid'}
              className={`w-full bg-[#1e40af] hover:bg-blue-800 text-white py-4 rounded-xl font-bold shadow-lg transition flex items-center justify-center gap-2 ${
                (paying || order.payment_status === 'paid') ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {paying ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Initializing Payment...
                </>
              ) : order.payment_status === 'paid' ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Already Paid
                  </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Pay ₦{Number(order.total).toLocaleString()} Now
                </>
              )}
            </button>
        </div>
      </div>
    </div>
  );
};
