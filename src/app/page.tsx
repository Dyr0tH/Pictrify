"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AnimatedContent from "@/blocks/Animations/AnimatedContent/AnimatedContent"
import AnimatedLink from '@/components/AnimatedLink'
import TransitionTemplate from '@/components/TransitionTemplate'
import { Menu, X, CheckCircle, ArrowRight, Brain, Heart, Users, BookOpen, BarChart4, Shield, Mail, Phone, MapPin, Github, TwitterIcon, Linkedin, ExternalLink, Clock, Lightbulb, Target, Wand, MessageSquare, Instagram, Images } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/utils/supabase/supabase-client"

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
                                    <Link href="#how-it-works" className="text-[#94A3B8] hover:text-[#FF3366] transition-colors">How It Works</Link>
                                    <Link href="#gallery" className="text-[#94A3B8] hover:text-[#FF3366] transition-colors">Gallery</Link>
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
                                        <Button className="bg-gradient-to-r from-[#FF3366] to-[#FF33A8] text-white hover:from-[#FF33A8] hover:to-[#FF3366] transition-all duration-300 px-5 shadow-md hover:shadow-[#FF3366]/30">Sign Up</Button>
                                    </AnimatedLink>
                                </div>
                            </div>
                            
                            {/* Mobile signup button (always visible) */}
                            <div className="md:hidden">
                                <AnimatedLink href="/auth/signup">
                                    <Button className="bg-gradient-to-r from-[#FF3366] to-[#FF33A8] text-white hover:from-[#FF33A8] hover:to-[#FF3366] transition-all duration-300 px-4 py-2 text-sm shadow-md hover:shadow-[#FF3366]/30">Sign Up</Button>
                                </AnimatedLink>
                            </div>
                        </div>
                    </nav>
                    
                    {/* Mobile menu dropdown */}
                    {mobileMenuOpen && (
                        <div className="md:hidden bg-[#0A0A0A] border-b border-[#FF3366]/30 shadow-lg">
                            <div className="container mx-auto px-4 py-4 space-y-4">
                                <Link href="#styles" className="block text-[#94A3B8] hover:text-[#FF3366] transition-colors py-2">Styles</Link>
                                <Link href="#how-it-works" className="block text-[#94A3B8] hover:text-[#FF3366] transition-colors py-2">How It Works</Link>
                                <Link href="#gallery" className="block text-[#94A3B8] hover:text-[#FF3366] transition-colors py-2">Gallery</Link>
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
                        <div className="md:w-1/2 text-center md:text-left">
                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#FF3366] to-[#FF33A8] leading-tight">Transform Your Photos Into Art</h1>
                            <p className="text-lg sm:text-xl mb-8 md:mb-10 text-[#94A3B8] max-w-2xl mx-auto md:mx-0 leading-relaxed">
                                Turn your photos into stunning artwork with our AI-powered style transfer. Choose from popular styles like Studio Ghibli, Anime, Genshin Impact, GTA V, and more!
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                <AnimatedLink href="/auth/signup">
                                    <Button size="lg" className="bg-gradient-to-r from-[#FF3366] to-[#FF33A8] text-white hover:from-[#FF33A8] hover:to-[#FF3366] transition-all px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-full shadow-lg shadow-[#FF3366]/20 w-full sm:w-auto">
                                        Start Creating
                                    </Button>
                                </AnimatedLink>
                                <Link href="#gallery" className="flex items-center justify-center space-x-2 text-[#FF3366] hover:text-[#FF33A8] transition-all px-4 py-2 border border-[#FF3366]/30 rounded-full hover:border-[#FF33A8] w-full sm:w-auto">
                                    <span>View Gallery</span>
                                    <ArrowRight size={16} />
                                </Link>
                            </div>
                            
                            {/* Trust indicators */}
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6 mt-8 md:mt-10">
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="text-[#FF33A8] h-5 w-5" />
                                    <span className="text-[#94A3B8]">Instant Results</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="text-[#FF33A8] h-5 w-5" />
                                    <span className="text-[#94A3B8]">Multiple Styles</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="text-[#FF33A8] h-5 w-5" />
                                    <span className="text-[#94A3B8]">High Quality</span>
                                </div>
                            </div>
                        </div>

                        {/* Update the hero image section */}
                        <div className="md:w-1/2 relative mt-8 md:mt-0">
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

                    {/* Art Styles Gallery Section */}
                    <section id="gallery" className="mb-16 md:mb-24">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#FF3366] to-[#FF33A8]">
                                Our Art Styles
                            </h2>
                            <p className="text-lg text-[#94A3B8] max-w-3xl mx-auto">
                                Transform your photos into various artistic styles with just a click
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Style Cards - Replace with actual images later */}
                            {[
                                { 
                                    name: "Studio Ghibli", 
                                    description: "Magical anime style inspired by Studio Ghibli",
                                    imageUrl: "/styles/ghibili.jpg" // Add your image URL here
                                },
                                { 
                                    name: "Genshin Impact", 
                                    description: "Vibrant anime game art style",
                                    imageUrl: "/styles/genshin.jpg" // Add your image URL here
                                },
                                { 
                                    name: "GTA V", 
                                    description: "Modern realistic game art style",
                                    imageUrl: "/styles/gtav.jpg" // Add your image URL here
                                },
                                { 
                                    name: "Cyberpunk", 
                                    description: "Futuristic neon-noir aesthetic",
                                    imageUrl: "/styles/cyberpunk.jpg" // Add your image URL here
                                },
                                { 
                                    name: "Pixel Art", 
                                    description: "Retro gaming style",
                                    imageUrl: "/styles/pixel.jpg" // Add your image URL here
                                },
                                { 
                                    name: "Oil Painting", 
                                    description: "Classical art style",
                                    imageUrl: "/styles/oil.jpg" // Add your image URL here
                                }
                            ].map((style, index) => (
                                <div key={index} className="group relative overflow-hidden rounded-xl">
                                    <div className="aspect-[4/3] bg-[#0A0A0A] border border-[#334155]/50 rounded-xl overflow-hidden">
                                        {style.imageUrl ? (
                                            <Image
                                                src={style.imageUrl}
                                                alt={style.name}
                                                width={400}
                                                height={300}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#FF3366]/10 to-[#FF33A8]/10">
                                                <span className="text-[#94A3B8]">Image Preview</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-4">
                                        <div>
                                            <h3 className="text-white font-bold text-lg mb-1">{style.name}</h3>
                                            <p className="text-[#94A3B8] text-sm">{style.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center mt-12">
                            <Button className="bg-gradient-to-r from-[#FF3366] to-[#FF33A8] text-white hover:from-[#FF33A8] hover:to-[#FF3366] transition-all duration-300 px-8 py-6 text-lg rounded-full">
                                Try It Now
                            </Button>
                        </div>
                    </section>

                    {/* About QuickArt Section */}
                    <section id="about-us" className="mb-16 md:mb-24 relative overflow-hidden">
                        <div className="absolute inset-0 z-0 rounded-3xl">
                            <div className="absolute inset-0 bg-[#0A0A0A] opacity-70 rounded-3xl"></div>
                            {/* Keep existing grid background pattern */}
                        </div>

                        <div className="relative z-10 p-8 md:p-14 rounded-3xl">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#FF3366] to-[#FF33A8]">About QuickArt</h2>
                                <p className="text-lg md:text-xl text-[#94A3B8] max-w-3xl mx-auto">Transform your photos into stunning artworks with AI</p>
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
                                    <div className="flex flex-col md:flex-row items-center mb-24 gap-8">
                                        <div className="md:w-2/5 flex justify-center">
                                            <div className="relative">
                                                <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-[#FF3366]/20 to-[#FF3366]/5 blur-xl animate-pulse"></div>
                                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-[#0A0A0A] border border-[#334155]/50 flex items-center justify-center relative z-10">
                                                    <Brain className="text-[#FF3366] h-16 w-16" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="md:w-3/5 text-center md:text-left">
                                            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">Powered by GPT-4</h3>
                                            <div className="h-1 w-20 bg-gradient-to-r from-[#FF3366] to-transparent mb-6 mx-auto md:mx-0 rounded-full"></div>
                                            <p className="text-[#94A3B8] text-lg leading-relaxed">
                                                Utilizing OpenAI's latest GPT-4 vision capabilities and advanced image generation models, QuickArt delivers stunning artistic transformations with unparalleled quality and creativity.
                                            </p>
                                        </div>
                                    </div>
                                </AnimatedContent>

                                {/* Add more sections about security and features */}
                                <AnimatedContent
                                    distance={100}
                                    direction="horizontal"
                                    reverse={true}
                                    threshold={0.2}
                                    initialOpacity={0}
                                    animateOpacity
                                    scale={1}
                                >
                                    <div className="flex flex-col md:flex-row-reverse items-center mb-24 gap-8">
                                        <div className="md:w-2/5 flex justify-center">
                                            <div className="relative">
                                                <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-[#FF33A8]/20 to-[#FF33A8]/5 blur-xl animate-pulse"></div>
                                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-[#0A0A0A] border border-[#334155]/50 flex items-center justify-center relative z-10">
                                                    <Shield className="text-[#FF33A8] h-16 w-16" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="md:w-3/5 text-center md:text-left">
                                            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">Your Privacy Matters</h3>
                                            <div className="h-1 w-20 bg-gradient-to-r from-[#FF33A8] to-transparent mb-6 mx-auto md:mx-0 rounded-full"></div>
                                            <p className="text-[#94A3B8] text-lg leading-relaxed">
                                                We prioritize your privacy. Your images are processed in real-time and never stored on our servers. All transformations happen securely through OpenAI's API with enterprise-grade encryption.
                                            </p>
                                        </div>
                                    </div>
                                </AnimatedContent>
                            </div>
                        </div>
                    </section>

                    {/* Services Section */}
                    <section id="services" className="mb-16 md:mb-24">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#FF3366] to-[#FF33A8]">Our Services</h2>
                            <p className="text-lg text-[#94A3B8] max-w-3xl mx-auto">Unleash your creativity with our AI-powered tools</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
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
                </main>

                {/* Updated Footer */}
                <footer className="bg-[#0A0A0A]/80 backdrop-blur-md border-t border-[#FF3366]/30">
                    <div className="container mx-auto px-4 py-12">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                            <div className="space-y-6">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF3366] to-[#FF33A8] flex items-center justify-center shadow-md">
                                        <span className="text-white font-bold text-xl">P</span>
                                    </div>
                                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF3366] to-[#FF33A8] font-['Righteous'] tracking-wider">PICTRIFY</span>
                                </div>
                                <p className="text-[#94A3B8] text-sm leading-relaxed">
                                    Transform your photos into stunning artworks with AI-powered style transfer technology. Create, share, and inspire with PICTRIFY.
                                </p>
                                <div className="flex space-x-4">
                                    <a href="#" className="w-10 h-10 rounded-full bg-[#0A0A0A] flex items-center justify-center text-[#94A3B8] hover:bg-[#FF3366]/20 hover:text-[#FF3366] transition-all duration-300">
                                        <TwitterIcon size={18} />
                                    </a>
                                    <a href="#" className="w-10 h-10 rounded-full bg-[#0A0A0A] flex items-center justify-center text-[#94A3B8] hover:bg-[#FF3366]/20 hover:text-[#FF3366] transition-all duration-300">
                                        <Instagram size={18} />
                                    </a>
                                    <a href="#" className="w-10 h-10 rounded-full bg-[#0A0A0A] flex items-center justify-center text-[#94A3B8] hover:bg-[#FF3366]/20 hover:text-[#FF3366] transition-all duration-300">
                                        <Github size={18} />
                                    </a>
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-white font-semibold mb-6 text-lg">Quick Links</h3>
                                <ul className="space-y-4">
                                    <li><Link href="#styles" className="text-[#94A3B8] hover:text-[#FF3366] transition-colors text-sm">Styles</Link></li>
                                    <li><Link href="#how-it-works" className="text-[#94A3B8] hover:text-[#FF3366] transition-colors text-sm">How It Works</Link></li>
                                    <li><Link href="#gallery" className="text-[#94A3B8] hover:text-[#FF3366] transition-colors text-sm">Gallery</Link></li>
                                    <li><Link href="#pricing" className="text-[#94A3B8] hover:text-[#FF3366] transition-colors text-sm">Pricing</Link></li>
                                </ul>
                            </div>
                            
                            <div>
                                <h3 className="text-white font-semibold mb-6 text-lg">Contact</h3>
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
                            <p className="text-[#94A3B8] text-sm">
                                © {new Date().getFullYear()} PICTRIFY. All rights reserved.
                            </p>
                            <div className="flex space-x-6">
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
