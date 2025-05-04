'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import TransitionTemplate from '@/components/TransitionTemplate'

export default function PrivacyPolicyPage() {
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
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto bg-[#0A0A0A]/60 border border-[#334155]/50 rounded-xl p-6 md:p-8 shadow-xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#FF3366] to-[#FF33A8]">🔐 PRIVACY POLICY</h1>
            <p className="text-[#94A3B8] mb-8">Last updated: Thursday May 01 2025</p>
            
            <div className="space-y-6 text-[#E2E8F0]">
              <p className="text-xl">Welcome to Pictrify!</p>
              <p>We value your privacy and are committed to protecting your personal data. This Privacy Policy explains what information we collect, how we use it, and your rights.</p>
              
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4 text-white">1. Information We Collect</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li><span className="font-medium">Account Info:</span> Email, name, and any other info you provide during sign-up.</li>
                  <li><span className="font-medium">Payment Info:</span> Processed securely by third-party providers (we don't store credit card details).</li>
                  <li><span className="font-medium">Usage Data:</span> How you use the site, your preferences, credits used, etc.</li>
                  <li><span className="font-medium">Cookies & Analytics:</span> Standard cookies and tools like Google Analytics to improve performance.</li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4 text-white">2. How We Use Your Info</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>To provide and maintain the service</li>
                  <li>To improve features and user experience</li>
                  <li>To communicate updates or offers</li>
                  <li>For analytics and performance monitoring</li>
                  <li>To comply with legal obligations</li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4 text-white">3. Data Sharing</h2>
                <p>We do not sell your data. We only share data with trusted third-party services necessary to run the platform (e.g., payment processors, hosting providers).</p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4 text-white">4. Your Rights</h2>
                <p>You can:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Request access or deletion of your data</li>
                  <li>Opt out of marketing emails</li>
                  <li>Disable cookies in your browser</li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4 text-white">5. Contact</h2>
                <p>Got privacy questions? Hit us up at shahid.ali.gtx@gmail.com</p>
              </div>
            </div>
          </div>
        </main>
        
        {/* Simple Footer */}
        <footer className="bg-[#0A0A0A]/80 backdrop-blur-md border-t border-[#FF3366]/30">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-[#94A3B8] text-sm text-center md:text-left">
                © {new Date().getFullYear()} PICTRIFY. All rights reserved.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6">
                <Link href="/policies/privacy_policy" className="text-[#FF3366] text-sm hover:text-[#FF33A8] transition-colors">Privacy Policy</Link>
                <Link href="/policies/terms_of_service" className="text-[#94A3B8] text-sm hover:text-[#FF3366] transition-colors">Terms of Service</Link>
                <Link href="/policies/cookie_policy" className="text-[#94A3B8] text-sm hover:text-[#FF3366] transition-colors">Cookie Policy</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </TransitionTemplate>
  )
}