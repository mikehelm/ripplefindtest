'use client';

import { useState, useEffect, useRef } from 'react';
import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, GripVertical, ChevronRight, Info, X } from 'lucide-react';
import Link from 'next/link';
import { WavesBackground } from '@/components/WavesBackground';

interface WhatNowSectionProps {
  onTitleClick?: () => void;
}

export function WhatNowSection({ onTitleClick }: WhatNowSectionProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const [shouldBounce, setShouldBounce] = useState(false);
  const [isSliding, setIsSliding] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isMouseOverSidebar, setIsMouseOverSidebar] = useState(false);
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const tabRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scroll isolation for sidebar
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Always prevent default scrolling when mouse is over sidebar
      if (isMouseOverSidebar) {
        e.preventDefault();
        e.stopPropagation();
        
        // Apply scroll to sidebar content if it exists and can scroll
        if (sidebarRef.current) {
          const scrollContainer = sidebarRef.current.querySelector('.sidebar-content');
          if (scrollContainer) {
            const currentScrollTop = scrollContainer.scrollTop;
            const maxScrollTop = scrollContainer.scrollHeight - scrollContainer.clientHeight;
            
            // Only apply scroll if we're within scrollable bounds
            // But always prevent main page scrolling regardless
            if (
              (e.deltaY > 0 && currentScrollTop < maxScrollTop) || // Scrolling down and not at bottom
              (e.deltaY < 0 && currentScrollTop > 0) // Scrolling up and not at top
            ) {
              scrollContainer.scrollTop += e.deltaY;
            }
          }
        }
      }
    };

    // Add wheel event listener with passive: false to allow preventDefault
    document.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      document.removeEventListener('wheel', handleWheel);
    };
  }, [isMouseOverSidebar]);

  // Handle mouse enter/leave for scroll isolation
  const handleSidebarMouseEnter = () => {
    setIsMouseOverSidebar(true);
    if (!isMobile) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsPanelOpen(true);
    }
  };

  const handleSidebarMouseLeave = () => {
    setIsMouseOverSidebar(false);
    if (!isMobile) {
      timeoutRef.current = setTimeout(() => {
        setIsPanelOpen(false);
      }, 2000);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const whatNowSection = document.getElementById('what-now-section');
      
      if (whatNowSection) {
        const rect = whatNowSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        // Show panel when What Now section is 70% visible
        const shouldShow = rect.top <= windowHeight * 0.3;
        setShowPanel(shouldShow);
      }
      
      // Trigger bounce animation when What Now section comes into view
      if (whatNowSection && !shouldBounce) {
        const rect = whatNowSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        // Trigger bounce when What Now section is 30% visible
        const shouldTriggerBounce = rect.top <= windowHeight * 0.7;
        
        if (shouldTriggerBounce) {
          setShouldBounce(true);
          // Reset bounce state after animation completes
          setTimeout(() => setShouldBounce(false), 2000);
        }
      }
    };

    handleScroll(); // Check initial state
    window.addEventListener('scroll', handleScroll);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [shouldBounce]);

  const handleStartRipple = () => {

  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isMobile) {
      e.preventDefault();
      setIsPanelOpen(!isPanelOpen);
    }
  };

  // Helper: close info popup and re-open sidebar (if visible)
  const closeInfoPopup = () => {
    setShowInfoPopup(false);
    // Re-open sidebar when popup closes to restore context
    setIsPanelOpen(true);
  };

  const handleClickOutside = useCallback((e: MouseEvent) => {
    // Do not auto-close sidebar while info popup is open; popup handles its own clicks
    if (showInfoPopup) return;
    const target = e.target as Node;
    const clickedInsidePanel = panelRef.current?.contains(target);
    const clickedOnTab = tabRef.current?.contains(target);
    if (!clickedInsidePanel && !clickedOnTab) {
      setIsPanelOpen(false);
    }
  }, [showInfoPopup]);

  useEffect(() => {
    if (isPanelOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isPanelOpen, handleClickOutside]);

  return (
    <div>
      {/* Example Panel */}
      <div
        ref={panelRef}
        className={`fixed left-0 top-0 h-screen z-50 transition-all duration-500 ${
          isPanelOpen ? 'translate-x-0' : '-translate-x-[328px]'
        } ${showPanel ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{
          transitionTimingFunction: isPanelOpen 
            ? 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' 
            : 'cubic-bezier(0.55, 0.06, 0.68, 0.19)'
        }}
        onMouseEnter={handleSidebarMouseEnter}
        onMouseLeave={handleSidebarMouseLeave}
      >
        {/* Panel Content */}
        <div 
          ref={sidebarRef}
          className="w-[360px] h-full bg-white dark:bg-gray-800 shadow-2xl rounded-r-xl flex flex-col example-sidebar"
        >
          {/* Top padding/spacing */}
          <div className="h-8 flex-shrink-0"></div>
          
          {/* Scrollable content */}
          <div className="sidebar-content flex-1 overflow-y-auto px-8 pb-8">
            <h2 className="text-2xl font-bold text-black dark:text-white mb-6 font-sans">
              This could be your story:
            </h2>

            <div className="mb-8">
              <ul className="space-y-3 text-black dark:text-gray-200 font-sans">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  You shared with a friend
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  5 shares later, a founder is invited
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  They find a co-founder and build
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Company explodes to $10 billion
                </li>
              </ul>
            </div>

            {/* Divider */}
            <div className="mb-8 text-center">
              <span className="text-gray-400 dark:text-gray-500 text-lg">⸻</span>
            </div>

            {/* Info Icon */}
            <div className="relative mb-2 flex justify-end pr-2">
              <button
                onClick={() => setShowInfoPopup(true)}
                className="w-6 h-6 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-md"
                aria-label="How this works"
              >
                <Info className="w-3.5 h-3.5 text-white" />
              </button>
            </div>

            <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg -mt-2">
              <ul className="space-y-2 text-black dark:text-gray-200 font-sans text-sm">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  We own 2% of the company
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  We share 50% with 5 Ripplers
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  You're five steps away
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  You earn 2% of our 2%
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  That's 0.04% ownership.
                </li>
              </ul>
            </div>

            
            {/* Your Share - Positioned for Maximum Impact */}
            <div className="mt-6 mb-8 text-center px-6 pt-8 pb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl border-2 border-blue-200 dark:border-blue-700 shadow-lg">
              <div className="text-4xl font-black text-gray-900 dark:text-white font-sans mb-3 leading-tight">
                <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">Your share:</div>
                <div className="text-blue-600 dark:text-blue-400">$4 million</div>
              </div>
              <p className="text-gray-800 dark:text-gray-200 font-sans italic text-xl font-bold mt-3">
                Just for telling a friend
              </p>
            </div>

            {/* Divider */}
            <div className="mt-4 mb-4 text-center">
              <span className="text-gray-400 dark:text-gray-500 text-lg">⸻</span>
            </div>

            {/* Referral Breakdown */}
            <div className="p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 text-center">
                Referral Breakdown
              </h4>
              <ul className="space-y-2 text-black dark:text-gray-200 font-sans text-sm">
                <li className="flex justify-between items-center">
                  <span>• Direct</span>
                  <span className="font-medium">20%</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>• 2nd</span>
                  <span className="font-medium">10%</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>• 3rd</span>
                  <span className="font-medium">5%</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>• 4th</span>
                  <span className="font-medium">3%</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>• 5th</span>
                  <span className="font-medium">2%</span>
                </li>
                <li className="flex justify-between items-center border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                  <span>• Affiliate</span>
                  <span className="font-medium">10% flat (any depth)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Vertical Tab */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 -right-12 w-12 h-32 bg-white dark:bg-gray-800 shadow-lg rounded-r-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-500 ${
            showPanel ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onTouchStart={handleTouchStart}
          ref={tabRef}
        >
          <div className="flex flex-col items-center justify-center h-full space-y-2">
            {/* Vertical text */}
            <span
              className="text-black dark:text-white font-sans font-medium text-sm tracking-wider"
              style={{
                writingMode: 'vertical-rl',
                textOrientation: 'mixed',
                transform: 'rotate(180deg)'
              }}
            >
              EXAMPLE
            </span>
            
            {/* Drag handle icon */}
            <GripVertical className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          </div>
        </div>
      </div>

      {/* Info Popup */}
      {showInfoPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={closeInfoPopup}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-lg w-full shadow-2xl border border-gray-200 dark:border-gray-700 relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeInfoPopup}
              className="absolute top-4 right-4 w-8 h-8 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
            
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">How This Works</h3>
            
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                When founders connect through our platform and build successful companies, we earn a 1-2% equity stake for facilitating that crucial introduction.
              </p>
              
              <p>
                We share 50% of our equity with the 5 people in the referral chain that led to this connection. In this example, we earned 2%, so we share 1% of the company.
              </p>
              
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Your Distance Matters:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• <strong>Direct referral:</strong> 20% of our 1% = 0.2% ownership</li>
                  <li>• <strong>2nd degree:</strong> 10% of our 1% = 0.1% ownership</li>
                  <li>• <strong>3rd degree:</strong> 5% of our 1% = 0.05% ownership</li>
                  <li>• <strong>4th degree:</strong> 3% of our 1% = 0.03% ownership</li>
                  <li>• <strong>5th degree:</strong> 2% of our 1% = 0.02% ownership</li>
                  <li className="pt-2 border-t border-blue-200 dark:border-blue-700">• <strong>Affiliates/Influencers:</strong> 10% set aside for special partnerships</li>
                </ul>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg border-l-4 border-yellow-400">
                <p className="font-semibold text-gray-900 dark:text-white">
                  The Example assumed you&apos;re 5 degrees away. 
                  If you were the direct referrer, your share would be $40 million!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <section 
        id="what-now-section"
        className={`relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-teal-600 overflow-hidden transition-transform duration-700 ease-in-out pt-16 pb-32 ${
          isSliding ? '-translate-x-full' : 'translate-x-0'
        }`}
      >
        {/* Water Effect Background */}
        <WavesBackground />

        {/* Main Content */}
        <div className={`text-center z-10 transition-transform duration-700 ease-in-out -mt-8 ${
          isSliding ? '-translate-x-full' : 'translate-x-0'
        }`}>
          <h1 
            className="text-6xl sm:text-7xl lg:text-8xl font-bold text-white mb-8 cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={onTitleClick}
          >
            What Now?
          </h1>
          
          <Button 
            onClick={handleStartRipple}
            className="bg-white text-blue-600 hover:bg-gray-50 font-bold px-12 py-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 text-xl"
          >
            Start Your Ripple
            <ArrowRight className="ml-3 w-6 h-6" />
          </Button>
          
          <div className="supporting-text text-blue-100 dark:text-blue-200 max-w-2xl mx-auto leading-relaxed mt-8 text-lg italic text-center">
            <p>If you did this before Zuck made Facebook</p>
            <p>You would be worth about $760 million dollars today</p>
          </div>
        </div>
      </section>

      {/* Right Arrow Button */}
      <button
        onClick={handleStartRipple}
        className={`fixed right-8 top-1/2 transform -translate-y-1/2 z-50 transition-all duration-500 ${
          showPanel && !isSliding ? 'opacity-100' : 'opacity-0 pointer-events-none'
        } ${isSliding ? '-translate-x-full' : 'translate-x-0'}`}
        aria-label="Start your ripple"
      >
        <div className="w-20 h-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-xl flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 hover:scale-110 transition-all duration-300 border-2 border-blue-100 dark:border-gray-600">
          <ChevronRight className="w-10 h-10 text-gray-700 dark:text-gray-300" />
        </div>
      </button>
    </div>
  );
}