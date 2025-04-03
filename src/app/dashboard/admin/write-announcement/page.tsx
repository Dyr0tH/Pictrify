"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Megaphone, SendIcon, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import TransitionTemplate from "@/components/TransitionTemplate";
import { supabase } from "@/utils/supabase/supabase-client";

export default function WriteAnnouncementPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCheckLoading, setAdminCheckLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAdminStatus = async () => {
      setAdminCheckLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth/login');
        return;
      }
      
      // Check if user is admin
      const { data, error } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', user.id)
        .single();
      
      if (error || !data) {
        router.push('/dashboard');
        return;
      }
      
      if (!data.is_admin) {
        router.push('/dashboard');
        return;
      }
      
      setIsAdmin(true);
      setAdminCheckLoading(false);
    };
    
    checkAdminStatus();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !message.trim()) {
      setError("Please fill in both the title and message fields");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('announcements')
        .insert([{ title, message }])
        .select();
      
      if (error) {
        throw error;
      }
      
      setSuccess(true);
      setTitle("");
      setMessage("");
      
      // Reset success state after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
    } catch (err: any) {
      console.error("Error creating announcement:", err);
      setError(err.message || "Failed to create announcement");
    } finally {
      setLoading(false);
    }
  };

  if (adminCheckLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#000000] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-[#FF3366] border-r-[#FF33A8]/40 border-b-[#FF33A8] border-l-[#FF3366]/40 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!isAdmin) {
    return null; // Will redirect in useEffect
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
              <Link href="/dashboard/admin">
                <Button 
                  variant="ghost" 
                  className="text-[#94A3B8] hover:text-[#FF3366] flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Admin</span>
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <header className="mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF3366]/20 to-[#FF33A8]/20 flex items-center justify-center">
                  <Megaphone className="h-6 w-6 text-[#FF3366]" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF3366] to-[#FF33A8]">
                    Create Announcement
                  </h1>
                  <p className="text-[#94A3B8]">
                    Share important news and updates with your users
                  </p>
                </div>
              </div>
            </header>

            <Card className="bg-gradient-to-br from-[#0A0A0A] to-[#000000] border border-[#334155]/30 shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[#0A0A0A] opacity-80 z-0"></div>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF3366]/5 to-[#FF33A8]/5 opacity-100 blur-sm z-0"></div>
              
              <CardHeader className="relative z-10">
                <CardTitle className="text-xl font-bold text-white">New Announcement</CardTitle>
                <CardDescription className="text-[#94A3B8]">
                  Fill in the details below to create a new announcement
                </CardDescription>
              </CardHeader>
              
              <CardContent className="relative z-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-[#94A3B8]">Announcement Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="bg-[#0A0A0A] border-[#334155]/50 focus:border-[#FF3366] focus:ring-[#FF3366]/20 text-white"
                      placeholder="Enter announcement title"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-[#94A3B8]">Announcement Message</Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="bg-[#0A0A0A] border-[#334155]/50 focus:border-[#FF3366] focus:ring-[#FF3366]/20 text-white min-h-[200px]"
                      placeholder="Enter announcement message..."
                    />
                  </div>
                  
                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-md">
                      <div className="flex items-center text-red-400 text-sm">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        <span>{error}</span>
                      </div>
                    </div>
                  )}
                  
                  {success && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-md">
                      <div className="flex items-center text-emerald-400 text-sm">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        <span>Announcement created successfully!</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-end pt-4">
                    <Button 
                      type="submit"
                      className="bg-gradient-to-r from-[#FF3366] to-[#FF33A8] text-white hover:shadow-lg hover:shadow-[#FF3366]/20 hover:from-[#FF33A8] hover:to-[#FF3366] transition-all duration-300 disabled:opacity-50"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Publishing...
                        </>
                      ) : (
                        <>
                          <SendIcon className="h-4 w-4 mr-2" />
                          Publish Announcement
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
              
              <CardFooter className="relative z-10 border-t border-[#334155]/30 mt-6">
                <div className="w-full flex justify-between items-center">
                  <Link href="/announcements" target="_blank" className="text-[#94A3B8] hover:text-[#FF3366] transition-colors text-sm flex items-center mt-5">
                    <span>View all announcements</span>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </TransitionTemplate>
  );
} 