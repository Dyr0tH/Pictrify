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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#000000] text-white">
        <div className="w-12 h-12 border-4 border-t-[#FF3366] border-r-[#FF33A8]/40 border-b-[#FF33A8] border-l-[#FF3366]/40 rounded-full animate-spin"></div>
      </div>
    );
  }

  return children;
} 