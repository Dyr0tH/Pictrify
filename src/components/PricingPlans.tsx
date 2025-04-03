"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { supabase } from "@/utils/supabase/supabase-client";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Plan {
  id: string;
  name: string;
  price: number;
  credits: number;
  popular?: boolean;
  benefits?: string[];
}

export default function PricingPlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
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
      } catch (err) {
        console.error('Error fetching plans:', err);
        setError('Failed to load plans. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="w-12 h-12 border-4 border-t-[#FF3366] border-r-[#FF33A8]/40 border-b-[#FF33A8] border-l-[#FF3366]/40 rounded-full animate-spin"></div>
        <p className="text-[#94A3B8]">Loading pricing plans...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-red-500/10 border border-red-500/30 rounded-xl">
        <p className="text-red-400 text-center mb-4">{error}</p>
        <Button 
          onClick={() => window.location.reload()} 
          className="bg-[#FF3366]/20 hover:bg-[#FF3366]/30 text-[#FF3366]"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-[#0A0A0A] border border-[#334155]/30 rounded-xl">
        <p className="text-[#94A3B8] text-center mb-4">No pricing plans available at the moment.</p>
        <p className="text-[#94A3B8] text-center text-sm">Please check back later or contact support for more information.</p>
      </div>
    );
  }

  // Default benefits if not provided by the API
  const defaultBenefits = [
    "Instant processing",
    "High-quality output",
    "Download in multiple formats",
    "Use credits anytime"
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={cn(
              "bg-gradient-to-br from-[#0A0A0A] to-[#000000] border border-[#334155]/50 hover:border-[#FF3366]/40 transition-all duration-300 relative overflow-hidden group",
              plan.popular ? "border-[#FF3366]/30 shadow-lg shadow-[#FF3366]/5" : ""
            )}
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
              <CardTitle className="text-2xl font-bold text-white">
                {plan.name}
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
                  plan.benefits.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-[#FF3366] mt-0.5">
                        <Check className="h-4 w-4" />
                      </span>
                      <span className="text-[#94A3B8]">{feature}</span>
                    </li>
                  ))
                ) : (
                  defaultBenefits.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-[#FF3366] mt-0.5">
                        <Check className="h-4 w-4" />
                      </span>
                      <span className="text-[#94A3B8]">{feature}</span>
                    </li>
                  ))
                )}
              </ul>
            </CardContent>

            <CardFooter>
              <Link href="/auth/signup" className="w-full">
                <Button
                  className="w-full bg-gradient-to-r from-[#FF3366] to-[#FF33A8] hover:from-[#FF33A8] hover:to-[#FF3366] text-white shadow-md hover:shadow-[#FF3366]/20 transition-all"
                >
                  Get Started
                  <Sparkles className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="bg-[#0A0A0A] border border-[#334155]/30 rounded-xl p-6 mb-8">
        <h3 className="text-xl font-bold text-white mb-4">How Credits Work</h3>
        <p className="text-[#94A3B8] mb-4">Credits are used for each image transformation or generation:</p>
        <ul className="space-y-2">
          <li className="flex items-start space-x-2">
            <span className="text-[#FF3366] mt-0.5">
              <Check className="h-4 w-4" />
            </span>
            <span className="text-[#94A3B8]">1 credit = 1 standard image transformation</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-[#FF3366] mt-0.5">
              <Check className="h-4 w-4" />
            </span>
            <span className="text-[#94A3B8]">Higher resolution outputs may require additional credits</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-[#FF3366] mt-0.5">
              <Check className="h-4 w-4" />
            </span>
            <span className="text-[#94A3B8]">Credits never expire once purchased</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-[#FF3366] mt-0.5">
              <Check className="h-4 w-4" />
            </span>
            <span className="text-[#94A3B8]">Purchase additional credits anytime from your dashboard</span>
          </li>
        </ul>
      </div>
    </div>
  );
} 