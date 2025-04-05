"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/supabase-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Tag, CreditCard, BarChart4, Ticket, Megaphone } from "lucide-react";
import Link from "next/link";
import TransitionTemplate from "@/components/TransitionTemplate";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTransformations: 0,
    totalCreditsPurchased: 0,
    activeDiscounts: 0
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      
      try {
        // Fetch total users
        const { count: userCount } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });

        // Fetch active discounts
        const { count: discountCount } = await supabase
          .from('discounts')
          .select('*', { count: 'exact', head: true })
          .gt('expires_at', new Date().toISOString());
        
        // Fetch transaction data
        const { data: transactionData } = await supabase
          .from('transactions')
          .select('amount');
        
        // Calculate total credits purchased
        const totalCredits = transactionData 
          ? transactionData.reduce((sum, transaction) => sum + (transaction.amount || 0), 0) 
          : 0;
        
        // Fetch transformations count (placeholder - adjust to your actual data structure)
        const transformationsCount = 250; // Replace with actual query when available
        
        // Set stats
        setStats({
          totalUsers: userCount || 0,
          totalTransformations: transformationsCount,
          totalCreditsPurchased: totalCredits,
          activeDiscounts: discountCount || 0
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
              <p className="text-[#94A3B8]">Manage your application and monitor key metrics</p>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {/* Total Users Card */}
              <Card className="bg-gradient-to-br from-[#0A0A0A] to-[#FF33A8]/30 border border-[#334155]/30 hover:border-[#FF3366]/30 transition-all duration-300 shadow-xl">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-[#FF3366]/10 flex items-center justify-center mb-2">
                    <Users className="h-6 w-6 text-[#FF3366]" />
                  </div>
                  <CardTitle className="text-lg text-white">Total Users</CardTitle>
                  <CardDescription className="text-[#94A3B8]">Registered accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-white">
                    {loading ? (
                      <div className="h-9 w-16 bg-[#334155]/50 animate-pulse rounded"></div>
                    ) : (
                      stats.totalUsers
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Total Transformations Card */}
              <Card className="bg-gradient-to-br from-[#0A0A0A] to-[#FF33A8]/30 border border-[#334155]/30 hover:border-[#FF33A8]/30 transition-all duration-300 shadow-xl">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-[#FF33A8]/10 flex items-center justify-center mb-2">
                    <BarChart4 className="h-6 w-6 text-[#FF33A8]" />
                  </div>
                  <CardTitle className="text-lg text-white">Transformations</CardTitle>
                  <CardDescription className="text-[#94A3B8]">Total processed</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-white">
                    {loading ? (
                      <div className="h-9 w-16 bg-[#334155]/50 animate-pulse rounded"></div>
                    ) : (
                      stats.totalTransformations
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Credits Purchased Card */}
              <Card className="bg-gradient-to-br from-[#0A0A0A] to-[#FF33A8]/30 border border-[#334155]/30 hover:border-[#FF3366]/30 transition-all duration-300 shadow-xl">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-[#FF3366]/10 flex items-center justify-center mb-2">
                    <CreditCard className="h-6 w-6 text-[#FF3366]" />
                  </div>
                  <CardTitle className="text-lg text-white">Credits Sold</CardTitle>
                  <CardDescription className="text-[#94A3B8]">Total purchased</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-white">
                    {loading ? (
                      <div className="h-9 w-16 bg-[#334155]/50 animate-pulse rounded"></div>
                    ) : (
                      stats.totalCreditsPurchased
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Active Discounts Card */}
              <Card className="bg-gradient-to-br from-[#0A0A0A] to-[#FF33A8]/30 border border-[#334155]/30 hover:border-[#FF33A8]/30 transition-all duration-300 shadow-xl">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-[#FF33A8]/10 flex items-center justify-center mb-2">
                    <Tag className="h-6 w-6 text-[#FF33A8]" />
                  </div>
                  <CardTitle className="text-lg text-white">Active Discounts</CardTitle>
                  <CardDescription className="text-[#94A3B8]">Valid codes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-white">
                    {loading ? (
                      <div className="h-9 w-16 bg-[#334155]/50 animate-pulse rounded"></div>
                    ) : (
                      stats.activeDiscounts
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Admin Menu */}
            <h2 className="text-xl font-semibold text-white mb-6">Admin Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="/dashboard/admin/discounts">
                <Card className="bg-[#0A0A0A] border border-[#334155]/30 hover:border-[#FF3366]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#FF3366]/10 h-full cursor-pointer">
                  <CardContent className="p-6 flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF3366]/20 to-[#FF33A8]/20 flex items-center justify-center">
                      <Ticket className="text-[#FF3366] h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Discount Codes</h3>
                      <p className="text-[#94A3B8]">Manage discount codes</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              
              <Link href="/dashboard/admin/users">
                <Card className="bg-[#0A0A0A] border border-[#334155]/30 hover:border-[#FF3366]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#FF3366]/10 h-full cursor-pointer">
                  <CardContent className="p-6 flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF3366]/20 to-[#FF33A8]/20 flex items-center justify-center">
                      <Users className="text-[#FF3366] h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">View Users</h3>
                      <p className="text-[#94A3B8]">Manage user accounts</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              
              <Link href="/dashboard/admin/transactions">
                <Card className="bg-[#0A0A0A] border border-[#334155]/30 hover:border-[#FF3366]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#FF3366]/10 h-full cursor-pointer">
                  <CardContent className="p-6 flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF3366]/20 to-[#FF33A8]/20 flex items-center justify-center">
                      <CreditCard className="text-[#FF3366] h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Transactions</h3>
                      <p className="text-[#94A3B8]">View payment history</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              
              <Link href="/dashboard/admin/write-announcement">
                <Card className="bg-[#0A0A0A] border border-[#334155]/30 hover:border-[#FF3366]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#FF3366]/10 h-full cursor-pointer">
                  <CardContent className="p-6 flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF3366]/20 to-[#FF33A8]/20 flex items-center justify-center">
                      <Megaphone className="text-[#FF3366] h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Write Announcement</h3>
                      <p className="text-[#94A3B8]">Create important news updates</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
            
            <div className="bg-gradient-to-r from-[#FF3366]/10 to-[#FF33A8]/10 border border-[#FF3366]/20 rounded-lg p-6 mt-8">
              <h3 className="text-xl font-bold text-white mb-2">Need Help?</h3>
              <p className="text-[#94A3B8]">
                For assistance with admin functions or to report issues, please contact the development team.
              </p>
            </div>
          </div>
        </main>
      </div>
    </TransitionTemplate>
  );
} 