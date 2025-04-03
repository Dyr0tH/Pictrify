"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/supabase-client";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        // 1. Check if user is logged in
        const { data, error } = await supabase.auth.getSession();
        
        if (error || !data.session) {
          // Not logged in, redirect to login
          router.push("/auth/login");
          return;
        }
        
        // 2. Check if user is admin
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('is_admin')
          .eq('id', data.session.user.id)
          .single();
        
        if (userError || !userData || !userData.is_admin) {
          // Not admin, redirect to dashboard
          router.push("/dashboard");
          return;
        }
        
        // User is logged in and admin, show content
        setLoading(false);
      } catch (err) {
        // On error, redirect to dashboard
        router.push("/dashboard");
      }
    };
    
    checkAdmin();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#121212] to-[#1A1A1A] text-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-[#FF3366]/30 mb-4"></div>
          <div className="h-4 w-48 bg-[#FF3366]/30 rounded"></div>
        </div>
      </div>
    );
  }

  return children;
} 