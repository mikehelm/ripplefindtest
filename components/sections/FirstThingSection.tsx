'use client';

import { useState } from 'react';
import { Info } from 'lucide-react';

interface FirstThingSectionProps {
  onTitleClick?: () => void;
}

export function FirstThingSection({ onTitleClick }: FirstThingSectionProps) {
  const [eyeClicked, setEyeClicked] = useState(false);

  const handleOpenInfo = () => {
    window.dispatchEvent(new Event('ripple:openInfo'));
    setEyeClicked(true); // stop any glow after first click
  };

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
        
        {/* White info container with a contextual eye button */}
        <div 
          className="relative bg-white dark:bg-gray-800 rounded-2xl px-4 py-8 border-2 border-gray-200 dark:border-gray-700 max-w-2xl mx-auto shadow-lg"
        >
          <div className="supporting-text section-text text-gray-700 dark:text-gray-300 leading-snug">
            <p className="mb-2">No credit card | Nothing to buy | Not MLM</p>
            <p className="mb-2">Just an opportunity to own a &apos;piece&apos; of something <span className="big-glow-text">big</span></p>
            <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">by helping founders find co-founders</p>
          </div>

          {/* Big glowing eye button bottom-right to open How This Works */}
          <button
            onClick={handleOpenInfo}
            aria-label="How this works"
            className={`absolute bottom-3 right-3 w-12 h-12 rounded-full flex items-center justify-center bg-blue-600 text-white transition-all duration-200 hover:bg-blue-700 ${eyeClicked ? 'shadow-md' : 'shadow-lg ring-2 ring-blue-300/30 hover:ring-blue-400/40'}`}
          >
            <Info className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}