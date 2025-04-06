"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AnimatedContent from "@/blocks/Animations/AnimatedContent/AnimatedContent"
import AnimatedLink from '@/components/AnimatedLink'
import TransitionTemplate from '@/components/TransitionTemplate'
import { Menu, X, CheckCircle, ArrowRight, Brain, Shield, Mail, Github, TwitterIcon, Wand, MessageSquare, Instagram, Images } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/utils/supabase/supabase-client"
import PricingPlans from "@/components/PricingPlans"
import LatestAnnouncement from "@/components/LatestAnnouncement"

// Simple card component to replace TiltedCard
const StatCard = ({ title, value, description, color }: { title: string, value: string, description: string, color: string }) => (
  <Card className={`bg-gradient-to-br from-[#0A0A0A] to-[#000000] border border-[#334155]/30 hover:border-${color}/30 transition-all duration-300 rounded-xl overflow-hidden p-6`}>
    <div className="text-center">
      <p className={`text-${color} text-sm font-mono mb-2`}>{title}</p>
      <p className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#FF3366] to-[#FF33A8]">
        {value}
      </p>
      <p className="text-[#94A3B8] text-sm mt-2">{description}</p>
    </div>
  </Card>
);

export default function Page() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const checkAuth = async () => {
            setIsLoading(true)
            const { data: { user } } = await supabase.auth.getUser()
            
            if (user) {
                // User is logged in, redirect to dashboard
                router.push('/dashboard')
            } else {
                // User is not logged in, show homepage
                setIsLoading(false)
            }
        }
        
        checkAuth()
    }, [router])

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#000000] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-t-[#FF3366] border-r-[#FF33A8]/40 border-b-[#FF33A8] border-l-[#FF3366]/40 rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <TransitionTemplate>
            <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#000000] text-white">
                <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-md shadow-lg border-b border-[#FF3366]/20">
                    <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
                        <Link href="/" className="flex items-center space-x-2 group">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF3366] to-[#FF33A8] flex items-center justify-center shadow-md group-hover:shadow-[#FF3366]/30 transition-all duration-300">
                                <span className="text-white font-bold text-xl">P</span>
                            </div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF3366] to-[#FF33A8] group-hover:from-[#FF33A8] group-hover:to-[#FF3366] transition-all duration-300 font-['Righteous'] tracking-wider">PICTRIFY</span>
                        </Link>
                        
                        <div className="hidden md:flex items-center">
                            <div className="bg-[#FF3366]/10 px-3 py-1 rounded-full border border-[#FF3366]/20 mr-6">
                                <span className="text-white text-sm">Starting at <span className="text-[#FF3366] font-bold">₹50</span> • Save 70%</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center">
                            {/* Mobile menu button */}
                            <button 
                                className="md:hidden mr-4 text-[#94A3B8] hover:text-[#FF3366] transition-colors"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                aria-label="Toggle menu"
                            >
                                {mobileMenuOpen ? (
                                    <X size={24} />
                                ) : (
                                    <Menu size={24} />
                                )}
                            </button>
                            
                            {/* Desktop navigation */}
                            <div className="hidden md:flex items-center space-x-6">
                                <div className="flex space-x-6 mr-6">
                                    <Link href="#styles" className="text-[#94A3B8] hover:text-[#FF3366] transition-colors">Styles</Link>
                                    <Link href="#about-us" className="text-[#94A3B8] hover:text-[#FF3366] transition-colors">Technology</Link>
                                    <Link href="#services" className="text-[#94A3B8] hover:text-[#FF3366] transition-colors">Services</Link>
                                    <Link href="#pricing" className="text-[#94A3B8] hover:text-[#FF3366] transition-colors">Pricing</Link>
                                    <Link href="/announcements" className="text-[#94A3B8] hover:text-[#FF3366] transition-colors">Announcements</Link>
                                </div>
                                
                                <div className="flex space-x-4">
                                    <AnimatedLink href="/auth/login">
                                        <Button
                                            variant="outline"
                                            className="text-[#FF3366] border-[#FF3366]/70 hover:bg-[#FF3366]/15 hover:text-white hover:border-[#FF33A8] transition-all px-5"
                                        >Log In</Button>
                                    </AnimatedLink>
                                    <AnimatedLink href="/auth/signup">
                                        <Button className="bg-gradient-to-r from-[#FF3366] to-[#FF33A8] text-white hover:from-[#FF33A8] hover:to-[#FF3366] transition-all duration-300 px-5 shadow-md hover:shadow-[#FF3366]/30">Sign Up Free</Button>
                                    </AnimatedLink>
                                </div>
                            </div>
                            
                            {/* Mobile signup button (always visible) */}
                            <div className="md:hidden">
                                <AnimatedLink href="/auth/signup">
                                    <Button className="bg-gradient-to-r from-[#FF3366] to-[#FF33A8] text-white hover:from-[#FF33A8] hover:to-[#FF3366] transition-all duration-300 px-4 py-2 text-sm shadow-md hover:shadow-[#FF3366]/30">Sign Up Free</Button>
                                </AnimatedLink>
                            </div>
                        </div>
                    </nav>
                    
                    {/* Mobile menu dropdown */}
                    {mobileMenuOpen && (
                        <div className="md:hidden bg-[#0A0A0A] border-b border-[#FF3366]/30 shadow-lg">
                            <div className="container mx-auto px-4 py-4 space-y-4">
                                <div className="bg-[#FF3366]/10 px-3 py-2 rounded-md border border-[#FF3366]/20 mb-4">
                                    <p className="text-white text-sm">Starting at <span className="text-[#FF3366] font-bold">₹50</span> • Save 70%</p>
                                </div>
                                <Link href="#styles" className="block text-[#94A3B8] hover:text-[#FF3366] transition-colors py-2">Styles</Link>
                                <Link href="#about-us" className="block text-[#94A3B8] hover:text-[#FF3366] transition-colors py-2">Technology</Link>
                                <Link href="#services" className="block text-[#94A3B8] hover:text-[#FF3366] transition-colors py-2">Services</Link>
                                <Link href="#pricing" className="block text-[#94A3B8] hover:text-[#FF3366] transition-colors py-2">Pricing</Link>
                                <Link href="/announcements" className="block text-[#94A3B8] hover:text-[#FF3366] transition-colors py-2">Announcements</Link>
                                <div className="pt-2 border-t border-[#FF3366]/30">
                                    <AnimatedLink href="/auth/login">
                                        <Button
                                            variant="outline"
                                            className="w-full text-[#FF3366] border-[#FF3366]/70 hover:bg-[#FF3366]/15 hover:text-white hover:border-[#FF33A8] transition-all"
                                        >Log In</Button>
                                    </AnimatedLink>
                                </div>
                            </div>
                        </div>
                    )}
                </header>

                {/* Add padding to account for fixed header */}
                <div className="pt-20"></div>

                <main className="container mx-auto px-4 py-8 md:py-16">
                    {/* Hero Section */}
                    <section className="flex flex-col md:flex-row items-center mb-16 md:mb-24 gap-8">
                        <div className="md:w-1/2 text-center md:text-left w-full px-3 md:px-0">
                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#FF3366] to-[#FF33A8] leading-tight p-3">AI Art Without The ₹1800 Price Tag</h1>
                            <p className="text-lg sm:text-xl mb-6 md:mb-6 text-[#94A3B8] max-w-2xl mx-auto md:mx-0 leading-relaxed">
                                Transform your photos into stunning artwork with our AI-powered style transfer. Simple, affordable, and no monthly subscriptions.
                            </p>
                            
                            {/* New value proposition list */}
                            <div className="mb-8 space-y-4 text-left mx-auto md:mx-0 max-w-lg">
                                <div className="flex items-start space-x-3 bg-[#0A0A0A]/60 p-3 rounded-lg border border-[#FF3366]/20 hover:border-[#FF3366]/50 transition-all group">
                                    <div className="min-w-8 h-8 rounded-full bg-[#FF3366]/10 flex items-center justify-center group-hover:bg-[#FF3366]/20 transition-all">
                                        <span className="text-[#FF3366] font-bold">💸</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white text-base">Pay Only for What You Use</h3>
                                        <p className="text-[#94A3B8] text-sm">No bloated monthly fees. Buy credits, use them whenever you want.</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start space-x-3 bg-[#0A0A0A]/60 p-3 rounded-lg border border-[#FF3366]/20 hover:border-[#FF3366]/50 transition-all group">
                                    <div className="min-w-8 h-8 rounded-full bg-[#FF3366]/10 flex items-center justify-center group-hover:bg-[#FF3366]/20 transition-all">
                                        <span className="text-[#FF3366] font-bold">🖌️</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white text-base">Insta-Vibe with Prebuilt Styles</h3>
                                        <p className="text-[#94A3B8] text-sm">No more fiddling with complex prompts. Pick a vibe and transform.</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start space-x-3 bg-[#0A0A0A]/60 p-3 rounded-lg border border-[#FF3366]/20 hover:border-[#FF3366]/50 transition-all group">
                                    <div className="min-w-8 h-8 rounded-full bg-[#FF3366]/10 flex items-center justify-center group-hover:bg-[#FF3366]/20 transition-all">
                                        <span className="text-[#FF3366] font-bold">⚡</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white text-base">Built for Creators, Not Coders</h3>
                                        <p className="text-[#94A3B8] text-sm">Simple UI. Lightning fast. Just upload → pick style → transform → download.</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center sm:items-stretch">
                                <AnimatedLink href="/auth/signup" className="w-full sm:w-auto">
                                    <Button size="lg" className="bg-gradient-to-r from-[#FF3366] to-[#FF33A8] text-white hover:from-[#FF33A8] hover:to-[#FF3366] transition-all px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-full shadow-lg shadow-[#FF3366]/20 w-full">
                                        Start Creating Now
                                    </Button>
                                </AnimatedLink>
                                <div className="flex items-center justify-center px-4 py-2 space-x-1 w-full sm:w-auto text-center">
                                    <span className="text-white font-medium">Starting at just </span>
                                    <span className="text-[#FF3366] font-bold">₹50</span>
                                    <span className="text-[#94A3B8]"> for 20 credits</span>
                                </div>
                            </div>
                        </div>

                        {/* Update the hero image section */}
                        <div className="md:w-1/2 relative mt-8 md:mt-0 w-full">
                            <div className="absolute -inset-4 bg-gradient-to-r from-[#FF3366]/20 to-[#FF33A8]/20 rounded-3xl blur-xl"></div>
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#334155]/30">
                                <div className="bg-[#0A0A0A] w-full h-[300px] md:h-[400px] flex items-center justify-center">
                                    {/* Add a sample image transformation showcase here */}
                                    <div className="grid grid-cols-1 gap-4 p-4">
                                        <Image src="/styles/ghibili.jpg" alt="Original" width={700} height={300} className="rounded-3xl" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Latest Announcement */}
                    <LatestAnnouncement />
                    
                    {/* Price Comparison Section - NEW */}
                    <section className="mb-16 md:mb-24 px-3 md:px-0">
                        <div className="bg-gradient-to-r from-[#0A0A0A] to-[#000000] border border-[#FF3366]/30 rounded-2xl overflow-hidden shadow-xl relative">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF3366]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF33A8]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                            
                            <div className="px-4 sm:px-6 py-8 sm:py-10 md:p-12 relative z-10">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                    <div className="md:w-3/5 w-full">
                                        <div className="inline-block px-4 py-1 bg-[#FF3366]/10 rounded-full border border-[#FF3366]/30 text-[#FF3366] text-sm font-medium mb-4">
                                            🎨 Value Proposition
                                        </div>
                                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-white leading-tight">
                                            Why PICTRIFY is Smarter Than a <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF3366] to-[#FF33A8]">₹1800 Subscription</span>
                                        </h2>
                                        <p className="text-[#94A3B8] text-lg mb-6">
                                            Tired of shelling out ₹1600–₹1800 every month just to barely use image AI tools? Yeah... same. PICTRIFY flips the script.
                                        </p>
                                        <div className="mt-6 space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 rounded-full bg-[#FF3366]/20 flex items-center justify-center text-[#FF3366]">💯</div>
                                                <p className="text-white"><span className="font-medium">Get More. Spend Less.</span> <span className="text-[#94A3B8]">Our plans start at ₹50 for 20 credits—that's less than your coffee order ☕</span></p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 rounded-full bg-[#FF3366]/20 flex items-center justify-center text-[#FF3366]">🎁</div>
                                                <p className="text-white"><span className="font-medium">Bonus Credits for Early Users</span> <span className="text-[#94A3B8]">Sign up now to get bonus credits 👀</span></p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="md:w-2/5 w-full bg-[#0A0A0A] border border-[#FF3366]/20 p-6 rounded-xl shadow-lg mt-6 md:mt-0">
                                        <div className="flex justify-between items-center mb-6">
                                            <div>
                                                <h3 className="text-white font-bold text-xl">PICTRIFY</h3>
                                                <p className="text-[#94A3B8]">Pay-as-you-go</p>
                                            </div>
                                            <div className="bg-[#FF3366]/10 text-[#FF3366] px-3 py-1 rounded-full text-sm font-medium">
                                                Save 70%+
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-4 mb-6">
                                            <div className="flex justify-between pb-2 border-b border-[#334155]/30">
                                                <span className="text-[#94A3B8]">Monthly Cost</span>
                                                <span className="text-white font-bold text-xl">₹0</span>
                                            </div>
                                            <div className="flex justify-between pb-2 border-b border-[#334155]/30">
                                                <span className="text-[#94A3B8]">20 Transformations</span>
                                                <span className="text-white font-bold text-xl">₹50</span>
                                            </div>
                                            <div className="flex justify-between pb-2 border-b border-[#334155]/30">
                                                <span className="text-[#94A3B8]">Yearly Cost</span>
                                                <span className="text-white font-bold text-xl">As low as ₹600</span>
                                            </div>
                                        </div>
                                        
                                        <AnimatedLink href="/auth/signup" className="w-full block">
                                            <Button className="w-full bg-gradient-to-r from-[#FF3366] to-[#FF33A8] text-white hover:from-[#FF33A8] hover:to-[#FF3366] transition-all duration-300">
                                                Start Saving Now
                                            </Button>
                                        </AnimatedLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Art Styles Gallery Section */}
                    <section id="styles" className="mb-16 md:mb-24 px-3 md:px-0">
                        <div className="text-center mb-12">
                            <div className="inline-block px-4 py-1 bg-[#FF3366]/10 rounded-full border border-[#FF3366]/30 text-[#FF3366] text-sm font-medium mb-4">
                                PRESET STYLES
                            </div>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#FF3366] to-[#FF33A8] p-3">
                                One-Click Artistic Transformation
                            </h2>
                            <p className="text-lg text-[#94A3B8] max-w-3xl mx-auto">
                                No more fiddling with complex prompts or wasting time. Just pick a style and transform instantly.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {/* Style Cards - Replace with actual images later */}
                            {[
                                { 
                                    name: "Studio Ghibli", 
                                    description: "Magical anime style inspired by Studio Ghibli",
                                    imageUrl: "/styles/ghibili.jpg", // Add your image URL here
                                    badge: "POPULAR"
                                },
                                { 
                                    name: "Genshin Impact", 
                                    description: "Vibrant anime game art style",
                                    imageUrl: "/styles/genshin.jpg", // Add your image URL here
                                    badge: "TRENDING"
                                },
                                { 
                                    name: "GTA V", 
                                    description: "Modern realistic game art style",
                                    imageUrl: "/styles/gtav.jpg" // Add your image URL here
                                },
                                { 
                                    name: "Cyberpunk", 
                                    description: "Futuristic neon-noir aesthetic",
                                    imageUrl: "/styles/cyberpunk.jpg", // Add your image URL here
                                    badge: "NEW"
                                },
                                { 
                                    name: "Vaporwave", 
                                    description: "Retro-futuristic aesthetic with neon colors",
                                    imageUrl: "/styles/pixel.jpg", // Update with proper image
                                    badge: "HOT"
                                },
                                { 
                                    name: "Realistic", 
                                    description: "Photorealistic enhancement style",
                                    imageUrl: "/styles/oil.jpg" // Update with proper image
                                }
                            ].map((style, index) => (
                                <div key={index} className="group relative overflow-hidden rounded-xl transition-all duration-300 shadow-lg hover:shadow-[#FF3366]/20">
                                    <div className="aspect-[4/3] bg-[#0A0A0A] border border-[#334155]/50 group-hover:border-[#FF3366]/30 rounded-xl overflow-hidden transition-all duration-300">
                                        {style.imageUrl ? (
                                            <Image
                                                src={style.imageUrl}
                                                alt={style.name}
                                                width={400}
                                                height={300}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#FF3366]/10 to-[#FF33A8]/10">
                                                <span className="text-[#94A3B8]">Image Preview</span>
                                            </div>
                                        )}
                                    </div>
                                    {style.badge && (
                                        <div className="absolute top-3 right-3 bg-[#FF3366] text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                                            {style.badge}
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent opacity-0 group-hover:opacity-100 sm:group-hover:opacity-100 sm:opacity-0 opacity-100 transition-all duration-300 flex items-end p-4">
                                        <div className="w-full">
                                            <h3 className="text-white font-bold text-lg mb-1">{style.name}</h3>
                                            <p className="text-[#94A3B8] text-sm">{style.description}</p>
                                            <div className="mt-3 pt-3 border-t border-white/20">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[#94A3B8] text-xs">2 credits per transformation</span>
                                                    <span className="text-xs text-white bg-[#FF3366]/30 px-2 py-1 rounded-full">One Click</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-12 bg-[#0A0A0A] border border-[#334155]/30 p-6 rounded-xl">
                            <div className="text-center md:text-left">
                                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Transform Your Photos Now</h3>
                                <p className="text-[#94A3B8]">Start with 5 free credits when you sign up today</p>
                            </div>
                            <AnimatedLink href="/auth/signup" className="w-full md:w-auto">
                                <Button className="bg-gradient-to-r from-[#FF3366] to-[#FF33A8] text-white hover:from-[#FF33A8] hover:to-[#FF3366] transition-all duration-300 px-8 py-4 text-lg whitespace-nowrap w-full md:w-auto">
                                    Try It Free
                                </Button>
                            </AnimatedLink>
                        </div>
                    </section>

                    {/* About QuickArt Section */}
                    <section id="about-us" className="mb-16 md:mb-24 relative overflow-hidden px-3 md:px-0">
                        <div className="absolute inset-0 z-0 rounded-3xl">
                            <div className="absolute inset-0 bg-[#0A0A0A] opacity-70 rounded-3xl"></div>
                            {/* Keep existing grid background pattern */}
                        </div>

                        <div className="relative z-10 p-5 sm:p-8 md:p-14 rounded-3xl">
                            <div className="text-center mb-12 sm:mb-16">
                                <div className="inline-block px-4 py-1 bg-[#FF3366]/10 rounded-full border border-[#FF3366]/30 text-[#FF3366] text-sm font-medium mb-4">
                                    TECHNOLOGY
                                </div>
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#FF3366] to-[#FF33A8] p-3">Cutting-Edge AI Technology</h2>
                                <p className="text-lg md:text-xl text-[#94A3B8] max-w-3xl mx-auto">Powerful AI at a fraction of the cost of competitors</p>
                            </div>

                            <div className="max-w-6xl mx-auto">
                                <AnimatedContent
                                    distance={100}
                                    direction="horizontal"
                                    reverse={false}
                                    threshold={0.2}
                                    initialOpacity={0}
                                    animateOpacity
                                    scale={1}
                                >
                                    <div className="flex flex-col md:flex-row items-center mb-16 sm:mb-24 gap-8">
                                        <div className="md:w-2/5 flex justify-center mb-6 md:mb-0">
                                            <div className="relative">
                                                <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-[#FF3366]/20 to-[#FF3366]/5 blur-xl animate-pulse"></div>
                                                <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-[#0A0A0A] border border-[#334155]/50 flex items-center justify-center relative z-10">
                                                    <Brain className="text-[#FF3366] h-12 w-12 sm:h-16 sm:w-16" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="md:w-3/5 text-center md:text-left">
                                            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-white">Powered by Advanced AI</h3>
                                            <div className="h-1 w-20 bg-gradient-to-r from-[#FF3366] to-transparent mb-6 mx-auto md:mx-0 rounded-full"></div>
                                            <p className="text-[#94A3B8] text-base sm:text-lg leading-relaxed mb-4">
                                                Utilizing the latest AI vision capabilities and advanced image generation models, PICTRIFY delivers stunning artistic transformations with unparalleled quality at a fraction of the cost.
                                            </p>
                                            <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                                                <span className="bg-[#FF3366]/10 text-[#FF3366] px-3 py-1 rounded-full text-sm">Fast Processing</span>
                                                <span className="bg-[#FF3366]/10 text-[#FF3366] px-3 py-1 rounded-full text-sm">High Quality</span>
                                                <span className="bg-[#FF3366]/10 text-[#FF3366] px-3 py-1 rounded-full text-sm">Affordable</span>
                                            </div>
                                        </div>
                                    </div>
                                </AnimatedContent>

                                <AnimatedContent
                                    distance={100}
                                    direction="horizontal"
                                    reverse={true}
                                    threshold={0.2}
                                    initialOpacity={0}
                                    animateOpacity
                                    scale={1}
                                >
                                    <div className="flex flex-col md:flex-row-reverse items-center mb-16 sm:mb-24 gap-8">
                                        <div className="md:w-2/5 flex justify-center mb-6 md:mb-0">
                                            <div className="relative">
                                                <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-[#FF33A8]/20 to-[#FF33A8]/5 blur-xl animate-pulse"></div>
                                                <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-[#0A0A0A] border border-[#334155]/50 flex items-center justify-center relative z-10">
                                                    <Shield className="text-[#FF33A8] h-12 w-12 sm:h-16 sm:w-16" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="md:w-3/5 text-center md:text-left">
                                            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-white">Your Privacy Matters</h3>
                                            <div className="h-1 w-20 bg-gradient-to-r from-[#FF33A8] to-transparent mb-6 mx-auto md:mx-0 rounded-full"></div>
                                            <p className="text-[#94A3B8] text-base sm:text-lg leading-relaxed mb-4">
                                                We prioritize your privacy. Your images are processed in real-time and never stored on our servers. All transformations happen securely with enterprise-grade encryption.
                                            </p>
                                            <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                                                <span className="bg-[#FF33A8]/10 text-[#FF33A8] px-3 py-1 rounded-full text-sm">Real-time Processing</span>
                                                <span className="bg-[#FF33A8]/10 text-[#FF33A8] px-3 py-1 rounded-full text-sm">No Image Storage</span>
                                                <span className="bg-[#FF33A8]/10 text-[#FF33A8] px-3 py-1 rounded-full text-sm">Enterprise Security</span>
                                            </div>
                                        </div>
                                    </div>
                                </AnimatedContent>
                                
                                <div className="text-center">
                                    <AnimatedLink href="/auth/signup" className="block w-full sm:w-auto mx-auto">
                                        <Button className="bg-gradient-to-r from-[#FF3366] to-[#FF33A8] text-white hover:from-[#FF33A8] hover:to-[#FF3366] transition-all duration-300 px-8 py-4 text-lg w-full sm:w-auto">
                                            Get Started
                                        </Button>
                                    </AnimatedLink>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Services Section */}
                    <section id="services" className="mb-16 md:mb-24 px-3 md:px-0">
                        <div className="text-center mb-12">
                            <div className="inline-block px-4 py-1 bg-[#FF3366]/10 rounded-full border border-[#FF3366]/30 text-[#FF3366] text-sm font-medium mb-4">
                                BUILT FOR CREATORS
                            </div>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#FF3366] to-[#FF33A8] p-3">Simple Process, Stunning Results</h2>
                            <p className="text-lg text-[#94A3B8] max-w-3xl mx-auto">
                                No coding knowledge required. Our intuitive interface makes transformation a breeze.
                            </p>
                        </div>
                        
                        {/* Workflow Steps */}
                        <div className="max-w-6xl mx-auto">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-12">
                                {[
                                    {
                                        icon: "📤",
                                        step: "1",
                                        title: "Upload",
                                        description: "Drag & drop your image"
                                    },
                                    {
                                        icon: "🎨",
                                        step: "2",
                                        title: "Select Style",
                                        description: "Choose from prebuilt styles"
                                    },
                                    {
                                        icon: "✨",
                                        step: "3",
                                        title: "Transform",
                                        description: "AI works its magic"
                                    },
                                    {
                                        icon: "⬇️",
                                        step: "4",
                                        title: "Download",
                                        description: "Save your masterpiece"
                                    }
                                ].map((item, index) => (
                                    <div key={index} className="bg-[#0A0A0A] border border-[#334155]/30 rounded-xl p-3 sm:p-6 relative group hover:border-[#FF3366]/30 hover:shadow-lg hover:shadow-[#FF3366]/5 transition-all duration-300">
                                        <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#FF3366] flex items-center justify-center text-white font-bold text-sm">
                                            {item.step}
                                        </div>
                                        <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{item.icon}</div>
                                        <h3 className="text-white font-bold text-base sm:text-xl mb-1 sm:mb-2">{item.title}</h3>
                                        <p className="text-[#94A3B8] text-xs sm:text-sm">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Creator Focus Section */}
                            <div className="bg-[#0A0A0A] border border-[#334155]/30 rounded-xl overflow-hidden">
                                <div className="grid md:grid-cols-2 gap-0">
                                    <div className="p-5 sm:p-8 md:p-10">
                                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-6">Built for Creators, Not Coders</h3>
                                        <div className="space-y-5 sm:space-y-6">
                                            <div className="flex items-start space-x-3 sm:space-x-4">
                                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#FF3366]/10 flex items-center justify-center text-[#FF3366] mt-1 flex-shrink-0">⚡</div>
                                                <div>
                                                    <h4 className="text-white font-medium text-base sm:text-lg mb-1">Lightning Fast</h4>
                                                    <p className="text-[#94A3B8] text-sm">Get your transformed images in seconds, not minutes</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-start space-x-3 sm:space-x-4">
                                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#FF3366]/10 flex items-center justify-center text-[#FF3366] mt-1 flex-shrink-0">🧠</div>
                                                <div>
                                                    <h4 className="text-white font-medium text-base sm:text-lg mb-1">No Learning Curve</h4>
                                                    <p className="text-[#94A3B8] text-sm">Intuitive interface that anyone can master instantly</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-start space-x-3 sm:space-x-4">
                                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#FF3366]/10 flex items-center justify-center text-[#FF3366] mt-1 flex-shrink-0">💰</div>
                                                <div>
                                                    <h4 className="text-white font-medium text-base sm:text-lg mb-1">No Subscription Lock-in</h4>
                                                    <p className="text-[#94A3B8] text-sm">Pay for what you use, when you use it</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-8">
                                            <AnimatedLink href="/auth/signup" className="block w-full md:w-auto">
                                                <Button className="bg-gradient-to-r from-[#FF3366] to-[#FF33A8] text-white hover:from-[#FF33A8] hover:to-[#FF3366] transition-all px-8 py-3 w-full md:w-auto">
                                                    Sign Up Now
                                                </Button>
                                            </AnimatedLink>
                                        </div>
                                    </div>
                                    
                                    <div className="relative h-64 md:h-auto overflow-hidden bg-gradient-to-br from-[#0A0A0A] to-[#000000]">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="relative w-full h-full">
                                                <div className="absolute inset-0 bg-gradient-to-br from-[#FF3366]/20 to-[#FF33A8]/20 opacity-50"></div>
                                                <div className="absolute inset-0 flex items-center justify-center p-8">
                                                    <div className="w-full max-w-md bg-[#0A0A0A]/70 backdrop-blur-sm border border-[#FF3366]/20 rounded-xl p-6 transform rotate-3 hover:rotate-0 transition-all duration-300">
                                                        <div className="flex items-center space-x-3 mb-4">
                                                            <div className="w-3 h-3 rounded-full bg-[#FF3366]"></div>
                                                            <div className="w-3 h-3 rounded-full bg-[#FF33A8]"></div>
                                                            <div className="w-3 h-3 rounded-full bg-white/30"></div>
                                                        </div>
                                                        <div className="space-y-3">
                                                            <div className="h-6 bg-white/10 rounded-md w-3/4"></div>
                                                            <div className="h-6 bg-white/10 rounded-md w-1/2"></div>
                                                            <div className="h-6 bg-white/10 rounded-md w-2/3"></div>
                                                            <div className="h-10 bg-[#FF3366]/30 rounded-md w-1/3 mt-4"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mt-16">
                            <Card className="bg-[#0A0A0A] border border-[#334155]/50 hover:border-[#FF3366]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#FF3366]/10 rounded-xl overflow-hidden group h-full">
                                <CardHeader className="pb-2">
                                    <div className="w-14 h-14 rounded-full bg-[#FF3366]/10 flex items-center justify-center mb-4 group-hover:bg-[#FF3366]/20 transition-all">
                                        <Images className="text-[#FF3366] h-7 w-7"/>
                                    </div>
                                    <CardTitle className="text-xl md:text-2xl font-semibold text-white group-hover:text-[#FF3366] transition-colors">Image to Image</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-[#94A3B8]">
                                        Transform your photos into stunning artworks using our curated collection of artistic styles. From anime to oil paintings, give your images a unique artistic touch.
                                    </p>
                                    <div className="mt-6 pt-4 border-t border-[#334155]/30">
                                        <ul className="space-y-2">
                                            {["Multiple style presets", "High-quality output", "Instant processing", "Batch processing"].map((feature, i) => (
                                                <li key={i} className="flex items-start">
                                                    <CheckCircle className="text-[#FF33A8] h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                                                    <span className="text-[#94A3B8]">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-[#0A0A0A] border border-[#334155]/50 hover:border-[#FF33A8]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#FF33A8]/10 rounded-xl overflow-hidden group h-full">
                                <CardHeader className="pb-2">
                                    <div className="w-14 h-14 rounded-full bg-[#FF33A8]/10 flex items-center justify-center mb-4 group-hover:bg-[#FF33A8]/20 transition-all">
                                        <Wand className="text-[#FF33A8] h-7 w-7" />
                                    </div>
                                    <CardTitle className="text-xl md:text-2xl font-semibold text-white group-hover:text-[#FF33A8] transition-colors">Text to Image</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-[#94A3B8]">
                                        Bring your imagination to life with our text-to-image generation. Describe your vision, and watch as AI creates stunning artwork from your words.
                                    </p>
                                    <div className="mt-6 pt-4 border-t border-[#334155]/30">
                                        <ul className="space-y-2">
                                            {["Natural language input", "Style customization", "Multiple variations", "High resolution"].map((feature, i) => (
                                                <li key={i} className="flex items-start">
                                                    <CheckCircle className="text-[#FF33A8] h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                                                    <span className="text-[#94A3B8]">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-[#0A0A0A] border border-[#334155]/50 hover:border-[#FF3366]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#FF3366]/10 rounded-xl overflow-hidden group h-full">
                                <CardHeader className="pb-2">
                                    <div className="w-14 h-14 rounded-full bg-[#FF3366]/10 flex items-center justify-center mb-4 group-hover:bg-[#FF3366]/20 transition-all">
                                        <MessageSquare className="text-[#FF3366] h-7 w-7" />
                                    </div>
                                    <CardTitle className="text-xl md:text-2xl font-semibold text-white group-hover:text-[#FF3366] transition-colors">24/7 Support</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-[#94A3B8]">
                                        Our AI-powered support system is always available to help you with any questions or issues you might encounter during your creative journey.
                                    </p>
                                    <div className="mt-6 pt-4 border-t border-[#334155]/30">
                                        <ul className="space-y-2">
                                            {["Instant responses", "Technical support", "Style guidance", "Usage tips"].map((feature, i) => (
                                                <li key={i} className="flex items-start">
                                                    <CheckCircle className="text-[#FF33A8] h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                                                    <span className="text-[#94A3B8]">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    {/* Pricing Section */}
                    <section id="pricing" className="mb-16 md:mb-24 px-3 md:px-0">
                        <div className="text-center mb-12">
                            <div className="inline-block px-4 py-1 bg-[#FF3366]/10 rounded-full border border-[#FF3366]/30 text-[#FF3366] text-sm font-medium mb-4">
                                PAY ONLY FOR WHAT YOU USE
                            </div>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#FF3366] to-[#FF33A8] p-3">Simple & Affordable Pricing</h2>
                            <p className="text-lg text-[#94A3B8] max-w-3xl mx-auto">
                                No bloated monthly fees. No wasted money. Buy credits, use them whenever you want.
                            </p>
                        </div>

                        <div className="max-w-6xl mx-auto">
                            <div className="bg-[#0A0A0A] border border-[#FF3366]/20 rounded-xl overflow-hidden shadow-xl mb-8">
                                <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#334155]/30">
                                    <div className="p-6 sm:p-8 md:p-10">
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <h3 className="text-white font-bold text-lg sm:text-2xl mb-1">Other AI Services</h3>
                                                <p className="text-[#94A3B8] text-sm">Monthly Subscription</p>
                                            </div>
                                            <div className="bg-[#334155]/20 text-[#94A3B8] px-3 py-1 rounded-full text-sm">
                                                Expensive
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-4 mb-8">
                                            <div className="flex items-center pb-3 border-b border-[#334155]/30">
                                                <span className="text-[#94A3B8] mr-auto">Monthly Cost</span>
                                                <span className="text-white font-bold text-lg sm:text-xl">₹1600-₹1800</span>
                                            </div>
                                            <div className="flex items-center pb-3 border-b border-[#334155]/30">
                                                <span className="text-[#94A3B8] mr-auto">Unused Features</span>
                                                <span className="text-[#FF3366]">You still pay</span>
                                            </div>
                                            <div className="flex items-center pb-3 border-b border-[#334155]/30">
                                                <span className="text-[#94A3B8] mr-auto">Yearly Cost</span>
                                                <span className="text-white font-bold text-lg sm:text-xl">₹19,200+</span>
                                            </div>
                                            <div className="flex items-center pb-3 border-b border-[#334155]/30">
                                                <span className="text-[#94A3B8] mr-auto">Complex UI</span>
                                                <span className="text-[#FF3366]">Time wasting</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center justify-center p-4 bg-[#0A0A0A] border border-[#334155]/30 rounded-lg">
                                            <span className="text-[#94A3B8] text-center text-sm">Pay for everything, even if you use almost nothing</span>
                                        </div>
                                    </div>
                                    
                                    <div className="p-6 sm:p-8 md:p-10 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 bg-[#FF3366] text-white text-sm font-bold py-1 px-4 rounded-bl-lg">
                                            RECOMMENDED
                                        </div>
                                        
                                        <div className="flex items-center justify-between mb-6 mt-6 md:mt-0">
                                            <div>
                                                <h3 className="text-white font-bold text-lg sm:text-2xl mb-1">PICTRIFY</h3>
                                                <p className="text-[#94A3B8] text-sm">Pay As You Go</p>
                                            </div>
                                            <div className="bg-[#FF3366]/20 text-[#FF3366] px-3 py-1 rounded-full text-sm">
                                                Smart Choice
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-4 mb-8">
                                            <div className="flex items-center pb-3 border-b border-[#334155]/30">
                                                <span className="text-[#94A3B8] mr-auto">Monthly Cost</span>
                                                <span className="text-white font-bold text-lg sm:text-xl">₹0</span>
                                            </div>
                                            <div className="flex items-center pb-3 border-b border-[#334155]/30">
                                                <span className="text-[#94A3B8] mr-auto">20 Transformations</span>
                                                <span className="text-white font-bold text-lg sm:text-xl">Just ₹50</span>
                                            </div>
                                            <div className="flex items-center pb-3 border-b border-[#334155]/30">
                                                <span className="text-[#94A3B8] mr-auto">Estimated Yearly Cost</span>
                                                <span className="text-white font-bold text-lg sm:text-xl">₹600-₹1200</span>
                                            </div>
                                            <div className="flex items-center pb-3 border-b border-[#334155]/30">
                                                <span className="text-[#94A3B8] mr-auto">Simple UI</span>
                                                <span className="text-[#FF3366]">Save time & effort</span>
                                            </div>
                                        </div>
                                        
                                        <AnimatedLink href="/auth/signup" className="block w-full">
                                            <Button className="w-full bg-gradient-to-r from-[#FF3366] to-[#FF33A8] text-white hover:from-[#FF33A8] hover:to-[#FF3366] transition-all duration-300 py-4 text-lg">
                                                Start Saving Now
                                            </Button>
                                        </AnimatedLink>
                                    </div>
                                </div>
                            </div>
                            
                            <PricingPlans />
                        </div>
                    </section>
                    
                    {/* CTA Section */}
                    <section className="mb-16 md:mb-24 px-3 md:px-0">
                        <div className="bg-gradient-to-br from-[#0A0A0A] to-[#000000] border border-[#FF3366]/30 rounded-2xl overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF3366]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FF33A8]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                            
                            <div className="px-4 sm:px-6 py-10 sm:py-12 md:p-16 relative z-10">
                                <div className="max-w-4xl mx-auto text-center">
                                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#FF3366] to-[#FF33A8] leading-tight p-3">
                                        Ready to Transform Your Images Without Breaking the Bank?
                                    </h2>
                                    <p className="text-xl text-[#94A3B8] mb-8 max-w-2xl mx-auto">
                                        Join thousands of creators who are saving money while creating stunning AI art with PICTRIFY.
                                    </p>
                                    
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 items-center">
                                        <AnimatedLink href="/auth/signup" className="w-full sm:w-auto">
                                            <Button size="lg" className="bg-gradient-to-r from-[#FF3366] to-[#FF33A8] text-white hover:from-[#FF33A8] hover:to-[#FF3366] transition-all px-8 py-6 text-lg font-medium rounded-full shadow-lg shadow-[#FF3366]/20 w-full">
                                                Start Creating Now
                                            </Button>
                                        </AnimatedLink>
                                        <Link href="#pricing" className="flex items-center justify-center space-x-2 text-[#FF3366] hover:text-[#FF33A8] transition-all px-8 py-6 border border-[#FF3366]/30 rounded-full hover:border-[#FF33A8] text-lg font-medium w-full sm:w-auto">
                                            <span>View Pricing</span>
                                            <ArrowRight size={16} />
                                        </Link>
                                    </div>
                                    
                                    <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle className="text-[#FF33A8] h-5 w-5" />
                                            <span className="text-[#94A3B8]">No Credit Card Required</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle className="text-[#FF33A8] h-5 w-5" />
                                            <span className="text-[#94A3B8]">5 Free Credits</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle className="text-[#FF33A8] h-5 w-5" />
                                            <span className="text-[#94A3B8]">Cancel Anytime</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Updated Footer */}
                <footer className="bg-[#0A0A0A]/80 backdrop-blur-md border-t border-[#FF3366]/30">
                    <div className="container mx-auto px-4 py-12">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 sm:gap-12 mb-12">
                            <div className="md:col-span-4 space-y-6">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF3366] to-[#FF33A8] flex items-center justify-center shadow-md">
                                        <span className="text-white font-bold text-xl">P</span>
                                    </div>
                                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF3366] to-[#FF33A8] font-['Righteous'] tracking-wider">PICTRIFY</span>
                                </div>
                                <p className="text-[#94A3B8] text-sm leading-relaxed">
                                    Transform your photos into stunning artworks with AI-powered style transfer technology. Pay only for what you use—no bloated subscriptions.
                                </p>
                                <div className="pt-4">
                                    <div className="bg-[#0A0A0A] border border-[#FF3366]/20 p-4 rounded-lg">
                                        <p className="text-white font-medium mb-2">💰 Save up to 70% vs other AI services</p>
                                        <p className="text-[#94A3B8] text-sm mb-3">Starting at just ₹50 for 20 transformations</p>
                                        <AnimatedLink href="/auth/signup" className="block w-full">
                                            <Button className="w-full bg-gradient-to-r from-[#FF3366] to-[#FF33A8] text-white hover:from-[#FF33A8] hover:to-[#FF3366] transition-all duration-300 text-sm">
                                                Sign Up Free
                                            </Button>
                                        </AnimatedLink>
                                    </div>
                                </div>
                                <div className="flex space-x-4">
                                    <a href="#" className="w-10 h-10 rounded-full bg-[#0A0A0A] flex items-center justify-center text-[#94A3B8] hover:bg-[#FF3366]/20 hover:text-[#FF3366] transition-all duration-300">
                                        <TwitterIcon size={18} />
                                    </a>
                                    <a href="#" className="w-10 h-10 rounded-full bg-[#0A0A0A] flex items-center justify-center text-[#94A3B8] hover:bg-[#FF3366]/20 hover:text-[#FF3366] transition-all duration-300">
                                        <Instagram size={18} />
                                    </a>
                                </div>
                            </div>
                            
                            <div className="md:col-span-2">
                                <h3 className="text-white font-semibold mb-4 md:mb-6 text-lg">Quick Links</h3>
                                <ul className="space-y-3 md:space-y-4">
                                    <li><Link href="#styles" className="text-[#94A3B8] hover:text-[#FF3366] transition-colors text-sm">Styles</Link></li>
                                    <li><Link href="#about-us" className="text-[#94A3B8] hover:text-[#FF3366] transition-colors text-sm">Technology</Link></li>
                                    <li><Link href="#services" className="text-[#94A3B8] hover:text-[#FF3366] transition-colors text-sm">Services</Link></li>
                                    <li><Link href="#pricing" className="text-[#94A3B8] hover:text-[#FF3366] transition-colors text-sm">Pricing</Link></li>
                                    <li><Link href="/announcements" className="text-[#94A3B8] hover:text-[#FF3366] transition-colors text-sm">Announcements</Link></li>
                                </ul>
                            </div>
                            
                            <div className="md:col-span-3">
                                <h3 className="text-white font-semibold mb-4 md:mb-6 text-lg">Why PICTRIFY?</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-start space-x-2">
                                        <CheckCircle className="h-4 w-4 text-[#FF3366] mt-0.5 flex-shrink-0" />
                                        <span className="text-[#94A3B8] text-sm">Pay only for what you use</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <CheckCircle className="h-4 w-4 text-[#FF3366] mt-0.5 flex-shrink-0" />
                                        <span className="text-[#94A3B8] text-sm">No monthly subscriptions</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <CheckCircle className="h-4 w-4 text-[#FF3366] mt-0.5 flex-shrink-0" />
                                        <span className="text-[#94A3B8] text-sm">One-click transformations</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <CheckCircle className="h-4 w-4 text-[#FF3366] mt-0.5 flex-shrink-0" />
                                        <span className="text-[#94A3B8] text-sm">High quality output</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <CheckCircle className="h-4 w-4 text-[#FF3366] mt-0.5 flex-shrink-0" />
                                        <span className="text-[#94A3B8] text-sm">Simple, intuitive interface</span>
                                    </li>
                                </ul>
                            </div>
                            
                            <div className="md:col-span-3">
                                <h3 className="text-white font-semibold mb-4 md:mb-6 text-lg">Contact</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start space-x-3">
                                        <Mail className="h-5 w-5 text-[#FF3366] mt-0.5" />
                                        <span className="text-[#94A3B8] text-sm">support@pictrify.com</span>
                                    </li>
                                    <li className="flex items-start space-x-3">
                                        <MessageSquare className="h-5 w-5 text-[#FF3366] mt-0.5" />
                                        <span className="text-[#94A3B8] text-sm">Live Chat Support</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        
                        <div className="border-t border-[#334155]/30 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                            <p className="text-[#94A3B8] text-sm text-center md:text-left">
                                © {new Date().getFullYear()} PICTRIFY. All rights reserved.
                            </p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6">
                                <Link href="#" className="text-[#94A3B8] text-sm hover:text-[#FF3366] transition-colors">Privacy Policy</Link>
                                <Link href="#" className="text-[#94A3B8] text-sm hover:text-[#FF3366] transition-colors">Terms of Service</Link>
                                <Link href="#" className="text-[#94A3B8] text-sm hover:text-[#FF3366] transition-colors">Cookie Policy</Link>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </TransitionTemplate>
    )
}
