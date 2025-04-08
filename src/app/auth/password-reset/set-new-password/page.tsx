'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { supabase } from '@/utils/supabase/supabase-client'
import TransitionTemplate from '@/components/TransitionTemplate'
import { Lock, CheckCircle } from 'lucide-react'

// Main component
function PasswordResetForm() {
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [isRecoveryMode, setIsRecoveryMode] = useState(false)
    const [tokenValidating, setTokenValidating] = useState(true) // Start with true as we validate on load
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        const setupSession = async () => {
            // Start token validation - show loading state
            setTokenValidating(true)

            // Get token from URL query parameter
            const tokenHash = searchParams.get('token')

            if (tokenHash) {
                try {
                    // Verify the OTP token
                    const { data, error } = await supabase.auth.verifyOtp({
                        token_hash: tokenHash,
                        type: 'recovery'
                    })

                    if (error) {
                        console.error('Error verifying token:', error.message)
                        setError('Invalid or expired reset link')
                    } else if (data.session) {
                        setIsRecoveryMode(true)
                    }
                } catch (e: any) {
                    console.error('Error in setupSession:', e.message)
                    setError('Failed to process reset link')
                }
            }

            // Also set up auth state change listener as a fallback
            const { data: { subscription } } = supabase.auth.onAuthStateChange((event, _session) => {
                if (event === 'PASSWORD_RECOVERY') {
                    setIsRecoveryMode(true)
                    // Token validation complete - add a slight delay before hiding the loading screen
                    setTimeout(() => {
                        setTokenValidating(false)
                    }, 1000) // Keep loading screen visible for 1 more second
                }
            })

            // Token validation complete - add a slight delay before hiding the loading screen
            setTimeout(() => {
                setTokenValidating(false)
            }, 1000) // Keep loading screen visible for 1 more second

            // Clean up subscription on unmount
            return () => {
                subscription.unsubscribe()
            }
        }

        setupSession()
    }, [searchParams])

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        // Validate passwords match
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match")
            setLoading(false)
            return
        }

        // Validate password strength
        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters long")
            setLoading(false)
            return
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            })

            if (error) {
                setError(error.message)
            } else {
                setSuccess(true)
                // Redirect to login after 3 seconds
                setTimeout(() => {
                    router.push('/auth/login')
                }, 3000)
            }
        } catch (e: any) {
            setError(e.message || 'An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    // If token is being validated, show loading screen
    if (tokenValidating) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#000000] text-white">
                <div className="w-full max-w-md px-4">
                    <div className="flex justify-center mb-8">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF3366] to-[#FF33A8] flex items-center justify-center">
                                <span className="text-white font-bold text-xl">P</span>
                            </div>
                            <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF3366] to-[#FF33A8] font-['Righteous'] tracking-wider">PICTRIFY</span>
                        </div>
                    </div>

                    <div className="bg-[#0A0A0A] border border-[#334155]/50 shadow-xl rounded-lg p-8 text-center relative overflow-hidden">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF3366]/5 to-[#FF33A8]/5 opacity-100 blur-sm z-0"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 border-4 border-t-[#FF3366] border-r-[#FF33A8]/40 border-b-[#FF33A8] border-l-[#FF3366]/40 rounded-full animate-spin mx-auto mb-4"></div>
                            <h3 className="text-xl font-semibold text-white mb-2">Verifying Reset Link...</h3>
                            <p className="text-[#94A3B8]">Please wait while we validate your password reset link.</p>
                        </div>
                    </div>
                </div>
            </div>
        )
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
                            <CardTitle className="text-2xl font-bold text-white">Set New Password</CardTitle>
                            <CardDescription className="text-[#94A3B8]">
                                {success ? 'Your password has been updated successfully' : 'Create a new password for your account'}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="pt-6 relative z-10">
                            {success ? (
                                <div className="text-center py-6">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FF3366]/10 flex items-center justify-center">
                                        <CheckCircle className="w-8 h-8 text-[#FF3366]" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Password Updated!</h3>
                                    <p className="text-[#94A3B8] mb-4">
                                        Your password has been successfully updated. You will be redirected to the login page.
                                    </p>
                                    <Link href="/auth/login">
                                        <Button variant="outline" className="w-full text-[#FF3366] border-[#FF3366]/70 hover:bg-[#FF3366]/15 hover:text-white hover:border-[#FF33A8] transition-all">
                                            Go to Login
                                        </Button>
                                    </Link>
                                </div>
                            ) : !isRecoveryMode ? (
                                <div className="text-center py-6">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                                        <Lock className="w-8 h-8 text-red-500" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Invalid Reset Link</h3>
                                    <p className="text-[#94A3B8] mb-4">
                                        This password reset link is invalid or has expired. Please request a new one.
                                    </p>
                                    <Link href="/password-reset">
                                        <Button className="w-full bg-gradient-to-r from-[#FF3366] to-[#FF33A8] text-white hover:from-[#FF33A8] hover:to-[#FF3366] transition-all duration-300">
                                            Request New Reset Link
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <form onSubmit={handleUpdatePassword} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword" className="text-[#94A3B8]">New Password</Label>
                                        <Input
                                            id="newPassword"
                                            type="password"
                                            placeholder="Enter your new password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                            className="bg-[#0A0A0A] border-[#334155] focus:border-[#FF3366] focus:ring-[#FF3366]/20 text-white"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword" className="text-[#94A3B8]">Confirm Password</Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="Confirm your new password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                                        {loading ? 'Updating...' : 'Update Password'}
                                    </Button>
                                </form>
                            )}
                        </CardContent>

                        <CardFooter className="flex justify-center border-t border-[#334155]/30 pt-6 relative z-10">
                            <p className="text-[#94A3B8] text-sm">
                                Remember your password?{' '}
                                <Link href="/auth/login" className="text-[#FF3366] hover:text-[#FF33A8] transition-colors">
                                    Sign in
                                </Link>
                            </p>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </TransitionTemplate>
    )
}

// Loading fallback component
function LoadingFallback() {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#000000] text-white">
            <div className="w-full max-w-md px-4">
                <div className="flex justify-center mb-8">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF3366] to-[#FF33A8] flex items-center justify-center">
                            <span className="text-white font-bold text-xl">P</span>
                        </div>
                        <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF3366] to-[#FF33A8] font-['Righteous'] tracking-wider">PICTRIFY</span>
                    </div>
                </div>

                <div className="bg-[#0A0A0A] border border-[#334155]/50 shadow-xl rounded-lg p-8 text-center">
                    <div className="w-12 h-12 border-4 border-t-[#FF3366] border-r-[#FF33A8]/40 border-b-[#FF33A8] border-l-[#FF3366]/40 rounded-full animate-spin mx-auto mb-4"></div>
                    <h3 className="text-xl font-semibold text-white mb-2">Loading...</h3>
                    <p className="text-[#94A3B8]">Please wait while we set up your password reset.</p>
                </div>
            </div>
        </div>
    )
}

// Main page component with Suspense boundary
export default function SetNewPasswordPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <PasswordResetForm />
        </Suspense>
    )
}