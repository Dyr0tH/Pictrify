'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import TransitionTemplate from '@/components/TransitionTemplate'

export default function TermsOfServicePage() {
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
            <h1 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#FF3366] to-[#FF33A8]">📜 TERMS OF SERVICE</h1>
            <p className="text-[#94A3B8] mb-8">Last updated: Thursday May 01 2025</p>
            
            <div className="space-y-6 text-[#E2E8F0]">
              <p>Thanks for using Pictrify! By using our platform, you agree to these terms.</p>
              
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4 text-white">1. Eligibility</h2>
                <p>You must be 13+ years old and legally allowed to use the service in your country.</p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4 text-white">2. Usage Rules</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Don't abuse, reverse-engineer, or exploit the service.</li>
                  <li>Don't use our platform for illegal or harmful activity.</li>
                  <li>You're responsible for your account's activity.</li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4 text-white">3. Credits & Payments</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Paid plans provide credits to access AI tools/features.</li>
                  <li>No refunds unless required by law.</li>
                  <li>Unused credits will not expire as per our policy.</li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4 text-white">4. Account Termination</h2>
                <p>We may suspend or terminate accounts that violate these terms or harm the platform.</p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4 text-white">5. Limitation of Liability</h2>
                <p>We're not liable for indirect damages, data loss, or platform downtime. Use at your own risk.</p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4 text-white">6. Changes</h2>
                <p>We may update these terms. Continued use = acceptance of changes.</p>
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
                <Link href="/policies/privacy_policy" className="text-[#94A3B8] text-sm hover:text-[#FF3366] transition-colors">Privacy Policy</Link>
                <Link href="/policies/terms_of_service" className="text-[#FF3366] text-sm hover:text-[#FF33A8] transition-colors">Terms of Service</Link>
                <Link href="/policies/cookie_policy" className="text-[#94A3B8] text-sm hover:text-[#FF3366] transition-colors">Cookie Policy</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </TransitionTemplate>
  )
}