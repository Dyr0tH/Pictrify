"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/supabase-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  RefreshCw,
  SearchIcon,
  DownloadIcon,
  CreditCard,
  Calendar,
  User,
  Tag,
} from "lucide-react";
import Link from "next/link";
import TransitionTemplate from "@/components/TransitionTemplate";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

interface Transaction {
  id?: string;
  user_id: string;
  amount: number;
  razorpay_id: string | null;
  created_at: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch only the essential columns
      const { data, error } = await supabase
        .from("transactions")
        .select("user_id, amount, razorpay_id, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setTransactions(data || []);
      
      // Calculate total amount
      if (data) {
        const total = data.reduce((sum, transaction) => sum + (transaction.amount || 0), 0);
        setTotalAmount(total);
      }
    } catch (err: any) {
      console.error("Error fetching transactions:", err);
      setError(err.message || "Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Filter transactions based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTransactions(transactions);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = transactions.filter(
      (transaction) =>
        transaction.razorpay_id?.toLowerCase().includes(query) ||
        transaction.user_id.toLowerCase().includes(query)
    );

    setFilteredTransactions(filtered);
  }, [searchQuery, transactions]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "PPP p"); // e.g., "Apr 29, 2023, 2:30 PM"
  };

  // Export transactions as CSV
  const exportTransactions = () => {
    const headers = ["ID", "User ID", "Amount", "Razorpay ID", "Created At"];
    const csvRows = [
      headers.join(","),
      ...filteredTransactions.map(t => [
        t.id,
        t.user_id,
        t.amount,
        t.razorpay_id || "N/A",
        new Date(t.created_at).toISOString()
      ].join(","))
    ];

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    link.setAttribute("href", url);
    link.setAttribute("download", `transactions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Truncate long IDs for display
  const truncateId = (id: string, length = 8) => {
    if (!id) return "N/A";
    if (id.length <= length * 2) return id;
    return `${id.substring(0, length)}...${id.substring(id.length - length)}`;
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
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF3366] to-[#FF33A8] group-hover:from-[#FF33A8] group-hover:to-[#FF3366] transition-all duration-300 font-['Righteous'] tracking-wider">
                  PICTRIFY
                </span>
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
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF3366] to-[#FF33A8] mb-2">
                  Transaction History
                </h1>
                <p className="text-[#94A3B8]">
                  View and manage all payment transactions
                </p>
              </div>
              <div className="mt-4 md:mt-0 space-x-2">
                <Button
                  onClick={exportTransactions}
                  className="bg-[#0A0A0A] border border-[#FF3366]/50 text-white hover:bg-[#FF3366]/15 transition-all duration-300"
                >
                  <DownloadIcon className="h-4 w-4 mr-2 text-[#FF3366]" />
                  <span>Export CSV</span>
                </Button>
              </div>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-[#0A0A0A] to-[#000000] border border-[#334155]/30 hover:border-[#FF3366]/30 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#94A3B8] text-sm mb-1">Total Transactions</p>
                      <p className="text-2xl font-bold text-white">{transactions.length}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-[#FF3366]/10 flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-[#FF3366]" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-[#0A0A0A] to-[#000000] border border-[#334155]/30 hover:border-[#FF3366]/30 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#94A3B8] text-sm mb-1">Total Revenue</p>
                      <p className="text-2xl font-bold text-white">{formatCurrency(totalAmount)}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-[#FF3366]/10 flex items-center justify-center">
                      <Tag className="h-6 w-6 text-[#FF3366]" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-[#0A0A0A] to-[#000000] border border-[#334155]/30 hover:border-[#FF3366]/30 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#94A3B8] text-sm mb-1">Unique Users</p>
                      <p className="text-2xl font-bold text-white">
                        {new Set(transactions.map(t => t.user_id)).size}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-[#FF3366]/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-[#FF3366]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filter */}
            <div className="mb-6 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#94A3B8]" size={18} />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by User ID or Razorpay ID..."
                className="bg-[#0A0A0A] border-[#334155]/50 pl-10 text-white focus:border-[#FF3366] w-full"
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="p-4 mb-6 bg-[#FF3366]/10 border border-[#FF3366]/30 rounded-md">
                <p className="text-[#FF3366]">{error}</p>
                <Button
                  onClick={fetchTransactions}
                  variant="outline"
                  size="sm"
                  className="mt-2 border-[#FF3366]/30 text-[#FF3366] hover:bg-[#FF3366]/10"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </div>
            )}

            {/* Loading state */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 border-4 border-t-[#FF3366] border-r-[#FF33A8]/40 border-b-[#FF33A8] border-l-[#FF3366]/40 rounded-full animate-spin mb-4"></div>
                <p className="text-[#94A3B8]">Loading transactions...</p>
              </div>
            )}

            {/* Transactions Table */}
            {!loading && filteredTransactions.length === 0 ? (
              <div className="text-center py-12 bg-[#0A0A0A] border border-[#334155]/30 rounded-lg">
                <div className="w-20 h-20 rounded-full bg-[#0A0A0A] flex items-center justify-center mx-auto mb-4 border border-[#FF3366]/20">
                  <CreditCard className="h-10 w-10 text-[#FF3366]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Transactions Found</h3>
                <p className="text-[#94A3B8] mb-6">
                  {searchQuery ? "No transactions match your search criteria." : "There are no transactions recorded yet."}
                </p>
                {searchQuery && (
                  <Button
                    onClick={() => setSearchQuery("")}
                    className="bg-gradient-to-r from-[#FF3366] to-[#FF33A8] text-white hover:shadow-lg hover:shadow-[#FF3366]/20 transition-all duration-300"
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            ) : !loading && (
              <div className="overflow-x-auto">
                <div className="bg-[#0A0A0A] border border-[#334155]/30 rounded-lg">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#334155]/30">
                        <th className="text-left py-4 px-4 text-[#94A3B8] font-medium">User ID</th>
                        <th className="text-left py-4 px-4 text-[#94A3B8] font-medium">Amount</th>
                        <th className="text-left py-4 px-4 text-[#94A3B8] font-medium">Razorpay ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map((transaction, index) => (
                        <tr 
                          key={transaction.id || `transaction-${index}`} 
                          className="border-b border-[#334155]/30 hover:bg-[#FF3366]/5 transition-colors"
                        >
                          <td className="py-4 px-4 text-white font-mono text-sm">
                            {truncateId(transaction.user_id)}
                          </td>
                          <td className="py-4 px-4 font-medium">
                            <span className="text-white">{formatCurrency(transaction.amount || 0)}</span>
                          </td>
                          <td className="py-4 px-4 text-[#94A3B8] font-mono text-sm">
                            {transaction.razorpay_id ? truncateId(transaction.razorpay_id) : "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Show info about filtered results */}
                {searchQuery && (
                  <div className="mt-4 text-[#94A3B8] text-sm flex justify-between items-center">
                    <p>Showing {filteredTransactions.length} of {transactions.length} transactions</p>
                    <Button
                      onClick={() => setSearchQuery("")} 
                      variant="outline"
                      size="sm"
                      className="border-[#334155]/50 text-[#94A3B8] hover:text-[#FF3366] hover:border-[#FF3366]/30"
                    >
                      Clear Search
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </TransitionTemplate>
  );
} 