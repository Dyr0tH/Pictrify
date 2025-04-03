"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/supabase-client";

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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#1A1E2D] to-[#0D1117] text-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-[#FF6B6B]/30 mb-4"></div>
          <div className="h-4 w-48 bg-[#FF6B6B]/30 rounded"></div>
        </div>
      </div>
    );
  }

  return children;
} 