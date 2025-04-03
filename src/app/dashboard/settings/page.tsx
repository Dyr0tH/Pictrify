"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/supabase-client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, User, Save } from "lucide-react";
import Link from "next/link";
import TransitionTemplate from "@/components/TransitionTemplate";

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        if (user.user_metadata?.full_name) {
          setName(user.user_metadata.full_name);
        }
        setEmail(user.email || "");
      }
    };

    getUserData();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: name }
      });

      if (error) {
        throw error;
      }

      setSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

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
              <Link href="/dashboard">
                <Button 
                  variant="ghost" 
                  className="text-[#94A3B8] hover:text-[#FF3366] flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Dashboard</span>
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <header className="mb-8 text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#FF3366] to-[#FF33A8]">Account Settings</h1>
              <p className="text-[#94A3B8] text-lg">
                Manage your profile and account preferences
              </p>
            </header>

            <Card className="bg-gradient-to-br from-[#0A0A0A] to-[#000000] border border-[#334155]/30 shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[#0A0A0A] opacity-80 z-0"></div>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF3366]/5 to-[#FF33A8]/5 opacity-100 blur-sm z-0"></div>
              
              <CardHeader className="relative z-10">
                <div className="flex justify-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-r from-[#FF3366]/20 to-[#FF33A8]/20 border border-[#FF3366]/30 flex items-center justify-center shadow-lg">
                    <User className="h-8 w-8 text-[#FF3366]" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-white text-center">Profile Settings</CardTitle>
                <CardDescription className="text-[#94A3B8] text-center">Update your personal information</CardDescription>
              </CardHeader>
              
              <CardContent className="relative z-10">
                <form onSubmit={handleUpdate} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[#94A3B8]">Full Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-[#0A0A0A] border-[#334155]/50 focus:border-[#FF3366] focus:ring-[#FF3366]/20 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[#94A3B8]">Email</Label>
                    <Input
                      id="email"
                      value={email}
                      disabled
                      className="bg-[#0A0A0A] border-[#334155]/50 text-[#94A3B8] cursor-not-allowed"
                    />
                    <p className="text-[#94A3B8] text-xs mt-1">Email cannot be changed</p>
                  </div>
                  
                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-md">
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}
                  
                  {success && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-md">
                      <p className="text-emerald-400 text-sm">Profile updated successfully!</p>
                    </div>
                  )}
                  
                  <Button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#FF3366] to-[#FF33A8] text-white py-3 rounded-lg hover:shadow-lg hover:shadow-[#FF3366]/20 transition-all duration-300 disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </TransitionTemplate>
  );
} 