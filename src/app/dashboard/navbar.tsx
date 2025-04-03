"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/utils/supabase/supabase-client";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, CreditCard, ShieldCheck, Megaphone, Menu, MoreVertical, Home, Coins, Bell } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

interface NavbarProps {
  credits: number;
}

export default function Navbar({ credits }: NavbarProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Check if the user is an admin
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('is_admin')
          .eq('id', user.id)
          .single();
        
        if (!error && data && data.is_admin) {
          setIsAdmin(true);
        }
      }
    };

    checkAdmin();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-10 bg-[#0A0A0A]/90 backdrop-blur-md shadow-lg border-b border-[#FF3366]/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF3366] to-[#FF33A8] flex items-center justify-center shadow-md group-hover:shadow-[#FF3366]/50 transition-all duration-300 neon-glow-red">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF3366] to-[#FF33A8] group-hover:from-[#FF33A8] group-hover:to-[#FF3366] transition-all duration-300 font-['Righteous'] tracking-wider neon-text-red">PICTRIFY</span>
          </div>
          
          <div className="flex items-center space-x-4">
            
            {/* Admin Panel Link - Visible on both mobile and desktop */}
            {isAdmin && (
              <Link href="/dashboard/admin">
                <Button 
                  variant="ghost" 
                  className={`text-[#94A3B8] hover:text-[#FF3366] hover:bg-[#FF3366]/10 flex items-center space-x-2 ${
                    pathname?.startsWith('/dashboard/admin') ? 'bg-[#FF3366]/10 text-[#FF3366]' : ''
                  }`}
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span className="hidden md:inline">Admin Panel</span>
                </Button>
              </Link>
            )}
            
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-2">
              <Link href="/announcements">
                <Button 
                  variant="ghost" 
                  className={`text-[#94A3B8] hover:text-[#FF3366] hover:bg-[#FF3366]/10 flex items-center space-x-2 ${
                    pathname === '/announcements' ? 'bg-[#FF3366]/10 text-[#FF3366]' : ''
                  }`}
                >
                  <Megaphone className="h-4 w-4" />
                  <span className="hidden md:inline">Announcements</span>
                </Button>
              </Link>
              
              <Link href="/dashboard/purchase-credits">
                <Button 
                  variant="ghost" 
                  className={`text-[#94A3B8] hover:text-[#FF3366] hover:bg-[#FF3366]/10 flex items-center space-x-2 ${
                    pathname === '/dashboard/purchase-credits' ? 'bg-[#FF3366]/10 text-[#FF3366]' : ''
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  <span className="hidden md:inline">Buy Credits</span>
                </Button>
              </Link>
              
              <Link href="/dashboard/settings">
                <Button 
                  variant="ghost" 
                  className={`text-[#94A3B8] hover:text-[#FF3366] hover:bg-[#FF3366]/10 flex items-center space-x-2 ${
                    pathname === '/dashboard/settings' ? 'bg-[#FF3366]/10 text-[#FF3366]' : ''
                  }`}
                >
                  <Settings className="h-4 w-4" />
                  <span className="hidden md:inline">Settings</span>
                </Button>
              </Link>
              
              <Button 
                variant="ghost" 
                className="text-[#94A3B8] hover:text-[#FF3366] hover:bg-[#FF3366]/10 flex items-center space-x-2"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </div>
            
            {/* Mobile-only links */}
            <div className="flex md:hidden items-center space-x-2">
              <Link href="/dashboard/purchase-credits">
                <Button 
                  variant="ghost" 
                  className={`text-[#94A3B8] hover:text-[#FF3366] hover:bg-[#FF3366]/10 flex items-center ${
                    pathname === '/dashboard/purchase-credits' ? 'bg-[#FF3366]/10 text-[#FF3366]' : ''
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                </Button>
              </Link>
              
              {/* Mobile Menu Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="text-[#94A3B8] hover:text-[#FF3366] hover:bg-[#FF3366]/10 h-9 w-9 p-0"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="w-60 bg-[#0A0A0A] border border-[#FF3366]/30 rounded-lg shadow-lg shadow-[#FF3366]/5 text-white p-1" 
                  align="end"
                  sideOffset={12}
                >
                  <div className="py-1">                    
                    <DropdownMenuItem className="text-sm py-2.5 px-3 hover:bg-[#FF3366]/10 focus:bg-[#FF3366]/10 rounded-md cursor-pointer my-0.5">
                      <Link href="/dashboard/purchase-credits" className="flex items-center w-full">
                        <CreditCard className="h-4 w-4 mr-3 text-[#FF3366]" /> 
                        <span>Purchase Credits</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem className="text-sm py-2.5 px-3 hover:bg-[#FF3366]/10 focus:bg-[#FF3366]/10 rounded-md cursor-pointer my-0.5">
                      <Link href="/announcements" className="flex items-center w-full">
                        <Bell className="h-4 w-4 mr-3 text-[#FF3366]" /> 
                        <span>Announcements</span>
                      </Link>
                    </DropdownMenuItem>
                  </div>
                  
                  <DropdownMenuSeparator className="bg-[#FF3366]/10 my-1.5 mx-1" />
                  
                  <div className="py-1">
                    <DropdownMenuItem className="text-sm py-2.5 px-3 hover:bg-[#FF3366]/10 focus:bg-[#FF3366]/10 rounded-md cursor-pointer my-0.5">
                      <Link href="/dashboard/settings" className="flex items-center w-full">
                        <Settings className="h-4 w-4 mr-3 text-[#FF3366]" /> 
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem 
                      className="text-sm py-2.5 px-3 hover:bg-[#FF3366]/10 focus:bg-[#FF3366]/10 rounded-md cursor-pointer my-0.5"
                      onClick={handleLogout}
                    >
                      <div className="flex items-center w-full">
                        <LogOut className="h-4 w-4 mr-3 text-[#FF3366]" /> 
                        <span>Logout</span>
                      </div>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 