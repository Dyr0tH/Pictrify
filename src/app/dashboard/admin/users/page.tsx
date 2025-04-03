"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Users, Search, AlertCircle, UserCheck, Loader2 } from "lucide-react";
import TransitionTemplate from "@/components/TransitionTemplate";
import { format } from "date-fns";

interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  credits: number;
}

export default function ViewUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch("/api/fetch-users");
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch users");
        }
        
        if (data.success && data.users) {
          setUsers(data.users);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err: any) {
        console.error("Error fetching users:", err);
        setError(err.message || "An error occurred while fetching users");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <TransitionTemplate>
      <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#000000] text-white">
        {/* Header */}
        <header className="bg-[#0A0A0A]/90 backdrop-blur-md shadow-lg border-b border-[#FF3366]/20 sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2 group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF3366] to-[#FF33A8] flex items-center justify-center shadow-md group-hover:shadow-[#FF3366]/50 transition-all duration-300">
                  <span className="text-white font-bold text-xl">P</span>
                </div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF3366] to-[#FF33A8] group-hover:from-[#FF33A8] group-hover:to-[#FF3366] transition-all duration-300 font-['Righteous'] tracking-wider">PICTRIFY</span>
              </div>
              <Link href="/dashboard/admin">
                <Button 
                  variant="ghost" 
                  className="text-[#94A3B8] hover:text-[#FF3366] flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Admin</span>
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <header className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#FF3366] to-[#FF33A8]">
                    User Management
                  </h1>
                  <p className="text-[#94A3B8]">
                    View and manage all registered users
                  </p>
                </div>
                
                <div className="mt-4 md:mt-0 relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
                    <Input 
                      placeholder="Search by name or email" 
                      className="pl-10 bg-[#0A0A0A] border-[#334155]/50 focus:border-[#FF3366] text-white w-full md:w-80"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </header>
            
            <Card className="bg-[#0A0A0A] border border-[#334155]/30 shadow-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-[#0A0A0A] to-[#0A0A0A] border-b border-[#FF3366]/20 py-4">
                <CardTitle className="flex items-center text-xl font-bold text-white">
                  <Users className="h-5 w-5 mr-2 text-[#FF3366]" />
                  User List
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="h-10 w-10 text-[#FF3366] animate-spin mb-4" />
                    <p className="text-[#94A3B8]">Loading users...</p>
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
                    <p className="text-red-400 mb-2">Error loading users</p>
                    <p className="text-[#94A3B8] text-sm max-w-lg text-center px-4">{error}</p>
                    <div className="mt-6">
                      <Button 
                        onClick={() => window.location.reload()} 
                        className="bg-gradient-to-r from-[#FF3366] to-[#FF33A8] hover:from-[#FF33A8] hover:to-[#FF3366] text-white"
                      >
                        Try Again
                      </Button>
                    </div>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <Users className="h-12 w-12 text-[#94A3B8] mb-4" />
                    {searchTerm ? (
                      <p className="text-[#94A3B8]">No users found matching "{searchTerm}"</p>
                    ) : (
                      <p className="text-[#94A3B8]">No users found</p>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-[#1A1A1A] border-[#334155]/30">
                          <TableHead className="text-[#94A3B8] font-semibold">Name</TableHead>
                          <TableHead className="text-[#94A3B8] font-semibold">Email</TableHead>
                          <TableHead className="text-[#94A3B8] font-semibold">Signup Date</TableHead>
                          <TableHead className="text-[#94A3B8] font-semibold text-right">Credits</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user) => (
                          <TableRow key={user.id} className="hover:bg-[#1A1A1A] border-[#334155]/30">
                            <TableCell className="font-medium text-white">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF3366]/20 to-[#FF33A8]/20 flex items-center justify-center mr-2">
                                  <UserCheck className="h-4 w-4 text-[#FF33A8]" />
                                </div>
                                {user.full_name}
                              </div>
                            </TableCell>
                            <TableCell className="text-[#94A3B8]">{user.email}</TableCell>
                            <TableCell className="text-[#94A3B8]">{formatDate(user.created_at)}</TableCell>
                            <TableCell className="text-right">
                              <span className="bg-gradient-to-r from-[#FF3366]/10 to-[#FF33A8]/10 text-white font-semibold py-1 px-3 rounded-full border border-[#FF3366]/30">
                                {user.credits}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="mt-6 text-center">
              <p className="text-[#94A3B8] text-sm">
                Total Users: <span className="text-white font-semibold">{users.length}</span>
              </p>
            </div>
          </div>
        </main>
      </div>
    </TransitionTemplate>
  );
} 