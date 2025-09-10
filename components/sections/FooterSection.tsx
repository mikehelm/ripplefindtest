'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export function FooterSection() {
  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto text-center relative">
        {/* Right-side backed-by label, fades like Privacy */}
        <FadingBackedBy />
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Image src="/ripplefindlogo.png" alt="RippleFind logo" width={28} height={28} />
          <span className="text-lg font-bold">RippleFind</span>
        </div>
        <p className="text-gray-400 mb-2">
          A viral campaign by Founder Matching
        </p>
        <p className="text-gray-500 text-sm">
          &copy; 2024 All rights reserved.
        </p>
      </div>
    </footer>
  );
}

function FadingBackedBy() {
  const [faded, setFaded] = useState(false);
  useEffect(() => {
    const onScroll = () => setFaded(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`absolute right-0 top-0 translate-y-1 text-xs md:text-sm text-white/90 md:text-white/90 transition-opacity duration-200 ${
        faded ? 'opacity-0 pointer-events-none' : 'opacity-90'
      }`}
    >
      Backed by Founder Matching Limited
    </div>
  );
}