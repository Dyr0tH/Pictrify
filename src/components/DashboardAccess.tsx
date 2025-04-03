"use client";

import { useState, useEffect, ReactNode } from "react";
import { supabase } from "@/utils/supabase/supabase-client";
import DashboardRestricted from "@/components/DashboardRestricted";

// Check if dashboard access is enabled based on the environment variable
const DASHBOARD_ACCESS = process.env.NEXT_PUBLIC_DASHBOARD_ACCESS === 'true';

interface DashboardAccessProps {
  children: ReactNode;
}

export default function DashboardAccess({ children }: DashboardAccessProps) {
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        // If dashboard access is enabled globally, we still need to check user authentication
        if (DASHBOARD_ACCESS) {
          // Check if user is logged in
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user) {
            setHasAccess(true);
          } else {
            setHasAccess(false);
          }
        } else {
          // Dashboard access is disabled globally, check if user is admin
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) {
            setHasAccess(false);
          } else {
            // Check if user is admin
            const { data, error } = await supabase
              .from('users')
              .select('is_admin')
              .eq('id', user.id)
              .single();
            
            if (error) {
              console.error('Error fetching user data:', error);
              setHasAccess(false);
            } else {
              // Allow access only if user is admin
              setHasAccess(data?.is_admin === true);
            }
          }
        }
      } catch (error) {
        console.error('Error checking dashboard access:', error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, []);

  // Show loading indicator while checking access
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#000000] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-[#FF3366] border-r-[#FF33A8]/40 border-b-[#FF33A8] border-l-[#FF3366]/40 rounded-full animate-spin"></div>
      </div>
    );
  }

  // If user doesn't have access, show the restricted component
  if (!hasAccess) {
    return <DashboardRestricted />;
  }

  // If user has access, render the dashboard content
  return <>{children}</>;
} 