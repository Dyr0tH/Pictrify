"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/supabase-client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Tag, Check, X, ThumbsUp, Sparkles, Tag as TagIcon, AlertTriangle } from 'lucide-react';
import TransitionTemplate from '@/components/TransitionTemplate';
import { cn } from '@/utils';

// Read the environment variable
const PAYMENTS_ENABLED = process.env.NEXT_PUBLIC_PAYMENTS === 'true';

// Define interfaces for the data structures
interface Plan {
  id: string;
  name: string;
  price: number;
  credits: number;
  popular?: boolean;
  benefits?: string[];
}

interface UserData {
  id: string;
  credits: number;
  [key: string]: any;
}

export default function PurchaseCredits() {
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [plansLoading, setPlansLoading] = useState(true);
  const [plans, setPlans] = useState<Plan[]>([]);

  // Discount code state
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [validatingDiscount, setValidatingDiscount] = useState(false);
  const [originalPrice, setOriginalPrice] = useState<number | null>(null);

  const router = useRouter();

  useEffect(() => {
    // Only fetch plans if payments are enabled
    if (PAYMENTS_ENABLED) {
      const fetchPlans = async () => {
        setPlansLoading(true);
        try {
          const { data, error: plansError } = await supabase
            .from('plans')
            .select('*')
            .order('price', { ascending: true });
            
          if (plansError) {
            throw plansError;
          }
          
          if (data) {
            setPlans(data as Plan[]);
          }
        } catch (err: unknown) {
          console.error('Error fetching plans:', err);
          setError('Failed to load plans. Please try again later.');
        } finally {
          setPlansLoading(false);
        }
      };

      fetchPlans();
    }

    const getUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const { data, error: userDataError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

          if (data) {
            setUserData(data as UserData);
          }
          
          if (userDataError) {
            console.error('Error fetching user data:', userDataError);
          }
        }
      } catch (err: unknown) {
        console.error('Error in getUserData:', err);
      }
    };

    getUserData();
  }, []);

  // Handle plan selection
  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      setTotalPrice(plan.price);
      setOriginalPrice(plan.price);

      // Reset discount if plan changes
      if (discountApplied) {
        setDiscountApplied(false);
        setDiscountPercent(0);
        setDiscountCode('');
      }
    }
  };

  // Process payment
  const handlePurchase = async () => {
    if (!selectedPlan) {
      setError('Please select a plan first');
      return;
    }

    setError(null);
    setPaymentProcessing(true);

    const plan = plans.find(p => p.id === selectedPlan);

    if (!plan) {
      setError('Selected plan not found');
      setPaymentProcessing(false);
      return;
    }

    try {
      // Validate discount code again if applied
      if (discountApplied && discountCode) {
        const response = await fetch('/api/check-discount', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            discountCode: discountCode.toUpperCase()
          })
        });

        const result = await response.json();

        if (!result.valid) {
          setDiscountApplied(false);
          setDiscountPercent(0);
          setTotalPrice(plan.price);
          setDiscountError(result.error || 'Invalid discount code');
          throw new Error(result.error || 'Invalid discount code');
        }
      }

      // In a real app, you would integrate with Razorpay or another payment provider here
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate successful payment
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      // Add credits to user's account
      const { error: updateError } = await supabase
        .from('users')
        .update({
          credits: (userData?.credits || 0) + (plan.credits || 0),
        })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      // Record the transaction
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert([{
          user_id: user.id,
          amount: totalPrice || plan.price || 0,
          type: 'TEST'
        }]);

      if (transactionError) {
        console.log('Error recording transaction:', transactionError);
        console.log('Transaction details:', {
          user_id: user.id,
          amount: totalPrice || plan.price || 0,
          type: 'TEST'
        });
        // Don't throw here as credits are already added
      }

      // If discount was applied, increment usage
      if (discountApplied && discountCode) {
        try {
          // Use the API endpoint to increment discount usage
          const response = await fetch('/api/increment-discount-usage', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              discountCode: discountCode.toUpperCase()
            })
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.log('Error recording discount usage:', errorData.error);

            // If the code has reached max uses but we somehow got here,
            // we'll still complete the purchase since credits were already added
            if (errorData.maxUsesReached) {
              console.warn('Discount code reached max uses during purchase');
            }
          }
        } catch (discountError) {
          console.log('Error recording discount usage:', discountError);
        }
      }

      setPurchaseSuccess(true);

      // Dispatch event to notify dashboard
      const event = new CustomEvent('credits-updated');
      window.dispatchEvent(event);

      // Redirect to dashboard after a delay
      setTimeout(() => {
        router.push('/dashboard?purchase=success');
      }, 3000);

    } catch (err: unknown) {
      console.log('Payment error:', err);
      setError(err instanceof Error ? err.message : 'Failed to process payment. Please try again.');
    } finally {
      setPaymentProcessing(false);
    }
  };

  // Validate and apply discount code
  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      setDiscountError('Please enter a discount code');
      return;
    }

    if (!selectedPlan) {
      setDiscountError('Please select a plan first');
      return;
    }

    setDiscountError(null);
    setValidatingDiscount(true);

    try {
      // Use the check-discount API to validate the code
      const response = await fetch('/api/check-discount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          discountCode: discountCode.toUpperCase()
        })
      });

      const result = await response.json();

      if (!result.valid) {
        throw new Error(result.error || 'Invalid discount code');
      }

      // Get additional discount information
      const usageResponse = await fetch('/api/check-discount-usage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          discountCode: discountCode.toUpperCase()
        })
      });

      const usageInfo = await usageResponse.json();

      // Apply discount
      const plan = plans.find(p => p.id === selectedPlan);
      if (plan) {
        const discountAmount = plan.price * (result.discount.discountPercent / 100);
        const discountedPrice = plan.price - discountAmount;

        setDiscountApplied(true);
        setDiscountPercent(result.discount.discountPercent);
        setTotalPrice(Number(discountedPrice.toFixed(2)));
        setOriginalPrice(plan.price);

        // Show remaining uses info if available
        if (usageInfo && usageInfo.remaining !== 'unlimited') {
          // For user experience, we don't show 0 remaining
          const remaining = Math.max(1, usageInfo.remaining);
          setDiscountError(`Discount applied! ${remaining} use${remaining > 1 ? 's' : ''} remaining.`);
        }
      }

    } catch (err: any) {
      console.log('Discount error:', err);
      setDiscountError(err.message || 'Invalid discount code');

      // Reset discount if error
      setDiscountApplied(false);
      setDiscountPercent(0);

      // Reset price to original
      const plan = plans.find(p => p.id === selectedPlan);
      if (plan) {
        setTotalPrice(plan.price);
      }

    } finally {
      setValidatingDiscount(false);
    }
  };

  // Remove applied discount
  const handleRemoveDiscount = () => {
    setDiscountApplied(false);
    setDiscountPercent(0);
    setDiscountCode('');
    setDiscountError(null);

    // Reset price to original
    if (selectedPlan) {
      const plan = plans.find(p => p.id === selectedPlan);
      if (plan) {
        setTotalPrice(plan.price);
      }
    }
  };

  if (purchaseSuccess) {
    return (
      <TransitionTemplate>
        <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#000000] flex items-center justify-center">
          <div className="w-full max-w-2xl p-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-[#FF3366] to-[#FF33A8] rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <ThumbsUp className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Payment Successful!</h2>
              <p className="text-[#94A3B8] mb-8">Your credits have been added to your account.</p>
              <p className="text-[#94A3B8] text-sm mb-8">Redirecting you to dashboard...</p>
            </div>
          </div>
        </div>
      </TransitionTemplate>
    );
  }

  return (
    <TransitionTemplate>
      <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#000000] text-white">
        {/* Header */}
        <header className="bg-[#0A0A0A]/90 backdrop-blur-md shadow-lg border-b border-[#FF3366]/20">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2 group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF3366] to-[#FF33A8] flex items-center justify-center shadow-md group-hover:shadow-[#FF3366]/50 transition-all duration-300">
                  <span className="text-white font-bold text-xl">P</span>
                </div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF3366] to-[#FF33A8] group-hover:from-[#FF33A8] group-hover:to-[#FF3366] transition-all duration-300 font-['Righteous'] tracking-wider">PICTRIFY</span>
              </div>
              <Button
                variant="ghost"
                className="text-[#94A3B8] hover:text-[#FF3366] flex items-center space-x-2"
                onClick={() => router.push('/dashboard')}
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <header className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF3366] to-[#FF33A8] mb-4">Purchase Credits</h1>
              <p className="text-[#94A3B8] max-w-2xl mx-auto">
                Unlock your creative potential with our credit packages. Choose the plan that suits your needs.
              </p>
            </header>

            {!PAYMENTS_ENABLED ? (
              <div className="max-w-3xl mx-auto">
                <Card className="bg-gradient-to-br from-[#0A0A0A] to-[#000000] border border-[#334155]/50 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-center mb-6">
                      <div className="w-16 h-16 bg-[#FF3366]/10 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-8 h-8 text-[#FF3366]" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-white text-center">Payments Currently Disabled</CardTitle>
                    <CardDescription className="text-[#94A3B8] text-center">
                      Our payment system is temporarily unavailable.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <p className="text-[#94A3B8]">
                      We're working to enable our payment system. In the meantime, you can continue using your available credits or contact support for assistance.
                    </p>
                    <p className="text-[#94A3B8]">
                      Thank you for your patience and understanding.
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <Button
                      onClick={() => router.push('/dashboard')}
                      className="bg-gradient-to-r from-[#FF3366] to-[#FF33A8] hover:shadow-lg hover:shadow-[#FF3366]/20 transition-all duration-300"
                    >
                      Return to Dashboard
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  {plansLoading ? (
                    // Loading skeletons for plans
                    Array(2).fill(0).map((_, index) => (
                      <Card 
                        key={`skeleton-${index}`}
                        className="bg-gradient-to-br from-[#0A0A0A] to-[#000000] border border-[#334155]/50 transition-all duration-300"
                      >
                        <CardHeader>
                          <div className="h-7 w-24 bg-[#334155]/50 rounded animate-pulse mb-2"></div>
                          <div className="h-5 w-32 bg-[#334155]/30 rounded animate-pulse"></div>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-6">
                            <div className="h-8 w-20 bg-[#334155]/50 rounded animate-pulse mb-2"></div>
                            <div className="h-4 w-28 bg-[#334155]/30 rounded animate-pulse"></div>
                          </div>
                          <div className="space-y-3">
                            {Array(3).fill(0).map((_, i) => (
                              <div key={i} className="flex items-start space-x-2">
                                <div className="h-4 w-4 bg-[#334155]/50 rounded-full mt-0.5"></div>
                                <div className="h-4 w-full bg-[#334155]/30 rounded animate-pulse"></div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter>
                          <div className="h-10 w-full bg-[#334155]/50 rounded animate-pulse"></div>
                        </CardFooter>
                      </Card>
                    ))
                  ) : error && plans.length === 0 ? (
                    <div className="col-span-1 md:col-span-2 p-6 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
                      <p className="text-red-400">{error}</p>
                      <Button 
                        onClick={() => window.location.reload()} 
                        className="mt-4 bg-[#FF3366]/20 hover:bg-[#FF3366]/30 text-[#FF3366]"
                      >
                        Try Again
                      </Button>
                    </div>
                  ) : (
                    plans.map((plan) => (
                      <Card
                        key={plan.id}
                        className={cn(
                          "bg-gradient-to-br from-[#0A0A0A] to-[#000000] border border-[#334155]/50 hover:border-[#FF3366]/40 transition-all duration-300 relative overflow-hidden group",
                          selectedPlan === plan.id ? "border-[#FF3366] shadow-lg shadow-[#FF3366]/10" : "",
                          plan.popular ? "border-[#FF3366]/30" : ""
                        )}
                        onClick={() => handleSelectPlan(plan.id)}
                      >
                        {plan.popular && (
                          <div className="absolute top-0 right-0">
                            <div className="bg-gradient-to-r from-[#FF3366] to-[#FF33A8] text-xs uppercase font-bold tracking-wider text-white px-4 py-1 transform rotate-0 translate-x-0 -translate-y-0 shadow-lg">
                              Popular
                            </div>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-r from-[#FF3366]/5 to-[#FF33A8]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                        <CardHeader>
                          <CardTitle className="text-2xl font-bold text-white flex items-center space-x-2">
                            <span>{plan.name}</span>
                            {selectedPlan === plan.id && (
                              <span className="text-[#FF3366] ml-2">
                                <Check className="h-5 w-5" />
                              </span>
                            )}
                          </CardTitle>
                          <CardDescription className="text-[#94A3B8]">
                            {plan.credits} credits
                          </CardDescription>
                        </CardHeader>

                        <CardContent>
                          <div className="mb-6">
                            <p className="text-3xl font-bold text-white">
                              ₹{plan.price}
                            </p>
                            <p className="text-[#94A3B8] text-sm">
                              One-time payment
                            </p>
                          </div>

                          <ul className="space-y-3">
                            {plan.benefits && Array.isArray(plan.benefits) ? (
                              plan.benefits.map((feature: string, index: number) => (
                                <li key={index} className="flex items-start space-x-2">
                                  <span className="text-[#FF3366] mt-0.5">
                                    <Check className="h-4 w-4" />
                                  </span>
                                  <span className="text-[#94A3B8]">{feature}</span>
                                </li>
                              ))
                            ) : (
                              <li className="text-[#94A3B8]">Instant credits on purchase</li>
                            )}
                          </ul>
                        </CardContent>

                        <CardFooter>
                          <Button
                            className={cn(
                              "w-full",
                              selectedPlan === plan.id
                                ? "bg-gradient-to-r from-[#FF3366] to-[#FF33A8] hover:shadow-lg hover:shadow-[#FF3366]/20 transition-all duration-300"
                                : "bg-[#334155]/50 hover:bg-[#475569]/50"
                            )}
                            onClick={() => handleSelectPlan(plan.id)}
                          >
                            {selectedPlan === plan.id ? "Selected" : "Select Plan"}
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  )}
                </div>

                {selectedPlan && (
                  <div className="max-w-md mx-auto">
                    {plans.find(p => p.id === selectedPlan) ? (
                      <Card className="bg-gradient-to-br from-[#0A0A0A] to-[#000000] border border-[#334155]/30 shadow-xl mb-8 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[#0A0A0A] opacity-80 z-0"></div>
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF3366]/5 to-[#FF33A8]/5 opacity-100 blur-sm z-0"></div>

                        <CardHeader className="relative z-10">
                          <CardTitle className="text-xl font-bold text-white">Checkout Summary</CardTitle>
                          <CardDescription className="text-[#94A3B8]">
                            Complete your purchase
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="relative z-10 space-y-6">
                          {/* Discount Code Section */}
                          <div className="space-y-2">
                            <Label htmlFor="discountCode" className="text-[#94A3B8] flex items-center">
                              <TagIcon className="h-4 w-4 mr-2 text-[#FF3366]" />
                              Discount Code
                            </Label>

                            {!discountApplied ? (
                              <div className="flex space-x-2">
                                <Input
                                  id="discountCode"
                                  value={discountCode}
                                  onChange={(e) => setDiscountCode(e.target.value)}
                                  className="bg-[#0A0A0A] border-[#334155]/50 focus:border-[#FF3366] focus:ring-[#FF3366]/20 text-white"
                                  placeholder="Enter code"
                                  disabled={validatingDiscount}
                                />
                                <Button
                                  onClick={handleApplyDiscount}
                                  disabled={validatingDiscount || !discountCode}
                                  className="bg-[#334155]/50 hover:bg-[#475569]/50 text-white"
                                >
                                  {validatingDiscount ? 'Checking...' : 'Apply'}
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between p-2 bg-[#0A0A0A]/70 border border-[#FF3366]/30 rounded-md">
                                <div className="flex items-center space-x-2">
                                  <Tag className="h-4 w-4 text-[#FF3366]" />
                                  <div>
                                    <p className="text-white font-mono">{discountCode.toUpperCase()}</p>
                                    <p className="text-[#FF3366] text-xs">{discountPercent}% discount applied</p>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-[#94A3B8] hover:text-[#FF3366] hover:bg-[#FF3366]/10"
                                  onClick={handleRemoveDiscount}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            )}

                            {discountError && (
                              <p className="text-[#FF3366] text-xs">{discountError}</p>
                            )}
                          </div>

                          <div className="border-t border-[#334155]/30 my-4 pt-4">
                            <div className="space-y-2">
                              {discountApplied && originalPrice && (
                                <div className="flex justify-between items-center">
                                  <span className="text-[#94A3B8]">Original Price:</span>
                                  <span className="text-[#94A3B8] line-through">₹{originalPrice.toFixed(2)}</span>
                                </div>
                              )}

                              <div className="flex justify-between items-center">
                                <span className="text-white text-lg font-medium">Total:</span>
                                <span className="text-white text-lg font-bold">
                                  ₹{totalPrice?.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-md">
                              <p className="text-red-400 text-sm">{error}</p>
                            </div>
                          )}

                          <Button
                            className="w-full bg-gradient-to-r from-[#FF3366] to-[#FF33A8] text-white hover:shadow-lg hover:shadow-[#FF3366]/20 transition-all duration-300"
                            onClick={handlePurchase}
                            disabled={paymentProcessing || !selectedPlan}
                          >
                            {paymentProcessing ? 'Processing...' : 'Complete Purchase'}
                            {!paymentProcessing && <Sparkles className="ml-2 h-4 w-4" />}
                          </Button>

                          <p className="text-[#94A3B8] text-xs text-center">
                            By completing this purchase, you agree to our Terms of Service and Privacy Policy.
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-lg text-center mb-8">
                        <p className="text-red-400">The selected plan could not be found. Please try selecting another plan.</p>
                        <Button 
                          onClick={() => setSelectedPlan(null)} 
                          className="mt-4 bg-[#FF3366]/20 hover:bg-[#FF3366]/30 text-[#FF3366]"
                        >
                          Go Back
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </TransitionTemplate>
  );
} 