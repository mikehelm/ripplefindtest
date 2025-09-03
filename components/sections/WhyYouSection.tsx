'use client';

import { ArrowIcon } from '../ui/arrow-icon';
import { Rocket } from 'lucide-react';

interface WhyYouSectionProps {
  onTitleClick?: () => void;
}

export function WhyYouSection({ onTitleClick }: WhyYouSectionProps) {
  return (
    <section id="why-you-section" className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 pt-16 pb-32">
      <div className="max-w-4xl mx-auto text-center section-reveal -mt-8">
        <h2 
          className="impact-title impact-text text-gray-900 dark:text-white mb-12 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
          onClick={onTitleClick}
        >
          WHY YOU?
        </h2>
        
        <div className="supporting-text section-text text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">          
          <p className="mb-1">You&apos;re now part of a ripple that can reach anyone on Earth.</p>
          
          <p className="mb-1">Because it&apos;s not who you know...</p>
          <p className="mb-8">it&apos;s who they know!</p>
          
          {/* Visual Flow Progression Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-8 border-2 border-gray-200 dark:border-gray-700 max-w-2xl mx-auto shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4">
              {/* Step 1: You Share */}
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-blue-600">1</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-3">You Share</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Start the ripple</p>
                </div>
                
                {/* Arrow 1 */}
                <div className="hidden md:flex items-center ml-6 -mt-8">
                  <ArrowIcon />
                </div>
              </div>

              {/* Step 2: They Share */}
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-teal-600">2</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-3">They Share</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Ripple expands</p>
                </div>
                
                {/* Arrow 2 */}
                <div className="hidden md:flex items-center ml-6 -mt-8">
                  <ArrowIcon />
                </div>
              </div>

              {/* Step 3: Company Born */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg relative overflow-visible">
                  <Rocket className="text-white w-28 h-28" strokeWidth={3} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-3">Company Born</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">YOU EARN</p>
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-xl font-medium text-gray-600 dark:text-gray-400 text-center mt-8 italic">
          Anyone can help founders find their first teammates.
        </p>
      </div>
    </section>
  );
}