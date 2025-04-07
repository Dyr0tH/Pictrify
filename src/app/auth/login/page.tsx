'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { supabase } from '@/utils/supabase/supabase-client'
import TransitionTemplate from '@/components/TransitionTemplate'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault()
        setLoading(true)
        setError(null)

        try {
            // Simple login
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                setError(error.message)
            } else {
                // Redirect after successful login
                router.push('/dashboard')
            }
        } catch (e: any) {
            setError(e.message || 'An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <TransitionTemplate>
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#000000] text-white">
                <div className="w-full max-w-md px-4">
                    <Link href="/" className="flex justify-center mb-8">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF3366] to-[#FF33A8] flex items-center justify-center">
                                <span className="text-white font-bold text-xl">P</span>
                            </div>
                            <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF3366] to-[#FF33A8] font-['Righteous'] tracking-wider">PICTRIFY</span>
                        </div>
                    </Link>
                    
                    <Card className="bg-[#0A0A0A] border border-[#334155]/50 shadow-xl relative overflow-hidden">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF3366]/5 to-[#FF33A8]/5 opacity-100 blur-sm z-0"></div>
                        <CardHeader className="text-center border-b border-[#334155]/30 pb-6 relative z-10">
                            <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
                            <CardDescription className="text-[#94A3B8]">Continue your artistic journey</CardDescription>
                        </CardHeader>
                        
                        <CardContent className="pt-6 relative z-10">
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-[#94A3B8]">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="bg-[#0A0A0A] border-[#334155] focus:border-[#FF3366] focus:ring-[#FF3366]/20 text-white"
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label htmlFor="password" className="text-[#94A3B8]">Password</Label>
                                        <Link href="/auth/password-reset" className="text-xs text-[#FF3366] hover:text-[#FF33A8] transition-colors">
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="********"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="bg-[#0A0A0A] border-[#334155] focus:border-[#FF3366] focus:ring-[#FF3366]/20 text-white"
                                    />
                                </div>
                                
                                {error && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-md">
                                        <p className="text-red-400 text-sm">{error}</p>
                                    </div>
                                )}
                                
                                <Button 
                                    type="submit" 
                                    className="w-full bg-gradient-to-r from-[#FF3366] to-[#FF33A8] text-white hover:from-[#FF33A8] hover:to-[#FF3366] transition-all duration-300" 
                                    disabled={loading}
                                >
                                    {loading ? 'Signing in...' : 'Sign In'}
                                </Button>
                            </form>
                        </CardContent>
                        
                        <CardFooter className="flex justify-center border-t border-[#334155]/30 pt-6 relative z-10">
                            <p className="text-[#94A3B8] text-sm">
                                New to PICTRIFY?{' '}
                                <Link href="/auth/signup" className="text-[#FF3366] hover:text-[#FF33A8] transition-colors">
                                    Create account
                                </Link>
                            </p>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </TransitionTemplate>
    )
}