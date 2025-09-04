'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { UserCheck, AlertTriangle, X } from 'lucide-react';
import { WavesBackground } from '@/components/WavesBackground';
import StarsBackground from '@/components/StarsBackground';

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
  const [waveOffset, setWaveOffset] = useState(0);
  const invitationCardRef = useRef<HTMLDivElement>(null);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Safe fallback for legacy default value without requiring a remount
  const displayInviterName = inviterFullName === 'The Member' ? 'Mike Helm' : inviterFullName;

  const handleWaveUpdate = useCallback((y: number) => {
    // The y value is the wave's position on the canvas. We'll find its deviation
    // from the midpoint and use that to create a gentle bobbing motion.
    if (invitationCardRef.current) {
      const canvasHeight = invitationCardRef.current.closest('section')?.offsetHeight || 0;
      const midPoint = canvasHeight * 0.5;
      const offset = y - midPoint;
      // Apply a damping factor to make the movement more subtle
      setWaveOffset(offset * 0.2);
    }
  }, []);

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
    <section id="tag-section" className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-teal-600 dark:from-blue-800 dark:to-teal-800 overflow-hidden pt-16 pb-32">
      {/* Night sky stars (dark mode only) */}
      <StarsBackground className="hidden dark:block z-0" />
      {/* Water Effect Background (Back + Middle) */}
      <WavesBackground 
        variant="behind" 
        zIndexClass="z-0" 
        onWaveUpdate={handleWaveUpdate} 
        baselineRatio={0.5}
        bubbleOptions={{
          enabled: true,
          density: 3,           // not overwhelming
          minRadius: 2,
          maxRadius: 10,        // roughly letter height scale
          speedMin: 40,
          speedMax: 90,
          fadeStartRatio: 0.35, // begin fading before halfway
          maxHeightRatio: 0.5,  // disappear around halfway up
          baseAlpha: 0.7,
        }}
      />

      

      {/* Foreground content sits between middle and front waves */}
      <div className="relative z-10 max-w-4xl mx-auto text-center -mt-32">
        <div className="mb-12 hero-headline">
          <div className="relative h-44 flex items-center justify-center">
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
                  {"YOU'RE"}
                  &nbsp;IT
                </h1>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA line under the title and above the invitation card */}
        <div className="relative z-30 -mt-2 mb-6">
          <p className="text-lg text-blue-100 hero-cta opacity-90">
            <span className="text-xl font-bold text-white mb-2 block">
              {invitedFirstName && invitedFirstName !== 'The'
                ? `${invitedFirstName}, you've been pulled into something HUGE!`
                : "You've been pulled into something HUGE!"}
            </span>
          </p>
        </div>

        {/* Digital Invitation Card */}
        <div 
          ref={invitationCardRef}
          className="invitation-card relative max-w-md mx-auto p-8 rounded-2xl mb-8 hero-subline overflow-visible bg-white border-2 border-gray-200 animate-gentle-sway"
          style={{ transform: `translateY(${waveOffset - 16}px)` }}
          onMouseEnter={() => setShowBubble(true)}
          onMouseLeave={() => setShowBubble(false)}
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm text-gray-500 uppercase tracking-wide">RippleFind Invitation</p>
              <p className="text-lg font-bold text-gray-900">{invitedFirstName} {invitedLastName}</p> {/* Dynamic: Uses full invited name */}
            </div>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-700 mb-2">Invited by</p>
            <p className="text-xl font-bold text-blue-600">{displayInviterName}</p> {/* Dynamic with fallback */}
          </div>
        </div>

        
      </div>

      {/* Front wave overlay */}
      <WavesBackground variant="front" zIndexClass="z-20" baselineRatio={0.54} />

      {/* Stationary Talking Bubble */}
      <div 
        className={`fixed bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-2xl transition-opacity duration-500 pointer-events-none z-30 w-80 ${
          showBubble ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          top: `${bubblePosition.top}px`,
          left: `${bubblePosition.left}px`,
        }}
      >
        <p className="text-lg font-semibold text-gray-800 leading-relaxed">
          {displayInviterName} invited you to be in their first ripple.
        </p>
        {/* Arrow pointing down */}
        <div className="absolute top-full left-1/4 transform -translate-x-1/4 w-0 h-0 border-l-[16px] border-r-[16px] border-t-[16px] border-l-transparent border-r-transparent border-t-white drop-shadow-md"></div>
      </div>
    </section>
  );
}