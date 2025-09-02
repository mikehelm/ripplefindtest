'use client';

interface WhoCaresProps {
  onTitleClick?: () => void;
}

export function WhoCaresSection({ onTitleClick }: WhoCaresProps) {
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
              <p className="mb-2">When your ripple helps start a billion-dollar company</p>
              <p>You earn a piece for helping them get there</p>
            </div>
          </div>
          
          <p className="text-xl font-bold bg-yellow-200 dark:bg-yellow-300 text-gray-900 dark:text-gray-800 px-3 py-1 rounded-lg inline-block">You could own a piece of multiple startups</p>
        </div>
      </div>
    </section>
  );
}