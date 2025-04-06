"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/supabase-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Loader2, Sparkles } from "lucide-react";
import TransitionTemplate from "@/components/TransitionTemplate";
import Script from "next/script";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function WaitlistPage() {
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const router = useRouter();

  // Load Razorpay script
  const loadRazorpay = () => {
    if (window.Razorpay) {
      setIsRazorpayLoaded(true);
      return;
    }
    
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      setIsRazorpayLoaded(true);
    };
    script.onerror = () => {
      setError("Failed to load payment gateway. Please refresh the page.");
    };
    document.body.appendChild(script);
  };

  useEffect(() => {
    // Check if waitlist is enabled
    const isWaitlistEnabled = process.env.NEXT_PUBLIC_WAITLIST === 'true';
    
    // If waitlist is disabled, redirect back to dashboard
    if (!isWaitlistEnabled) {
      router.push('/dashboard');
      return;
    }
    
    // Continue with normal page loading if waitlist is enabled
    loadRazorpay();
    
    const fetchUserData = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
          router.push('/auth/login');
          return;
        }

        setUserId(user.id);
        setUserEmail(user.email || "");
        
        // Get user metadata
        if (user.user_metadata?.full_name) {
          setUserName(user.user_metadata.full_name);
        } else if (user.email) {
          // Fallback to email username if no name is available
          setUserName(user.email.split('@')[0]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data. Please try again.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handlePayment = async () => {
    try {
      setSubmitting(true);
      setError(null);

      // Check if Razorpay is loaded
      if (!isRazorpayLoaded || !window.Razorpay) {
        setError("Payment gateway is still loading. Please wait a moment and try again.");
        setSubmitting(false);
        return;
      }

      // Validate mobile number
      if (!mobileNumber) {
        setError("Please provide your mobile number");
        setSubmitting(false);
        return;
      }

      if (!userId) {
        setError("User not authenticated. Please log in again.");
        setSubmitting(false);
        return;
      }

      // Create Razorpay order via our API, passing mobile number but not storing it
      const orderResponse = await fetch('/api/razorpay/set-amt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          mobileNumber, // We pass this for Razorpay prefill only
          amount: 39 // ₹39 for waitlist
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      // Initialize Razorpay
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "PICTRIFY",
        description: "Early Access Waitlist",
        order_id: orderData.orderId,
        handler: async function(response: any) {
          try {
            // Verify payment and add credits
            const verificationResponse = await fetch('/api/razorpay/set-amt/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                userId
                // Don't send mobileNumber to verify endpoint
              }),
            });

            const verificationData = await verificationResponse.json();

            if (!verificationResponse.ok) {
              throw new Error(verificationData.error || 'Payment verification failed');
            }

            setSuccess(true);
            setTimeout(() => {
              router.push('/');
            }, 2000);
          } catch (err) {
            console.error("Verification error:", err);
            setError(err instanceof Error ? err.message : "Payment verification failed");
            setSubmitting(false);
          }
        },
        prefill: {
          name: userName,
          email: userEmail,
          contact: mobileNumber // Use mobile number for Razorpay UI but don't store in DB
        },
        theme: {
          color: "#FF3366"
        },
        modal: {
          ondismiss: function() {
            setSubmitting(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("Payment error:", err);
      setError(err instanceof Error ? err.message : "Payment failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-t-[#FF3366] border-r-[#FF33A8]/40 border-b-[#FF33A8] border-l-[#FF3366]/40 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <TransitionTemplate>
      {/* Add Razorpay script */}
      <Script 
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
        onLoad={() => setIsRazorpayLoaded(true)}
        onError={() => setError("Failed to load payment gateway. Please refresh the page.")}
      />
      
      <div className="min-h-screen bg-black relative overflow-hidden flex flex-col items-center justify-center p-4 md:p-8">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          {/* Neon lines */}
          <div className="absolute top-[20%] left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FF3366]/20 to-transparent"></div>
          <div className="absolute top-[80%] left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FF3366]/20 to-transparent"></div>
          
          {/* Blurred circles */}
          <div className="absolute top-[10%] right-[10%] w-64 h-64 rounded-full bg-[#FF3366]/5 blur-[100px]"></div>
          <div className="absolute bottom-[10%] left-[10%] w-64 h-64 rounded-full bg-[#FF33A8]/5 blur-[100px]"></div>
          
          {/* Animated dots */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-[15%] left-[10%] w-1 h-1 rounded-full bg-[#FF3366] animate-pulse"></div>
            <div className="absolute top-[35%] right-[15%] w-1 h-1 rounded-full bg-[#FF3366] animate-pulse" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute bottom-[25%] left-[20%] w-1 h-1 rounded-full bg-[#FF3366] animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-[40%] right-[25%] w-1 h-1 rounded-full bg-[#FF3366] animate-pulse" style={{animationDelay: '1.5s'}}></div>
          </div>
        </div>
        
        <div className="w-full max-w-md mx-auto relative z-10">
          {/* Logo with glow effect */}
          <div className="flex justify-center mb-10">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF3366] to-[#FF33A8] flex items-center justify-center shadow-lg relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FF3366] to-[#FF33A8] blur-[10px] opacity-50"></div>
              <Sparkles className="h-8 w-8 text-white relative z-10" />
            </div>
          </div>
          
          <div className="text-center mb-10">
            <div className="inline-block uppercase text-xs font-medium tracking-widest text-[#FF3366] mb-4 px-3 py-1 rounded-full bg-[#FF3366]/10 backdrop-blur-sm">Coming soon</div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 bg-clip-text text-transparent bg-gradient-to-r from-[#FF3366] to-[#FF33A8]">Get early access</h1>
            <p className="text-gray-400 text-sm max-w-sm mx-auto leading-relaxed">
              Be amongst the first to experience PICTRIFY and launch a visual revolution. 
              <span className="text-white font-medium block mt-2">Get 15 bonus credits when we launch!</span>
            </p>
          </div>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg mb-8 text-sm backdrop-blur-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-4 rounded-lg mb-8 flex items-center justify-center text-sm backdrop-blur-sm">
              <Check className="h-4 w-4 mr-2" />
              <span>Successfully joined the waitlist! Redirecting...</span>
            </div>
          )}
          
          <div className="bg-[#111]/80 backdrop-blur-md border border-gray-800/50 rounded-lg p-6 shadow-xl mb-10">
            <div className="space-y-6">
              <div className="relative">
                <Input
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Name"
                  className="bg-black/50 border border-gray-800 focus:border-[#FF3366] text-white h-12 pl-4 pr-4 rounded-md w-full focus:ring-[#FF3366]/20"
                />
              </div>

              <div className="relative">
                <Input
                  value={userEmail}
                  disabled
                  placeholder="Email"
                  className="bg-black/50 border border-gray-800 focus:border-[#FF3366] text-white h-12 pl-4 pr-4 rounded-md w-full focus:ring-[#FF3366]/20 opacity-80"
                />
              </div>

              <div className="relative">
                <Input
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="Mobile Number (for payment only)"
                  className="bg-black/50 border border-gray-800 focus:border-[#FF3366] text-white h-12 pl-4 pr-4 rounded-md w-full focus:ring-[#FF3366]/20"
                />
                <div className="text-xs text-gray-500 mt-1 pl-1">Used only for payment, will not be stored</div>
              </div>
              
              <Button
                onClick={handlePayment}
                disabled={submitting || !isRazorpayLoaded}
                className="w-full bg-gradient-to-r from-[#FF3366] to-[#FF33A8] text-white h-12 font-medium rounded-md hover:shadow-[0_0_15px_rgba(255,51,102,0.5)] transition-all duration-300 mt-2"
              >
                {submitting ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </div>
                ) : !isRazorpayLoaded ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading Payment Gateway...
                  </div>
                ) : (
                  "Join waitlist • ₹39"
                )}
              </Button>
            </div>
          </div>
          
          {/* Pagination dots with animation */}
          <div className="mb-8">
            <div className="flex justify-center">
              <div className="flex space-x-3">
                <div className="w-2 h-2 rounded-full bg-[#FF3366] animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-[#FF3366] animate-pulse animation-delay-100"></div>
                <div className="w-2 h-2 rounded-full bg-[#FF3366] animate-pulse animation-delay-200"></div>
              </div>
            </div>
          </div>
          
          {/* User counter banner */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full">
              <div className="flex -space-x-2 mr-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border border-black"></div>
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-teal-500 border border-black"></div>
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-red-500 border border-black"></div>
              </div>
              <span className="text-sm text-gray-300">
                <span className="font-medium text-white">127+</span> users joined
              </span>
            </div>
          </div>
        </div>
      </div>
    </TransitionTemplate>
  );
} 