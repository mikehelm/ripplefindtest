'use client';
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { UserCheck, AlertTriangle, X } from 'lucide-react';
import { WavesBackground } from '@/components/WavesBackground';

interface TagSectionProps {
  onArrowClick: () => void;
  onTitleClick?: () => void;
  inviterFullName: string;
  invitedFirstName: string;
  invitedLastName: string;
  onUseDemoNames: () => void;
}

export function TagSection({ onArrowClick, onTitleClick, inviterFullName, invitedFirstName, invitedLastName, onUseDemoNames }: TagSectionProps) {
  const [animationState, setAnimationState] = useState<'tag' | 'name' | 'youre-it'>('name');
  const [showBubble, setShowBubble] = useState(false);
  const [bubblePosition, setBubblePosition] = useState({ top: 0, left: 0 });
  const [showInvalidLinkPopup, setShowInvalidLinkPopup] = useState(false);
  const invitationCardRef = useRef<HTMLDivElement>(null);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check if we have invalid link data and show popup
  useEffect(() => {
    // Temporarily disabled
    // if (inviterFullName === 'The Member') {
    //   setShowInvalidLinkPopup(true);
    // }
  }, [inviterFullName]);

  useEffect(() => {
    // After name shows for 2 seconds, transition to YOU'RE IT
    const transitionTimer = setTimeout(() => {
      setAnimationState('youre-it');
    }, 2000);

    return () => clearTimeout(transitionTimer);
  }, []);

  // Debounced position calculation
  const calculatePosition = useCallback(() => {
    if (invitationCardRef.current) {
      const rect = invitationCardRef.current.getBoundingClientRect();
      setBubblePosition({
        top: rect.top - 120,
        left: rect.left + rect.width * 0.75 - 160,
      });
    }
  }, []);

  const debouncedCalculatePosition = useCallback(() => {
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }
    resizeTimeoutRef.current = setTimeout(calculatePosition, 100);
  }, [calculatePosition]);

  // Calculate bubble position with debouncing
  useEffect(() => {
    calculatePosition();
    window.addEventListener('resize', debouncedCalculatePosition);
    window.addEventListener('scroll', debouncedCalculatePosition);

    return () => {
      window.removeEventListener('resize', debouncedCalculatePosition);
      window.removeEventListener('scroll', debouncedCalculatePosition);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [calculatePosition, debouncedCalculatePosition]);

  return (
    <section id="tag-section" className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-teal-600 overflow-hidden pt-16 pb-32">
      {/* Water Effect Background */}
      <WavesBackground />

      {/* Invalid Link Popup - Temporarily disabled */}
      {/* {showInvalidLinkPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl border-2 border-orange-200 dark:border-orange-700 relative animate-in fade-in-0 zoom-in-95 duration-300">
            <button
              onClick={() => setShowInvalidLinkPopup(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
            
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Link Issue</h3>
            </div>
            
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p className="font-semibold text-gray-900 dark:text-white">
                The invitation link you used isn&apos;t functioning properly.
              </p>
              
              <p>
                Please contact the person who invited you to get a fresh link. You don&apos;t want to miss this opportunity!
              </p>
              
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border-l-4 border-blue-400">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  💡 <strong>Tip:</strong> Ask them to generate a new invitation link from their RippleFind dashboard.
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex space-x-3">
              <Button
                onClick={() => {
                  onUseDemoNames();
                  setShowInvalidLinkPopup(false);
                }}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
              >
                See a demo
              </Button>
              <Button
                onClick={() => setShowInvalidLinkPopup(false)}
                variant="outline"
                className="flex-1"
              >
                Continue Anyway
              </Button>
            </div>
          </div>
        </div>
      )} */}

      <div className="max-w-4xl mx-auto text-center -mt-8">
        <div className="mb-12 hero-headline">
          <div className="relative h-48 flex items-center justify-center">
            {/* Static TAG Text - always visible */}
            <div className="flex flex-col items-center">
              <h1 
                className="impact-title impact-text text-white cursor-pointer hover:text-blue-200 transition-all duration-300 mb-4"
                onClick={onTitleClick}
              >
                TAG...
              </h1>
              
              {/* Animated second line */}
              <div className="relative h-24 flex items-center justify-center">
                {/* User Name */}
                <h1 
                  className={`absolute left-1/2 -translate-x-1/2 impact-title impact-text text-white cursor-pointer hover:text-blue-200 transition-all duration-500 ease-in ${
                    animationState === 'name' ? 'opacity-100' :
                    animationState === 'youre-it' ? 'opacity-0 transform translate-x-full' : 'opacity-0 transform -translate-x-full'
                  }`}
                  onClick={onTitleClick}
                >
                  {invitedFirstName !== 'The' ? invitedFirstName : ''} {/* Dynamic: Uses invitedFirstName from URL, but shows nothing if it's the default "The" */}
                </h1>

                {/* YOU'RE IT Text */}
                <h1 
                  className={`absolute left-1/2 -translate-x-1/2 impact-title impact-text text-white cursor-pointer hover:text-blue-200 transition-all duration-700 ease-out ${
                    animationState === 'youre-it' ? 'opacity-100 animate-bounce-in' : 'opacity-0 transform -translate-x-full'
                  }`}
                  onClick={onTitleClick}
                >
                  YOU'RE&nbsp;IT
                </h1>
              </div>
            </div>
          </div>
        </div>
        
        {/* Digital Invitation Card */}
        <div 
          ref={invitationCardRef}
          className="invitation-card relative max-w-md mx-auto p-8 rounded-2xl mb-8 hero-subline overflow-visible bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 animate-gentle-sway"
          onMouseEnter={() => setShowBubble(true)}
          onMouseLeave={() => setShowBubble(false)}
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">RippleFind Invitation</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{invitedFirstName} {invitedLastName}</p> {/* Dynamic: Uses full invited name */}
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
            <p className="text-sm text-gray-700 dark:text-gray-400 mb-2">Invited by</p>
            <p className="text-xl font-bold text-blue-600">{inviterFullName}</p> {/* Dynamic: Uses inviterFullName */}
          </div>
        </div>

        <p className="text-lg text-blue-100 hero-cta opacity-90">
          <span className="text-xl font-bold text-white mb-4 block">You&apos;ve been pulled into something HUGE!</span>
        </p>
      </div>

      {/* Stationary Talking Bubble */}
      <div 
        className={`fixed bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-2xl p-6 shadow-2xl transition-opacity duration-500 pointer-events-none z-10 w-80 ${
          showBubble ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          top: `${bubblePosition.top}px`,
          left: `${bubblePosition.left}px`,
        }}
      >
        <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 leading-relaxed">
          {inviterFullName} would like you to be in his first ripple.
        </p>
        {/* Arrow pointing down */}
        <div className="absolute top-full left-1/4 transform -translate-x-1/2 w-0 h-0 border-l-[16px] border-r-[16px] border-t-[16px] border-l-transparent border-r-transparent border-t-white dark:border-t-gray-800 drop-shadow-md"></div>
      </div>
    </section>
  );
}