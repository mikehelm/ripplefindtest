'use client';

interface FirstThingSectionProps {
  onTitleClick?: () => void;
}

export function FirstThingSection({ onTitleClick }: FirstThingSectionProps) {
  return (
    <section id="first-thing-section" className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 z-10 pt-16 pb-32">
      <div className="max-w-4xl mx-auto text-center section-reveal -mt-8">
        <h2 
          className="impact-title impact-text text-gray-900 dark:text-white mb-12 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
          onClick={onTitleClick}
        >
          1<sup className="text-[0.4em] -ml-1" style={{ verticalAlign: '20%', lineHeight: '1' }}>ST</sup> THINGS<br />
          YOU SHOULD KNOW.
        </h2>
        
        <div 
          className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-8 border-2 border-gray-200 dark:border-gray-700 max-w-2xl mx-auto shadow-lg"
        >
          <div className="supporting-text section-text text-gray-700 dark:text-gray-300 leading-snug">
            <p className="mb-2">No credit card | Nothing to buy | Not MLM</p>
            <p className="mb-2">Just an opportunity to own a &apos;piece&apos; of something <span className="big-glow-text">big</span></p>
            <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">by helping Founders find co-Founders</p>
          </div>
        </div>
      </div>
    </section>
  );
}