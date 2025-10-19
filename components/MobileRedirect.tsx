import React from 'react';

export default function MobileRedirect() {
  return (
    <div className="fixed inset-0 bg-bg flex items-center justify-center p-4 z-50">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-delabs-red-glow opacity-30"></div>
      <div className="absolute inset-0 bg-delabs-grid bg-grid opacity-10"></div>
      
      {/* Content */}
      <div className="relative max-w-md w-full text-center">
        {/* Delabs Logo */}
        <div className="mb-8">
          <img 
            src="/Header_logo.png" 
            alt="Delabs"
            className="h-12 w-auto mx-auto mb-6"
          />
        </div>

        {/* Main Message */}
        <div className="samsung-card p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-4 tracking-wider">
              Desktop Experience Required
            </h1>
            <p className="text-white/80 text-base leading-relaxed">
              For the best experience with the Ragnarok Libre Streamer Supporting System, 
              please visit us on your desktop or laptop computer.
            </p>
          </div>




        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-white/40 text-xs">
            © 2025 Delabs. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
