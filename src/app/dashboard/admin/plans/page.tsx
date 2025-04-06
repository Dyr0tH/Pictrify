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
  RefreshCw,
  PlusCircle,
  Tag,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Save,
  Plus,
  Minus,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import TransitionTemplate from "@/components/TransitionTemplate";
import { Switch } from "@/components/ui/switch";

interface Plan {
  id: string;
  name: string;
  price: number;
  credits: number;
  popular: boolean;
  benefits: string[];
}

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  
  // New plan form state
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [credits, setCredits] = useState<number>(0);
  const [isPopular, setIsPopular] = useState(false);
  const [benefits, setBenefits] = useState<string[]>([]);
  const [newBenefit, setNewBenefit] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);

  const fetchPlans = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("plans")
        .select("*")
        .order("price", { ascending: true });

      if (error) {
        throw error;
      }

      setPlans(data || []);
    } catch (err: any) {
      console.error("Error fetching plans:", err);
      setError(err.message || "Failed to fetch plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleNewPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    setFormSuccess(false);

    // Validate inputs
    if (!name.trim()) {
      setFormError("Plan name is required");
      setFormLoading(false);
      return;
    }

    if (price < 0) {
      setFormError("Price must be a positive number");
      setFormLoading(false);
      return;
    }

    if (credits < 1) {
      setFormError("Credits must be at least 1");
      setFormLoading(false);
      return;
    }

    try {
      // Format data for insert/update
      const planData = {
        name: name.trim(),
        price: price,
        credits: credits,
        popular: isPopular,
        benefits: benefits.length > 0 ? benefits : null,
      };

      if (editMode && currentPlan) {
        // Update existing plan
        const { error: updateError } = await supabase
          .from("plans")
          .update(planData)
          .eq("id", currentPlan.id);

        if (updateError) {
          throw updateError;
        }
      } else {
        // Insert new plan
        const { error: insertError } = await supabase
          .from("plans")
          .insert([planData]);

        if (insertError) {
          throw insertError;
        }
      }

      // Success - reset form and refresh plans
      setFormSuccess(true);
      resetForm();
      fetchPlans();
    } catch (err: any) {
      console.error("Error saving plan:", err);
      setFormError(err.message || "Failed to save plan");
    } finally {
      setFormLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setPrice(0);
    setCredits(0);
    setIsPopular(false);
    setBenefits([]);
    setNewBenefit("");
    setEditMode(false);
    setCurrentPlan(null);
  };

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setBenefits([...benefits, newBenefit.trim()]);
      setNewBenefit("");
    }
  };

  const removeBenefit = (index: number) => {
    setBenefits(benefits.filter((_, i) => i !== index));
  };

  const editPlan = (plan: Plan) => {
    setCurrentPlan(plan);
    setName(plan.name);
    setPrice(plan.price);
    setCredits(plan.credits);
    setIsPopular(plan.popular);
    setBenefits(plan.benefits || []);
    setEditMode(true);
    setFormOpen(true);
    setFormError(null);
    setFormSuccess(false);
  };

  const deletePlan = async (id: string) => {
    if (!confirm("Are you sure you want to delete this plan?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("plans")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      // Refresh plans
      fetchPlans();
    } catch (err: any) {
      console.error("Error deleting plan:", err);
      setError(err.message || "Failed to delete plan");
    }
  };

  return (
    <TransitionTemplate>
      <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#000000] text-white">
        {/* Add custom styles to override focus ring color */}
        <style jsx global>{`
          input:focus-visible, button:focus-visible, textarea:focus-visible {
            outline: none !important;
            box-shadow: 0 0 0 2px #FF3366 !important;
            border-color: #FF3366 !important;
          }
        `}</style>
        
        {/* Header */}
        <header className="bg-[#0A0A0A]/90 backdrop-blur-md shadow-lg border-b border-[#FF3366]/20">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2 group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF3366] to-[#FF33A8] flex items-center justify-center shadow-md group-hover:shadow-[#FF3366]/50 transition-all duration-300">
                  <span className="text-white font-bold text-xl">P</span>
                </div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF3366] to-[#FF33A8] group-hover:from-[#FF33A8] group-hover:to-[#FF3366] transition-all duration-300 font-brand tracking-wider">
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
          <div className="max-w-6xl mx-auto">
            <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF3366] to-[#FF33A8] mb-2 tracking-display">
                  Subscription Plans
                </h1>
                <p className="text-[#94A3B8]">
                  Create and manage subscription plans for your users
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <Button
                  onClick={() => {
                    setFormOpen(!formOpen);
                    if (!formOpen) {
                      resetForm();
                    }
                  }}
                  className="bg-gradient-to-r from-[#FF3366] to-[#FF33A8] text-white hover:shadow-lg hover:shadow-[#FF3366]/20 transition-all duration-300"
                >
                  {formOpen ? (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      New Plan
                    </>
                  )}
                </Button>
              </div>
            </header>

            {/* New/Edit Plan Form */}
            {formOpen && (
              <Card className="bg-gradient-to-br from-[#0A0A0A] to-[#000000] border border-[#334155]/30 shadow-xl mb-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-[#0A0A0A] opacity-80 z-0"></div>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF3366]/5 to-[#FF33A8]/5 opacity-100 blur-sm z-0"></div>
                
                <CardHeader className="relative z-10">
                  <CardTitle className="text-2xl font-display font-bold text-white flex items-center space-x-2 tracking-display">
                    <CreditCard className="h-5 w-5 text-[#FF3366]" />
                    <span>{editMode ? "Edit Plan" : "Create New Plan"}</span>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="relative z-10">
                  <form onSubmit={handleNewPlan} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="planName" className="text-[#94A3B8]">Plan Name</Label>
                        <Input
                          id="planName"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="bg-[#0A0A0A] border-[#334155]/50 text-white focus:border-[#FF3366] font-satoshi"
                          placeholder="e.g. Basic Plan"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="planPrice" className="text-[#94A3B8]">Price (₹)</Label>
                        <Input
                          id="planPrice"
                          type="number"
                          min="0"
                          value={price}
                          onChange={(e) => setPrice(Number(e.target.value))}
                          className="bg-[#0A0A0A] border-[#334155]/50 text-white focus:border-[#FF3366]"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="planCredits" className="text-[#94A3B8]">Credits</Label>
                        <Input
                          id="planCredits"
                          type="number"
                          min="1"
                          value={credits}
                          onChange={(e) => setCredits(Number(e.target.value))}
                          className="bg-[#0A0A0A] border-[#334155]/50 text-white focus:border-[#FF3366]"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-[#94A3B8] block mb-2">Popular Plan</Label>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={isPopular}
                            onCheckedChange={setIsPopular}
                            className="data-[state=checked]:bg-[#FF3366]"
                          />
                          <Label className="text-[#94A3B8]">
                            {isPopular ? "Marked as popular" : "Not marked as popular"}
                          </Label>
                        </div>
                      </div>
                    </div>
                    
                    {/* Benefits Section */}
                    <div className="space-y-4 mt-6">
                      <Label className="text-[#94A3B8] text-lg">Plan Benefits</Label>
                      
                      <div>
                        <div className="flex space-x-2">
                          <Input
                            value={newBenefit}
                            onChange={(e) => setNewBenefit(e.target.value)}
                            placeholder="Add a benefit..."
                            className="bg-[#0A0A0A] border-[#334155]/50 text-white focus:border-[#FF3366]"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addBenefit();
                              }
                            }}
                          />
                          <Button
                            type="button"
                            onClick={addBenefit}
                            className="bg-[#FF3366]/20 hover:bg-[#FF3366]/30 text-[#FF3366]"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="mt-4 space-y-2">
                          {benefits.length === 0 ? (
                            <p className="text-[#94A3B8] text-sm italic">No benefits added yet</p>
                          ) : (
                            benefits.map((benefit, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-[#0A0A0A] border border-[#334155]/30 rounded-md">
                                <div className="flex items-center space-x-2">
                                  <CheckCircle className="h-4 w-4 text-[#FF3366]" />
                                  <span className="text-white">{benefit}</span>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeBenefit(index)}
                                  className="text-[#94A3B8] hover:text-[#FF3366] hover:bg-transparent p-1 h-auto"
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {formError && (
                      <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-md">
                        <p className="text-red-400 text-sm">{formError}</p>
                      </div>
                    )}
                    
                    {formSuccess && (
                      <div className="p-3 bg-[#FF3366]/10 border border-[#FF3366]/30 rounded-md">
                        <p className="text-[#FF3366] text-sm">Plan {editMode ? "updated" : "created"} successfully!</p>
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
                        className="bg-gradient-to-r from-[#FF3366] to-[#FF33A8] text-white hover:shadow-lg hover:shadow-[#FF3366]/20 transition-all duration-300 font-satoshi font-medium"
                        disabled={formLoading}
                      >
                        {formLoading ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            {editMode ? "Updating..." : "Creating..."}
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            {editMode ? "Update Plan" : "Create Plan"}
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Error message */}
            {error && (
              <div className="p-4 mb-6 bg-[#FF3366]/10 border border-[#FF3366]/30 rounded-md">
                <p className="text-[#FF3366] font-satoshi">{error}</p>
                <Button
                  onClick={fetchPlans}
                  variant="outline"
                  size="sm"
                  className="mt-2 border-[#FF3366]/30 text-[#FF3366] hover:bg-[#FF3366]/10 font-satoshi"
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
                <p className="text-[#94A3B8]">Loading plans...</p>
              </div>
            )}

            {/* Plans list */}
            {!loading && plans.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-[#0A0A0A] flex items-center justify-center mx-auto mb-4 border border-[#FF3366]/20">
                  <CreditCard className="h-10 w-10 text-[#FF3366]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Plans Yet</h3>
                <p className="text-[#94A3B8] mb-6">You haven't created any subscription plans yet</p>
                <Button
                  onClick={() => setFormOpen(true)}
                  className="bg-gradient-to-r from-[#FF3366] to-[#FF33A8] text-white hover:shadow-lg hover:shadow-[#FF3366]/20 transition-all duration-300"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Your First Plan
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {plans.map((plan) => (
                  <Card
                    key={plan.id}
                    className="bg-gradient-to-br from-[#0A0A0A] to-[#000000] border border-[#334155]/70 hover:border-[#FF3366]/40 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF3366]/20 to-[#FF33A8]/20 flex items-center justify-center text-[#FF3366]">
                            <CreditCard className="h-6 w-6" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="text-lg font-display font-bold text-white tracking-heading">
                                {plan.name}
                              </h3>
                              {plan.popular && (
                                <span className="text-xs bg-[#FF3366]/20 text-[#FF3366] px-2 py-1 rounded-full font-satoshi">
                                  Popular
                                </span>
                              )}
                            </div>
                            <p className="text-[#94A3B8] font-satoshi tracking-body">
                              ₹{plan.price} • {plan.credits} credits
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex-1 max-w-xl px-4">
                          <div className="flex flex-wrap gap-2">
                            {plan.benefits && plan.benefits.length > 0 ? (
                              plan.benefits.map((benefit, idx) => (
                                <span key={idx} className="text-xs bg-[#0A0A0A] border border-[#334155]/50 px-2 py-1 rounded-full text-[#94A3B8] font-satoshi">
                                  {benefit}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs italic text-[#94A3B8] font-satoshi">No benefits listed</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => editPlan(plan)}
                            className="border-[#334155]/50 text-[#94A3B8] hover:text-[#FF3366] hover:border-[#FF3366]/30"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deletePlan(plan.id)}
                            className="border-[#334155]/50 text-[#94A3B8] hover:text-red-400 hover:border-red-400/30"
                          >
                            <Trash2 className="h-4 w-4" />
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