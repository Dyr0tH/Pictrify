"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/supabase-client";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/auth/login?redirect=/dashboard/admin');
  }
  
  // Check admin status
  const { data } = await supabase.from('users').select('is_admin').eq('id', user.id).single();
  
  if (!data?.is_admin) {
    redirect('/dashboard?error=unauthorized');
  }
  
  // Render admin page content
} 