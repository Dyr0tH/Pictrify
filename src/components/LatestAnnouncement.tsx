"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Megaphone, ArrowRight, CalendarIcon } from "lucide-react";
import { supabase } from "@/utils/supabase/supabase-client";
import { format } from "date-fns";
import Link from "next/link";

interface Announcement {
  id: number;
  title: string;
  message: string;
  created_at: string;
}

export default function LatestAnnouncement() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestAnnouncement = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('announcements')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
          throw error;
        }
        
        setAnnouncement(data || null);
      } catch (err) {
        console.error("Error fetching latest announcement:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLatestAnnouncement();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM dd, yyyy");
    } catch (error) {
      return "Unknown date";
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8 rounded-2xl bg-gradient-to-br from-[#0A0A0A] to-[#000000] border border-[#334155]/50 flex items-center justify-center h-32">
        <div className="w-8 h-8 border-3 border-t-[#FF3366] border-r-[#FF33A8]/40 border-b-[#FF33A8] border-l-[#FF3366]/40 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!announcement) {
    return null; // Don't show anything if there are no announcements
  }

  const truncateMessage = (message: string, maxLength: number = 150) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + "...";
  };

  return (
    <div className="max-w-4xl mx-auto mb-16 md:mb-24">
      <Card className="bg-gradient-to-br from-[#0A0A0A] to-[#000000] border border-[#334155]/30 hover:border-[#FF3366]/30 transition-all duration-300 overflow-hidden rounded-2xl">
        <div className="absolute h-1 w-full top-0 left-0 bg-gradient-to-r from-[#FF3366] to-[#FF33A8]"></div>
        <div className="flex items-start p-6">
          <div className="w-12 h-12 rounded-full bg-[#FF3366]/10 flex items-center justify-center mr-6 mt-1 flex-shrink-0">
            <Megaphone className="h-6 w-6 text-[#FF3366]" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-1">Latest Announcement</h3>
                <h2 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF3366] to-[#FF33A8]">
                  {announcement.title}
                </h2>
              </div>
              <div className="flex items-center text-[#94A3B8] text-sm">
                <CalendarIcon className="h-4 w-4 mr-1 text-[#FF33A8]" />
                {formatDate(announcement.created_at)}
              </div>
            </div>
            <p className="text-[#94A3B8] mb-4 whitespace-pre-line">
              {truncateMessage(announcement.message)}
            </p>
            <div className="flex justify-end">
              <Link href="/announcements">
                <Button
                  className="bg-gradient-to-r from-[#FF3366] to-[#FF33A8] text-white hover:from-[#FF33A8] hover:to-[#FF3366] transition-all duration-300 shadow-md hover:shadow-[#FF3366]/20 rounded-full"
                >
                  <span>Read All Announcements</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
} 