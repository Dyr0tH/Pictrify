"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/supabase-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Percent,
  Calendar,
  Trash2,
  PlusCircle,
  Tag,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import TransitionTemplate from "@/components/TransitionTemplate";

interface DiscountData {
  id: string;
  code: string;
  discount_percent: number;
  max_uses: number | null;
  used: number;
  expires_at: string | null;
  created_at: string;
}

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<DiscountData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  
  // New discount form state
  const [code, setCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(10);
  const [maxUses, setMaxUses] = useState<string>("");
  const [expiryDate, setExpiryDate] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);

  const fetchDiscounts = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("discounts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setDiscounts(data || []);
    } catch (err: any) {
      console.error("Error fetching discounts:", err);
      setError(err.message || "Failed to fetch discounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const handleNewDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    setFormSuccess(false);

    // Validate inputs
    if (!code.trim()) {
      setFormError("Discount code is required");
      setFormLoading(false);
      return;
    }

    if (discountPercent < 1 || discountPercent > 100) {
      setFormError("Discount percent must be between 1 and 100");
      setFormLoading(false);
      return;
    }

    try {
      // Format data for insert
      const newDiscount = {
        code: code.toUpperCase(),
        discount_percent: discountPercent,
        max_uses: maxUses ? parseInt(maxUses) : null,
        used: 0,
        expires_at: expiryDate ? new Date(expiryDate).toISOString() : null,
      };

      // Check if code already exists
      const { data: existingCode } = await supabase
        .from("discounts")
        .select("code")
        .eq("code", newDiscount.code)
        .single();

      if (existingCode) {
        setFormError(`Discount code "${newDiscount.code}" already exists`);
        setFormLoading(false);
        return;
      }

      // Insert new discount
      const { error: insertError } = await supabase
        .from("discounts")
        .insert([newDiscount]);

      if (insertError) {
        throw insertError;
      }

      // Success - reset form and refresh discounts
      setFormSuccess(true);
      resetForm();
      fetchDiscounts();
    } catch (err: any) {
      console.error("Error creating discount:", err);
      setFormError(err.message || "Failed to create discount");
    } finally {
      setFormLoading(false);
    }
  };

  const resetForm = () => {
    setCode("");
    setDiscountPercent(10);
    setMaxUses("");
    setExpiryDate("");
  };

  const deleteDiscount = async (id: string) => {
    if (!confirm("Are you sure you want to delete this discount code?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("discounts")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      // Refresh discounts
      fetchDiscounts();
    } catch (err: any) {
      console.error("Error deleting discount:", err);
      setError(err.message || "Failed to delete discount");
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString();
  };

  const isExpired = (expiryDate: string | null) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const isMaxedOut = (used: number, max: number | null) => {
    if (max === null) return false;
    return used >= max;
  };

  return (
    <TransitionTemplate>
      <div className="min-h-screen bg-gradient-to-b from-[#1A1E2D] to-[#0D1117] text-white">
        {/* Add custom styles to override focus ring color */}
        <style jsx global>{`
          input:focus-visible, button:focus-visible {
            outline: none !important;
            box-shadow: 0 0 0 2px #FF6B6B !important;
            border-color: #FF6B6B !important;
          }
        `}</style>
        
        {/* Header */}
        <header className="bg-[#0D1117]/90 backdrop-blur-md shadow-lg border-b border-[#FF6B6B]/10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2 group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#FF33A8] flex items-center justify-center shadow-md group-hover:shadow-[#FF6B6B]/50 transition-all duration-300">
                  <span className="text-white font-bold text-xl">P</span>
                </div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF6B6B] to-[#FF33A8] group-hover:from-[#FF33A8] group-hover:to-[#FF6B6B] transition-all duration-300 font-['Righteous'] tracking-wider">
                  PICTRIFY
                </span>
              </div>
              <Link href="/dashboard/admin">
                <Button
                  variant="ghost"
                  className="text-[#94A3B8] hover:text-[#FF6B6B] flex items-center space-x-2"
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
          <div className="max-w-6xl mx-auto">
            <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF6B6B] to-[#FF33A8] mb-2">
                  Discount Codes
                </h1>
                <p className="text-[#94A3B8]">
                  Create and manage discount codes for your users
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <Button
                  onClick={() => setFormOpen(!formOpen)}
                  className="bg-gradient-to-r from-[#FF6B6B] to-[#FF33A8] text-white hover:shadow-lg hover:shadow-[#FF6B6B]/20 transition-all duration-300"
                >
                  {formOpen ? (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      New Discount
                    </>
                  )}
                </Button>
              </div>
            </header>

            {/* New Discount Form */}
            {formOpen && (
              <Card className="bg-gradient-to-br from-[#1E293B] to-[#0D1117] border border-[#334155]/30 shadow-xl mb-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-[#1E293B] opacity-80 z-0"></div>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF6B6B]/5 to-[#FF33A8]/5 opacity-100 blur-sm z-0"></div>
                
                <CardHeader className="relative z-10">
                  <CardTitle className="text-2xl font-bold text-white flex items-center space-x-2">
                    <Tag className="h-5 w-5 text-[#FF6B6B]" />
                    <span>Create New Discount Code</span>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="relative z-10">
                  <form onSubmit={handleNewDiscount} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="discountCode" className="text-[#94A3B8]">Discount Code</Label>
                        <div className="relative">
                          <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#94A3B8]" size={18} />
                          <Input
                            id="discountCode"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            className="bg-[#0D1117] border-[#334155]/50 pl-10 text-white focus:border-[#FF6B6B]"
                            placeholder="e.g. SUMMER2023"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="discountPercent" className="text-[#94A3B8]">Discount Percentage</Label>
                        <div className="relative">
                          <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#94A3B8]" size={18} />
                          <Input
                            id="discountPercent"
                            type="number"
                            min="1"
                            max="100"
                            value={discountPercent}
                            onChange={(e) => setDiscountPercent(Number(e.target.value))}
                            className="bg-[#0D1117] border-[#334155]/50 pl-10 text-white focus:border-[#FF6B6B]"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="maxUses" className="text-[#94A3B8]">
                          Max Uses <span className="text-[#94A3B8] text-xs">(Leave empty for unlimited)</span>
                        </Label>
                        <Input
                          id="maxUses"
                          type="number"
                          min="1"
                          value={maxUses}
                          onChange={(e) => setMaxUses(e.target.value)}
                          className="bg-[#0D1117] border-[#334155]/50 text-white focus:border-[#FF6B6B]"
                          placeholder="Unlimited"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate" className="text-[#94A3B8]">
                          Expiry Date <span className="text-[#94A3B8] text-xs">(Leave empty for no expiry)</span>
                        </Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#94A3B8]" size={18} />
                          <Input
                            id="expiryDate"
                            type="date"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            className="bg-[#0D1117] border-[#334155]/50 pl-10 text-white focus:border-[#FF6B6B]"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {formError && (
                      <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-md">
                        <p className="text-red-400 text-sm">{formError}</p>
                      </div>
                    )}
                    
                    {formSuccess && (
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-md">
                        <p className="text-emerald-400 text-sm">Discount code created successfully!</p>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-end space-x-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => { setFormOpen(false); resetForm(); }}
                        className="border-[#334155]/50 text-[#94A3B8] hover:text-white hover:bg-[#334155]/50"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-[#FF6B6B] to-[#FF33A8] text-white hover:shadow-lg hover:shadow-[#FF6B6B]/20 transition-all duration-300"
                        disabled={formLoading}
                      >
                        {formLoading ? "Creating..." : "Create Discount"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Error message */}
            {error && (
              <div className="p-4 mb-6 bg-red-500/10 border border-red-500/30 rounded-md">
                <p className="text-red-400">{error}</p>
                <Button
                  onClick={fetchDiscounts}
                  variant="outline"
                  size="sm"
                  className="mt-2 border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </div>
            )}

            {/* Loading state */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 border-4 border-t-[#FF6B6B] border-r-[#FF33A8]/40 border-b-[#FF33A8] border-l-[#FF6B6B]/40 rounded-full animate-spin mb-4"></div>
                <p className="text-[#94A3B8]">Loading discount codes...</p>
              </div>
            )}

            {/* Discounts list */}
            {!loading && discounts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-[#1E293B] flex items-center justify-center mx-auto mb-4">
                  <Tag className="h-10 w-10 text-[#94A3B8]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Discount Codes</h3>
                <p className="text-[#94A3B8] mb-6">You haven't created any discount codes yet</p>
                <Button
                  onClick={() => setFormOpen(true)}
                  className="bg-gradient-to-r from-[#FF6B6B] to-[#FF33A8] text-white hover:shadow-lg hover:shadow-[#FF6B6B]/20 transition-all duration-300"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Your First Discount
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {discounts.map((discount) => (
                  <Card
                    key={discount.id}
                    className={`bg-gradient-to-br from-[#1E293B] to-[#0D1117] border ${
                      isExpired(discount.expires_at) || isMaxedOut(discount.used, discount.max_uses)
                        ? "border-[#334155]/50 opacity-70"
                        : "border-[#334155]/70"
                    } transition-all duration-300 shadow-lg hover:shadow-xl`}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              isExpired(discount.expires_at) || isMaxedOut(discount.used, discount.max_uses)
                                ? "bg-[#334155]/20 text-[#94A3B8]"
                                : "bg-gradient-to-r from-[#FF6B6B]/20 to-[#FF33A8]/20 text-[#FF6B6B]"
                            }`}
                          >
                            <Tag className="h-6 w-6" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="text-lg font-mono font-bold text-white">
                                {discount.code}
                              </h3>
                              {(isExpired(discount.expires_at) || isMaxedOut(discount.used, discount.max_uses)) ? (
                                <span className="text-xs bg-[#334155] text-[#94A3B8] px-2 py-1 rounded-full">
                                  Inactive
                                </span>
                              ) : (
                                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full">
                                  Active
                                </span>
                              )}
                            </div>
                            <p className="text-[#94A3B8]">
                              {discount.discount_percent}% off
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-sm">
                          <div>
                            <p className="text-[#94A3B8]">Created</p>
                            <p className="text-white">{formatDate(discount.created_at)}</p>
                          </div>
                          <div>
                            <p className="text-[#94A3B8]">Expires</p>
                            <p className={`${isExpired(discount.expires_at) ? "text-red-400" : "text-white"}`}>
                              {formatDate(discount.expires_at)}
                            </p>
                          </div>
                          <div>
                            <p className="text-[#94A3B8]">Usage</p>
                            <p className={`${isMaxedOut(discount.used, discount.max_uses) ? "text-red-400" : "text-white"}`}>
                              {discount.used} / {discount.max_uses === null ? "∞" : discount.max_uses}
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteDiscount(discount.id)}
                            className="text-[#94A3B8] hover:text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </TransitionTemplate>
  );
} 