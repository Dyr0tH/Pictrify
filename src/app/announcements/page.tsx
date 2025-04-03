"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Megaphone, ArrowLeft, CalendarIcon } from "lucide-react";
import TransitionTemplate from "@/components/TransitionTemplate";
import { supabase } from "@/utils/supabase/supabase-client";
import { format } from "date-fns";

interface Announcement {
  id: number;
  title: string;
  message: string;
  created_at: string;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('announcements')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        setAnnouncements(data || []);
      } catch (err: unknown) {
        console.error("Error fetching announcements:", err);
        setError(err instanceof Error ? err.message : "Failed to load announcements");
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnnouncements();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM dd, yyyy");
    } catch (formatError) {
      console.error("Error formatting date:", formatError);
      return "Unknown date";
    }
  };

  return (
    <TransitionTemplate>
      <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#000000] text-white">
        {/* Header */}
        <header className="bg-[#0A0A0A]/90 backdrop-blur-md shadow-lg border-b border-[#FF3366]/20">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2 group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF3366] to-[#FF33A8] flex items-center justify-center shadow-md group-hover:shadow-[#FF3366]/50 transition-all duration-300">
                  <span className="text-white font-bold text-xl">P</span>
                </div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF3366] to-[#FF33A8] group-hover:from-[#FF33A8] group-hover:to-[#FF3366] transition-all duration-300 font-['Righteous'] tracking-wider">PICTRIFY</span>
              </div>
              <Link href="/">
                <Button 
                  variant="ghost" 
                  className="text-[#94A3B8] hover:text-[#FF3366] flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Home</span>
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-12 pt-24">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-12">
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#FF3366]/20 to-[#FF33A8]/20 flex items-center justify-center mr-4">
                <Megaphone className="h-7 w-7 text-[#FF3366]" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF3366] to-[#FF33A8]">
                  Announcements
                </h1>
                <p className="text-[#94A3B8] mt-1">
                  Stay updated with the latest news and updates from PICTRIFY
                </p>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="w-12 h-12 border-4 border-t-[#FF3366] border-r-[#FF33A8]/40 border-b-[#FF33A8] border-l-[#FF3366]/40 rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-6 rounded-lg text-center">
                <p>{error}</p>
                <Button onClick={() => window.location.reload()} className="mt-4 bg-[#FF3366]/20 hover:bg-[#FF3366]/30 text-[#FF3366]">
                  Try Again
                </Button>
              </div>
            ) : announcements.length === 0 ? (
              <div className="text-center p-12 border border-[#334155]/30 rounded-lg bg-[#0A0A0A]">
                <Megaphone className="h-12 w-12 text-[#94A3B8] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Announcements Yet</h3>
                <p className="text-[#94A3B8]">Check back later for updates and news.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {announcements.map((announcement) => (
                  <Card key={announcement.id} className="bg-[#0A0A0A] border border-[#334155]/30 hover:border-[#FF3366]/30 transition-all duration-300 overflow-hidden group">
                    <div className="absolute h-1 w-full top-0 left-0 bg-gradient-to-r from-[#FF3366] to-[#FF33A8] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl font-bold text-white group-hover:text-[#FF3366] transition-colors">
                          {announcement.title}
                        </CardTitle>
                        <div className="flex items-center text-[#94A3B8] text-sm">
                          <CalendarIcon className="h-4 w-4 mr-1 text-[#FF33A8]" />
                          {formatDate(announcement.created_at)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-[#94A3B8] whitespace-pre-line">
                        {announcement.message}
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