"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Megaphone, Users, Check, Rocket, Gift, Zap, Star, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import TransitionTemplate from "@/components/TransitionTemplate";
import { supabase } from "@/utils/supabase/supabase-client";
import { useState, useEffect } from "react";

export default function DashboardRestricted() {
  const router = useRouter();
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [waitlistStatus, setWaitlistStatus] = useState<{ waitlist_1st_launch?: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkWaitlistStatus = async () => {
      try {
        // Check if waitlist is enabled
        const isWaitlistEnabled = process.env.NEXT_PUBLIC_WAITLIST === 'true';
        setShowWaitlist(isWaitlistEnabled);

        if (isWaitlistEnabled) {
          // Get current user
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          
          if (userError || !user) {
            router.push('/auth/login');
            return;
          }

          // Get user's waitlist status
          const { data: userData, error: statusError } = await supabase
            .from('users')
            .select('waitlist_status')
            .eq('id', user.id)
            .single();

          if (statusError) {
            console.error('Error fetching waitlist status:', statusError);
            return;
          }

          setWaitlistStatus(userData?.waitlist_status || {});
        }
      } catch (error) {
        console.error('Error checking waitlist status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkWaitlistStatus();
  }, [router]);
  
  const handleReturnHome = async () => {
    // Log the user out
    await supabase.auth.signOut();
    // Redirect to homepage
    router.push("/");
  };

  return (
    <TransitionTemplate>
      <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#000000] flex items-center justify-center p-4 m-5">
        <div className="max-w-2xl w-full bg-[#0A0A0A]/80 border border-[#334155]/50 rounded-2xl shadow-xl p-8 md:p-12 text-center backdrop-blur-sm">
          <div className="relative">
            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-[#FF3366]/5 rounded-full blur-xl"></div>
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#FF3366]/30 to-[#FF33A8]/30 flex items-center justify-center mx-auto mb-6 relative z-10 border border-[#FF3366]/20">
              <Rocket className="text-[#FF3366] h-10 w-10" />
            </div>
          </div>
          
          <div className="relative mb-8">
            <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF3366] to-[#FF33A8] mb-2 tracking-tight">
              LAUNCHING SOON!
            </h1>
            <p className="text-lg md:text-xl font-medium text-white/90 mb-2">
              Our Waitlist Is Now Live
            </p>
            <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#FF3366]/5 rounded-full blur-3xl"></div>
          </div>
          
          <p className="text-[#94A3B8] text-lg mb-8 max-w-lg mx-auto">
            We're putting the finishing touches on something amazing. Join our exclusive waitlist today and be among the first to experience PICTRIFY when we launch.
          </p>
          
          <div className="mx-auto w-32 h-1 bg-gradient-to-r from-[#FF3366]/50 to-[#FF33A8]/50 rounded-full mb-8"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#0A0A0A]/80 border border-[#334155]/30 rounded-xl p-4 hover:border-[#FF3366]/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,51,102,0.1)]">
              <div className="w-12 h-12 rounded-full bg-[#FF3366]/10 flex items-center justify-center mx-auto mb-3">
                <Star className="text-[#FF3366] h-6 w-6" />
              </div>
              <h3 className="text-white font-medium mb-2">Early Access</h3>
              <p className="text-[#94A3B8] text-sm">Be the first to try our platform before the public launch</p>
            </div>
            
            <div className="bg-[#0A0A0A]/80 border border-[#334155]/30 rounded-xl p-4 hover:border-[#FF3366]/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,51,102,0.1)]">
              <div className="w-12 h-12 rounded-full bg-[#FF3366]/10 flex items-center justify-center mx-auto mb-3">
                <Gift className="text-[#FF3366] h-6 w-6" />
              </div>
              <h3 className="text-white font-medium mb-2">Exclusive Perks</h3>
              <p className="text-[#94A3B8] text-sm">Special bonuses and features only for waitlist members</p>
            </div>
            
            <div className="bg-[#0A0A0A]/80 border border-[#334155]/30 rounded-xl p-4 hover:border-[#FF3366]/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,51,102,0.1)]">
              <div className="w-12 h-12 rounded-full bg-[#FF3366]/10 flex items-center justify-center mx-auto mb-3">
                <Zap className="text-[#FF3366] h-6 w-6" />
              </div>
              <h3 className="text-white font-medium mb-2">Priority Support</h3>
              <p className="text-[#94A3B8] text-sm">Get dedicated assistance and faster response times</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-[#FF3366]/10 to-[#FF33A8]/10 rounded-xl p-4 mb-8 border border-[#FF3366]/20">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="text-[#FF3366] h-5 w-5" />
              <p className="text-white font-medium">Limited Time Opportunity</p>
            </div>
            <p className="text-[#94A3B8] text-sm">
              Our waitlist spots are filling up quickly! Join now to secure your place and all the exclusive benefits.  
            </p>
          </div>
          
          {showWaitlist && !loading && waitlistStatus && waitlistStatus.waitlist_1st_launch ? (
            <div className="mb-8">
              <div className="bg-gradient-to-r from-[#FF3366]/20 to-[#FF33A8]/20 border border-[#FF3366]/30 p-5 rounded-xl flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#FF3366]/20 flex items-center justify-center mb-4">
                  <Check className="text-[#FF3366] h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">You're on the List!</h3>
                <p className="text-[#94A3B8] text-center mb-4">
                  Thank you for joining our waitlist! We'll notify you as soon as we launch with your exclusive benefits ready to go.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                  <Button 
                    onClick={handleReturnHome}
                    className="bg-gradient-to-r from-[#FF3366] to-[#FF33A8] text-white hover:from-[#FF33A8] hover:to-[#FF3366] transition-all duration-300 shadow-md hover:shadow-[#FF3366]/20 rounded-full w-full sm:w-auto"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    <span>Return to Homepage</span>
                  </Button>
                  
                  <Link href="/announcements">
                    <Button 
                      className="bg-[#0A0A0A] border border-[#FF3366]/70 text-white hover:bg-[#FF3366]/15 transition-all duration-300 shadow-md hover:shadow-[#FF3366]/10 rounded-full w-full sm:w-auto"
                    >
                      <Megaphone className="mr-2 h-4 w-4 text-[#FF3366]" />
                      <span>View Announcements</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {showWaitlist && !loading ? (
                <Link href="/waitlist" className="w-full">
                  <Button 
                    className="bg-gradient-to-r from-[#FF3366] to-[#FF33A8] text-white hover:from-[#FF33A8] hover:to-[#FF3366] transition-all duration-300 shadow-lg hover:shadow-[#FF3366]/30 rounded-full w-full py-6 text-lg font-medium"
                  >
                    <Users className="mr-2 h-5 w-5" />
                    <span>Join the Waitlist Now</span>
                  </Button>
                </Link>
              ) : null}
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  onClick={handleReturnHome}
                  className="bg-[#0A0A0A] border border-[#334155]/50 text-white hover:border-[#FF3366]/50 transition-all duration-300 shadow-md hover:shadow-[#FF3366]/10 rounded-full w-full sm:w-auto"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  <span>Return to Homepage</span>
                </Button>
                
                <Link href="/announcements">
                  <Button 
                    className="bg-[#0A0A0A] border border-[#FF3366]/70 text-white hover:bg-[#FF3366]/15 transition-all duration-300 shadow-md hover:shadow-[#FF3366]/10 rounded-full w-full sm:w-auto"
                  >
                    <Megaphone className="mr-2 h-4 w-4 text-[#FF3366]" />
                    <span>View Announcements</span>
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </TransitionTemplate>
  );
}