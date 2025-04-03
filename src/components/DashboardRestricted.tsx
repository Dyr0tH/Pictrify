"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import TransitionTemplate from "@/components/TransitionTemplate";

export default function DashboardRestricted() {
  return (
    <TransitionTemplate>
      <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#000000] flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-[#0A0A0A]/70 border border-[#334155]/50 rounded-2xl shadow-xl p-8 md:p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#FF3366]/20 to-[#FF33A8]/20 flex items-center justify-center mx-auto mb-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#FF3366]"
            >
              <path d="M10.1 2.182a10 10 0 0 1 3.8 0"></path>
              <path d="M13.9 21.818a10 10 0 0 1-3.8 0"></path>
              <path d="M17.609 3.721a10 10 0 0 1 2.69 2.7"></path>
              <path d="M3.701 17.579a10 10 0 0 1-2.7-2.69"></path>
              <path d="M20.279 6.42a10 10 0 0 1 1.521 3.88"></path>
              <path d="M2.2 13.7a10 10 0 0 1-1.522-3.88"></path>
              <path d="M21.8 10.3a10 10 0 0 1-1.521 3.88"></path>
              <path d="M3.7 6.42a10 10 0 0 1 2.7-2.69"></path>
              <path d="M17.609 20.279a10 10 0 0 1-2.7 2.69"></path>
              <path d="M6.42 20.28a10 10 0 0 1-2.7-2.7"></path>
              <path d="M12 12v-2"></path>
            </svg>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF3366] to-[#FF33A8] mb-4">
            Dashboard Under Maintenance
          </h1>
          
          <p className="text-[#94A3B8] text-lg mb-6">
            We're working on updating our services and crafting an even better experience for you. 
            The dashboard will be back soon with exciting new features.
          </p>
          
          <div className="mx-auto w-32 h-1 bg-gradient-to-r from-[#FF3366]/50 to-[#FF33A8]/50 rounded-full mb-6"></div>
          
          <p className="text-[#94A3B8] mb-8">
            Thank you for your patience. In the meantime, you can return to the homepage.
          </p>
          
          <Link href="/">
            <Button className="bg-gradient-to-r from-[#FF3366] to-[#FF33A8] text-white hover:from-[#FF33A8] hover:to-[#FF3366] transition-all duration-300 shadow-md hover:shadow-[#FF3366]/20 rounded-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span>Return to Homepage</span>
            </Button>
          </Link>
        </div>
      </div>
    </TransitionTemplate>
  );
} 