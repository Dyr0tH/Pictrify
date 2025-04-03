'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'
import TransitionTemplate from '@/components/TransitionTemplate'

export default function VerificationPage() {
    const router = useRouter()

    return (
        <TransitionTemplate>
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#000000] text-white">
                <div className="w-full max-w-md px-4 py-8">
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
                        <CardHeader className="text-center pb-6 relative z-10">
                            <div className="flex justify-center mb-6">
                                <div className="w-16 h-16 rounded-full bg-[#FF33A8]/10 flex items-center justify-center">
                                    <CheckCircle2 className="h-10 w-10 text-[#FF33A8]" />
                                </div>
                            </div>
                            <CardTitle className="text-2xl font-bold text-white">Check Your Email</CardTitle>
                            <CardDescription className="text-[#94A3B8] mt-2">
                                We've sent a verification link to your email address
                            </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="text-center relative z-10">
                            <div className="space-y-4">
                                <p className="text-[#94A3B8]">
                                    Please check your inbox and click on the verification link to complete your registration.
                                </p>
                                
                                <div className="bg-[#0A0A0A]/50 p-4 rounded-lg border border-[#334155]/30">
                                    <p className="text-sm text-[#94A3B8]">
                                        <span className="text-[#FF3366]">Note:</span> If you don't see the email in your inbox, please check your spam folder.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                        
                        <CardFooter className="flex flex-col space-y-4 pt-4 relative z-10">
                            <Button 
                                onClick={() => router.push('/auth/login')}
                                className="w-full bg-gradient-to-r from-[#FF3366] to-[#FF33A8] text-white hover:from-[#FF33A8] hover:to-[#FF3366] transition-all duration-300"
                            >
                                Go to Login
                            </Button>
                            
                            <p className="text-[#94A3B8] text-sm text-center">
                                Didn't receive an email?{' '}
                                <Link href="/auth/signup" className="text-[#FF3366] hover:text-[#FF33A8] transition-colors">
                                    Try again
                                </Link>
                            </p>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </TransitionTemplate>
    )
}
