"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/supabase-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Loader2, Sparkles, Wand2, Rocket, Gift, Star, Zap } from "lucide-react";
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
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] to-[#121212]"></div>
          
          {/* Starry effect */}
          <div className="absolute inset-0">
            <div className="stars-container">
              <div className="star" style={{top: '10%', left: '20%', width: '1px', height: '1px', backgroundColor: '#FFF', opacity: 0.6, animation: 'twinkle 4s infinite'}}></div>
              <div className="star" style={{top: '25%', left: '10%', width: '2px', height: '2px', backgroundColor: '#FFF', opacity: 0.4, animation: 'twinkle 6s infinite 1s'}}></div>
              <div className="star" style={{top: '40%', left: '30%', width: '1px', height: '1px', backgroundColor: '#FFF', opacity: 0.8, animation: 'twinkle 5s infinite 2s'}}></div>
              <div className="star" style={{top: '15%', left: '70%', width: '2px', height: '2px', backgroundColor: '#FFF', opacity: 0.5, animation: 'twinkle 7s infinite'}}></div>
              <div className="star" style={{top: '85%', left: '80%', width: '1px', height: '1px', backgroundColor: '#FFF', opacity: 0.7, animation: 'twinkle 5s infinite 1s'}}></div>
              <div className="star" style={{top: '75%', left: '25%', width: '2px', height: '2px', backgroundColor: '#FFF', opacity: 0.5, animation: 'twinkle 6s infinite 2s'}}></div>
            </div>
          </div>
          
          {/* Blurred circles */}
          <div className="absolute top-[10%] right-[10%] w-72 h-72 rounded-full bg-[#FF3366]/5 blur-[120px]"></div>
          <div className="absolute bottom-[10%] left-[10%] w-72 h-72 rounded-full bg-[#FF33A8]/5 blur-[120px]"></div>
          
          {/* Animated pulse rings */}
          <div className="absolute top-1/3 left-1/4 w-4 h-4 rounded-full bg-[#FF3366]/30">
            <div className="absolute inset-0 rounded-full bg-[#FF3366]/20 animate-ping" style={{animationDuration: '3s'}}></div>
          </div>
          <div className="absolute bottom-1/3 right-1/4 w-4 h-4 rounded-full bg-[#FF33A8]/30">
            <div className="absolute inset-0 rounded-full bg-[#FF33A8]/20 animate-ping" style={{animationDuration: '4s', animationDelay: '1s'}}></div>
          </div>
        </div>
        
        {/* Main content container - Desktop layout stays the same */}
        <div className="hidden md:flex w-full max-w-5xl mx-auto relative z-10 flex-row gap-8 items-center">
          {/* Left column - Hero content */}
          <div className="w-1/2 text-left">
            <div className="inline-flex items-center bg-[#FF3366]/10 backdrop-blur-sm px-3 py-1.5 rounded-full mb-6">
              <Star className="h-3.5 w-3.5 text-[#FF3366] mr-2" />
              <span className="text-xs font-medium tracking-wide text-[#FF3366]">EXCLUSIVE EARLY ACCESS</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF3366] to-[#FF33A8]">Unlock the Future</span> of Visual Creation
            </h1>
            
            <div className="flex items-center mb-8">
              <div className="bg-[#FF3366]/10 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center">
                <div className="flex -space-x-2 mr-2">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border border-black"></div>
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-green-500 to-teal-500 border border-black"></div>
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 border border-black"></div>
                </div>
                <span className="text-xs text-gray-300">
                  <span className="font-medium text-white">127+</span> creators already joined
                </span>
              </div>
              <div className="ml-3 text-gray-400 text-xs">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-1"></div>
                  <span>Limited spots remaining</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4 mb-8 text-gray-300">
              <p className="md:text-lg">Join our exclusive waitlist to get ahead of everyone else and gain early access to PICTRIFY's revolutionary AI-powered design tools.</p>
              
              <div className="space-y-3 mt-6">
                <div className="flex items-start">
                  <div className="mt-1 mr-3 flex-shrink-0 bg-[#FF3366]/20 rounded-full p-1">
                    <Gift className="h-4 w-4 text-[#FF3366]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white text-base">15 Bonus Credits</h3>
                    <p className="text-sm text-gray-400">Start creating right away with complimentary credits</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 mr-3 flex-shrink-0 bg-[#FF3366]/20 rounded-full p-1">
                    <Rocket className="h-4 w-4 text-[#FF3366]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white text-base">Priority Access</h3>
                    <p className="text-sm text-gray-400">Be first to experience new features and updates</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 mr-3 flex-shrink-0 bg-[#FF3366]/20 rounded-full p-1">
                    <Zap className="h-4 w-4 text-[#FF3366]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white text-base">Exclusive Community</h3>
                    <p className="text-sm text-gray-400">Connect with like-minded creators and our team</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column - Form */}
          <div className="w-1/2 ml-auto">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF3366] to-[#FF33A8] rounded-xl blur-sm opacity-50"></div>
              <div className="relative bg-[#111]/90 backdrop-blur-xl border border-gray-800/50 rounded-xl p-8 shadow-2xl">
                <div className="flex justify-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FF3366] to-[#FF33A8] flex items-center justify-center shadow-lg relative mb-6">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FF3366] to-[#FF33A8] blur-[6px] opacity-50"></div>
                    <Wand2 className="h-6 w-6 text-white relative z-10" />
                  </div>
                </div>
                
                <h2 className="text-xl md:text-2xl font-bold text-white text-center mb-2">Join the Exclusive Waitlist</h2>
                <p className="text-center text-gray-400 text-sm mb-6">Just a one-time payment of <span className="font-bold text-white">₹39</span> to secure your spot</p>
                
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg mb-6 text-sm backdrop-blur-sm">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-4 rounded-lg mb-6 flex items-center justify-center text-sm backdrop-blur-sm">
                    <Check className="h-4 w-4 mr-2" />
                    <span>Successfully joined the waitlist! Redirecting...</span>
                  </div>
                )}
                
                <div className="space-y-5">
                  <div className="relative">
                    <label className="text-gray-400 text-xs mb-1 block">Your Name</label>
                    <div className="relative">
                      <Input
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Enter your name"
                        className="bg-black/50 border border-gray-800 focus:border-[#FF3366] text-white h-12 pl-4 pr-4 rounded-md w-full focus:ring-[#FF3366]/20"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="text-gray-400 text-xs mb-1 block">Email Address</label>
                    <div className="relative">
                      <Input
                        value={userEmail}
                        disabled
                        placeholder="Email"
                        className="bg-black/50 border border-gray-800 focus:border-[#FF3366] text-white h-12 pl-4 pr-4 rounded-md w-full focus:ring-[#FF3366]/20 opacity-80"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="text-gray-400 text-xs mb-1 block">Mobile Number</label>
                    <div className="relative">
                      <Input
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder="For payment processing only"
                        className="bg-black/50 border border-gray-800 focus:border-[#FF3366] text-white h-12 pl-4 pr-4 rounded-md w-full focus:ring-[#FF3366]/20"
                      />
                      <div className="text-xs text-gray-500 mt-1 pl-1">Used only for payment, will not be stored</div>
                    </div>
                  </div>
                  
                  <Button
                    onClick={handlePayment}
                    disabled={submitting || !isRazorpayLoaded}
                    className="w-full bg-gradient-to-r from-[#FF3366] to-[#FF33A8] text-white h-12 font-medium rounded-md hover:shadow-[0_0_20px_rgba(255,51,102,0.5)] transition-all duration-300 mt-4"
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
                      "Secure Your Spot Now • ₹39"
                    )}
                  </Button>
                  
                  <div className="text-center mt-4">
                    <p className="text-xs text-gray-500">By joining, you'll be among the first to experience <br/>our revolutionary AI tools when we launch</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-optimized layout */}
        <div className="md:hidden w-full max-w-md mx-auto relative z-10">
          {/* Logo and social proof at top */}
          <div className="text-center mb-4">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF3366] to-[#FF33A8] flex items-center justify-center shadow-lg relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FF3366] to-[#FF33A8] blur-[10px] opacity-60"></div>
                <Wand2 className="h-7 w-7 text-white relative z-10" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-3">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF3366] to-[#FF33A8]">Early Access Waitlist</span>
            </h1>
            
            <div className="flex justify-center items-center space-x-3 mb-4 max-w-fit mx-auto">
              <div className="flex -space-x-2">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border border-black"></div>
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-green-500 to-teal-500 border border-black"></div>
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 border border-black"></div>
              </div>
              <div className="bg-[#FF3366]/10 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className="text-xs text-white font-medium">127+ creators joined</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              </div>
            </div>
          </div>
          
          {/* Main form card with glowing outline */}
          <div className="relative mb-6">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF3366] to-[#FF33A8] rounded-xl blur-sm opacity-50"></div>
            <div className="relative bg-[#111]/90 backdrop-blur-xl border border-gray-800/50 rounded-xl p-5 shadow-2xl">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg mb-5 text-sm backdrop-blur-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-3 rounded-lg mb-5 flex items-center justify-center text-sm backdrop-blur-sm">
                  <Check className="h-4 w-4 mr-2" />
                  <span>Successfully joined! Redirecting...</span>
                </div>
              )}
              
              <div className="space-y-4">
                <div className="relative">
                  <label className="text-gray-400 text-xs mb-1 block">Your Name</label>
                  <div className="relative">
                    <Input
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Enter your name"
                      className="bg-black/50 border border-gray-800 focus:border-[#FF3366] text-white h-12 pl-4 pr-4 rounded-md w-full focus:ring-[#FF3366]/20"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="text-gray-400 text-xs mb-1 block">Email Address</label>
                  <div className="relative">
                    <Input
                      value={userEmail}
                      disabled
                      placeholder="Email"
                      className="bg-black/50 border border-gray-800 focus:border-[#FF3366] text-white h-12 pl-4 pr-4 rounded-md w-full focus:ring-[#FF3366]/20 opacity-80"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="text-gray-400 text-xs mb-1 block">Mobile Number</label>
                  <div className="relative">
                    <Input
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="For payment only"
                      className="bg-black/50 border border-gray-800 focus:border-[#FF3366] text-white h-12 pl-4 pr-4 rounded-md w-full focus:ring-[#FF3366]/20"
                    />
                    <div className="text-xs text-gray-500 mt-1 pl-1">Will not be stored in our database</div>
                  </div>
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
                      Loading...
                    </div>
                  ) : (
                    "Join Waitlist • ₹39"
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile benefits cards in a scrollable row */}
          <p className="text-center text-white font-medium mb-3 text-sm">Exclusive Benefits:</p>
          <div className="flex flex-col space-y-3 mb-6">
            <div className="w-full bg-[#111]/80 backdrop-blur-md border border-[#FF3366]/20 rounded-lg p-3 shadow-lg">
              <div className="flex items-start">
                <div className="mt-0.5 mr-2.5 flex-shrink-0 bg-[#FF3366]/20 rounded-full p-1.5">
                  <Gift className="h-5 w-5 text-[#FF3366]" />
                </div>
                <div>
                  <h3 className="font-medium text-white text-sm">15 Bonus Credits</h3>
                  <p className="text-xs text-gray-400">Get a head start with free credits</p>
                </div>
              </div>
            </div>
            
            <div className="w-full bg-[#111]/80 backdrop-blur-md border border-[#FF3366]/20 rounded-lg p-3 shadow-lg">
              <div className="flex items-start">
                <div className="mt-0.5 mr-2.5 flex-shrink-0 bg-[#FF3366]/20 rounded-full p-1.5">
                  <Rocket className="h-5 w-5 text-[#FF3366]" />
                </div>
                <div>
                  <h3 className="font-medium text-white text-sm">Priority Access</h3>
                  <p className="text-xs text-gray-400">Be first to try new features</p>
                </div>
              </div>
            </div>
            
            <div className="w-full bg-[#111]/80 backdrop-blur-md border border-[#FF3366]/20 rounded-lg p-3 shadow-lg">
              <div className="flex items-start">
                <div className="mt-0.5 mr-2.5 flex-shrink-0 bg-[#FF3366]/20 rounded-full p-1.5">
                  <Zap className="h-5 w-5 text-[#FF3366]" />
                </div>
                <div>
                  <h3 className="font-medium text-white text-sm">Exclusive Community</h3>
                  <p className="text-xs text-gray-400">Connect with other creators</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center text-xs text-gray-500">
            <p>By joining, you'll be among the first to experience our revolutionary AI tools when we launch!</p>
          </div>
        </div>
        
        {/* Global styles */}
        <style jsx global>{`
          @keyframes twinkle {
            0% { opacity: 0.2; }
            50% { opacity: 0.8; }
            100% { opacity: 0.2; }
          }
          
          .animation-delay-100 {
            animation-delay: 0.1s;
          }
          
          .animation-delay-200 {
            animation-delay: 0.2s;
          }
          
          /* Hide scrollbar for Chrome, Safari and Opera */
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          
          /* Hide scrollbar for IE, Edge and Firefox */
          .hide-scrollbar {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
        `}</style>
      </div>
    </TransitionTemplate>
  );
} 