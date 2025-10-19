import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-bg border-t border-brand/20 mt-24 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-spekter-blue-glow opacity-30"></div>
      <div className="absolute inset-0 bg-spekter-grid bg-grid opacity-10"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Logo and Social Links */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <img 
              src="/clutch.png" 
              alt="Clutch"
              className="h-11 w-auto"
            />
          </div>
          

        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center items-center space-x-8 text-sm text-white/60 mb-8">
          <Link href="/terms" className="hover:text-brand transition-colors font-medium uppercase tracking-wide">Terms of Service</Link>
          <span className="text-brand/40">|</span>
          <Link href="/privacy" className="hover:text-brand transition-colors font-medium uppercase tracking-wide">Privacy Policy</Link>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm text-white/40 font-medium tracking-wide">
          © 2025 Clutch. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
