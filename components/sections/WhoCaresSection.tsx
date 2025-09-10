'use client';

import { useState } from 'react';
import { Info } from 'lucide-react';

interface WhoCaresProps {
  onTitleClick?: () => void;
}

export function WhoCaresSection({ onTitleClick }: WhoCaresProps) {
  const [eyeClicked, setEyeClicked] = useState(false);

  const handleOpenInfo = () => {
    window.dispatchEvent(new Event('ripple:openInfo'));
    setEyeClicked(true);
  };

  return (
    <section id="who-cares-section" className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 z-10 pt-16 pb-32">
      <div className="max-w-4xl mx-auto text-center section-reveal -mt-8">
        <h2 
          className="impact-title impact-text text-gray-900 dark:text-white mb-12 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
          onClick={onTitleClick}
        >
          WHO CARES?
        </h2>
        
        <div className="supporting-text section-text text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          <p className="mb-6 text-2xl font-bold">You will…</p>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-8 border-2 border-gray-200 dark:border-gray-700 max-w-2xl mx-auto shadow-lg mb-6">
            <div className="supporting-text section-text text-gray-700 dark:text-gray-300 leading-snug">
              <p className="mb-2">If your ripple helps start a successful company, you earn a share for playing a part.</p>
            </div>
          </div>
          
          {/* Yellow callout (eye removed as requested) */}
          <div className="relative inline-block">
            <p className="text-xl font-bold bg-yellow-200 dark:bg-yellow-300 text-gray-900 dark:text-gray-800 px-3 py-1 rounded-lg inline-block">You could own a piece of multiple startups</p>
          </div>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">This isn’t theory — this is how we’re structuring real ownership in real startups.</p>
        </div>
      </div>
    </section>
  );
}