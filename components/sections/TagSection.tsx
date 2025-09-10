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
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [privacyFaded, setPrivacyFaded] = useState(false);
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
    // First show the name for 1.5s, then slide in TAG from right
    const nameTimer = setTimeout(() => {
      setAnimationState('tag');
      
      // After showing TAG for 1.5s, show YOU'RE IT below it
      const tagTimer = setTimeout(() => {
        setAnimationState('youre-it');
      }, 1500);
      
      return () => clearTimeout(tagTimer);
    }, 1500);

    return () => clearTimeout(nameTimer);
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

  // Fade out the Privacy label as soon as the user starts scrolling
  useEffect(() => {
    const onScroll = () => {
      setPrivacyFaded(window.scrollY > 10);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
        particleOptions={{ enabled: true }}
      />
      

      {/* Foreground content sits between middle and front waves */}
      <div className="relative z-10 max-w-4xl mx-auto text-center -mt-32">
        <div className="mb-12 hero-headline">
          <div className="relative h-44 flex items-center justify-center">
            {/* Static TAG Text - always visible */}
              <div className="flex flex-col items-center">
                {/* First line - Name slides out left, TAG slides in from right */}
                <div className="h-24 flex items-center justify-center">
                  {/* User Name - Slides out to the left */}
                  <h1 
                    className={`absolute impact-title impact-text text-white cursor-pointer hover:text-blue-200 transition-all duration-700 ease-in-out ${
                      animationState === 'name' ? 'opacity-100 translate-x-0' : 
                      animationState === 'tag' ? 'opacity-0 -translate-x-20' : 'opacity-0 -translate-x-20'
                    }`}
                    onClick={onTitleClick}
                  >
                    {invitedFirstName !== 'The' ? invitedFirstName : ''}
                  </h1>

                  {/* TAG Text - Slides in from right, stays visible */}
                  <h1 
                    className={`absolute impact-title impact-text text-white cursor-pointer hover:text-blue-200 transition-all duration-700 ease-in-out ${
                      animationState === 'name' ? 'opacity-0 translate-x-20' : 
                      (animationState === 'tag' || animationState === 'youre-it') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
                    }`}
                    onClick={onTitleClick}
                  >
                    TAG...
                  </h1>
                </div>
                
                {/* YOU'RE IT Text - Slides in from bottom when in 'youre-it' state */}
                <h1 
                  className={`impact-title impact-text text-white cursor-pointer hover:text-blue-200 transition-all duration-700 ease-out ${
                    animationState === 'youre-it' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                  }`}
                  onClick={onTitleClick}
                >
                  {"YOU'RE"}
                  &nbsp;IT
                </h1>
            </div>
          </div>
        </div>
        
        {/* CTA line under the title and above the invitation card */}
        <div className="relative z-30 -mt-2 mb-6">
          <p className="text-lg text-blue-100 hero-cta opacity-90">
            <span className="text-xl font-bold text-white mb-2 block">
              {invitedFirstName && invitedFirstName !== 'The'
                ? `${invitedFirstName}, you’ve been chosen for something huge`
                : "you’ve been chosen for something huge"}
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

      {/* Bottom-left Privacy with hover/tap popup */}
      <div className={`absolute left-8 bottom-8 z-30 group select-none transition-opacity duration-200 ${privacyFaded ? 'opacity-0 pointer-events-none' : 'opacity-90'}` }>
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={showPrivacy}
          onMouseEnter={() => setShowPrivacy(true)}
          onMouseLeave={() => setShowPrivacy(false)}
          onFocus={() => setShowPrivacy(true)}
          onBlur={() => setShowPrivacy(false)}
          onClick={() => setShowPrivacy((v) => !v)}
          className="text-white/90 hover:text-white dark:text-white/90 dark:hover:text-white text-sm font-medium tracking-wide"
        >
          Privacy
        </button>
        {/* Popup */}
        <div
          className={`absolute left-0 -top-2 translate-y-[-100%] mb-2 w-96 max-w-[95vw] rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 text-sm p-3 leading-relaxed transition-opacity duration-200 ${
            showPrivacy ? 'opacity-100' : 'opacity-0'
          } group-hover:opacity-100`}
          role="dialog"
        >
          <p>You’re seeing this because a friend invited you.</p>
          <p className="mt-1">We never sell or share your info; this invitation comes only through trusted connections.</p>
          <p className="mt-2">Your email is safe, private, and never shown to anyone else beyond Founder Matching Services.</p>
        </div>
      </div>
    </section>
  );
}