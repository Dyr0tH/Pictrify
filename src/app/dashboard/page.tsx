"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/utils/supabase/supabase-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, Coins, Check } from "lucide-react";
import Link from "next/link";
import TransitionTemplate from "@/components/TransitionTemplate";
import ImageTransformer from "@/components/ImageTransformer";
import { Toast, ToastProvider, ToastViewport } from "@/components/ui/toast";
import Navbar from "./navbar";

export default function DashboardPage() {
    const [userName, setUserName] = useState<string>("");
    const [credits, setCredits] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const fetchUserData = async () => {
        try {
            // Get the current user from auth
            const { data: { user }, error: userError } = await supabase.auth.getUser();

            if (userError) {
                setError("Failed to fetch user data. Please try logging in again.");
                return;
            }

            if (!user) {
                router.push('/auth/login');
                return;
            }

            // Get name from auth metadata
            if (user.user_metadata?.full_name) {
                setUserName(user.user_metadata.full_name);
            } else {
                // Fallback to email if no name is available
                setUserName(user.email?.split('@')[0] || 'User');
            }

            // Fetch user credits from the users table
            const { data: userRecord, error: creditsError } = await supabase
                .from('users')
                .select('credits')
                .eq('id', user.id)
                .single();

            if (creditsError) {
                console.error("Error fetching credits:", creditsError);
                setError("Failed to fetch credits. Please try again later.");
                return;
            }

            if (userRecord) {
                setCredits(userRecord.credits || 0);
            }

            setLoading(false);
        } catch (err) {
            console.error("Error in fetchUserData:", err);
            setError("An unexpected error occurred. Please try again later.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();

        // Check for purchase success parameter
        if (searchParams.get('purchase') === 'success') {
            setShowSuccessToast(true);
            // Hide toast after 5 seconds
            const timer = setTimeout(() => {
                setShowSuccessToast(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [searchParams]);

    return (
        <TransitionTemplate>
            <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#000000] text-white">
                <Navbar credits={credits} />

                <main className="container mx-auto px-4 pt-24 pb-12">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF3366] to-[#FF33A8] neon-text-red">
                                    Welcome, {userName}!
                                </h1>
                                <p className="text-[#94A3B8] mt-2">
                                    Transform your images with our AI-powered tools
                                </p>
                            </div>

                            <div className="mt-4 md:mt-0 flex items-center space-x-2 bg-[#0A0A0A] rounded-full px-4 py-2 border border-[#FF3366]/20">
                                <Coins className="h-5 w-5 text-[#FF3366]" />
                                <span className="text-white font-bold">{credits} credits</span>
                                <div className="flex items-center bg-[#0A0A0A] rounded-full px-3 py-1 text-sm border border-[#FF3366]/20">
                                    <span className="text-[#FF3366] text-xs ml-2">(2 credits per transform)</span>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg mb-6">
                                {error}
                            </div>
                        )}

                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="w-12 h-12 border-4 border-t-[#FF3366] border-r-[#FF33A8]/40 border-b-[#FF33A8] border-l-[#FF3366]/40 rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6">
                                <Card className="bg-[#0A0A0A] border border-[#FF3366]/20 shadow-lg neon-glow-red">
                                    <CardHeader>
                                        <CardTitle className="text-xl font-bold text-white">Image Transformer</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ImageTransformer userCredits={credits} onCreditsUpdate={fetchUserData} />
                                    </CardContent>
                                </Card>

                                {credits < 5 && (
                                    <Card className="bg-[#0A0A0A] border border-[#FF3366]/20 shadow-lg neon-glow-red">
                                        <CardContent className="p-6">
                                            <div className="flex flex-col md:flex-row items-center justify-between">
                                                <div className="mb-4 md:mb-0">
                                                    <h3 className="text-lg font-bold text-white">Low on credits?</h3>
                                                    <p className="text-[#94A3B8]">Purchase more credits to continue transforming images</p>
                                                </div>
                                                <Link href="/dashboard/purchase-credits">
                                                    <Button className="bg-gradient-to-r from-[#FF3366] to-[#FF33A8] text-white hover:shadow-lg hover:shadow-[#FF3366]/20 transition-all duration-300">
                                                        Buy Credits
                                                    </Button>
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        )}
                    </div>
                </main>

                <ToastProvider>
                    {showSuccessToast && (
                        <Toast className="bg-[#0A0A0A] border border-[#FF3366]/30 text-white neon-glow-red">
                            <div className="flex items-center space-x-2">
                                <Check className="h-5 w-5 text-[#FF3366]" />
                                <span>Credits purchased successfully!</span>
                            </div>
                        </Toast>
                    )}
                    <ToastViewport />
                </ToastProvider>
            </div>
        </TransitionTemplate>
    );
}
