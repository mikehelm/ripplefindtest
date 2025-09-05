'use client';

import { useState } from 'react';

interface FirstThingSectionProps {
  onTitleClick?: () => void;
}

export function FirstThingSection({ onTitleClick }: FirstThingSectionProps) {
  const [showPrivacy, setShowPrivacy] = useState(false);
  return (
    <section id="first-thing-section" className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 z-10 pt-16 pb-32" style={{ backgroundColor: '#0D1A3E' }}>
      <div className="max-w-4xl mx-auto text-center section-reveal -mt-8">
        <h2 
          className="impact-title impact-text text-white mb-12 cursor-pointer hover:text-blue-300 transition-colors duration-300"
          onClick={onTitleClick}
        >
          1<sup className="text-[0.4em] -ml-1" style={{ verticalAlign: '20%', lineHeight: '1' }}>ST</sup> THINGS<br />
          YOU SHOULD KNOW.
        </h2>
        
        {/* White info container (info button removed) */}
        <div 
          className="relative bg-white dark:bg-gray-800 rounded-2xl px-4 py-8 border-2 border-gray-200 dark:border-gray-700 max-w-2xl mx-auto shadow-lg"
        >
          <div className="supporting-text section-text text-gray-700 dark:text-gray-300 leading-snug">
            <p className="mb-2">No credit card | Nothing to buy | Not MLM</p>
            <p className="mb-2">Just an opportunity to own a &apos;piece&apos; of something <span className="big-glow-text">big</span></p>
            <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">by helping founders find co-founders</p>
          </div>
        </div>
      </div>

      {/* Bottom-left Privacy link with hover/tap tooltip */}
      <div className="absolute left-4 bottom-4 select-none">
        <button
          type="button"
          className="text-sm text-gray-300/80 hover:text-gray-100 transition-colors"
          onMouseEnter={() => setShowPrivacy(true)}
          onMouseLeave={() => setShowPrivacy(false)}
          onFocus={() => setShowPrivacy(true)}
          onBlur={() => setShowPrivacy(false)}
          onClick={() => setShowPrivacy((v) => !v)}
          aria-haspopup="dialog"
          aria-expanded={showPrivacy}
        >
          Privacy
        </button>
        {showPrivacy && (
          <div className="mt-2 w-72 sm:w-80 bg-white text-gray-800 rounded-md shadow-lg p-3 text-xs leading-relaxed animate-in fade-in slide-in-from-bottom-1">
            <p>You&apos;re seeing this because a friend invited you.</p>
            <p>We never sell or share your info; this invitation comes only through trusted connections.</p>
            <p className="mt-2">Your email is safe, private, and never shown to anyone else beyond Founder Matching Services.</p>
          </div>
        )}
      </div>
    </section>
  );
}