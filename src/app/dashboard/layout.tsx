"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/supabase-client";
import DashboardAccess from "@/components/DashboardAccess";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simple session check
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        router.push("/auth/login");
        return;
      }
      
      setLoading(false);
    };

    checkSession();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#000000] text-white">
        <div className="w-12 h-12 border-4 border-t-[#FF3366] border-r-[#FF33A8]/40 border-b-[#FF33A8] border-l-[#FF3366]/40 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <DashboardAccess>
      {children}
    </DashboardAccess>
  );
} 