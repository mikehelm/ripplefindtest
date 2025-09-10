'use client';

import { useState, useEffect, useRef } from 'react';
import { useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, GripVertical, ChevronRight, Info, X, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { WavesBackground } from '@/components/WavesBackground';

interface WhatNowSectionProps {
  onTitleClick?: () => void;
  ctaHref?: string;
  invitedFirstName?: string;
}

export function WhatNowSection({ onTitleClick, ctaHref, invitedFirstName }: WhatNowSectionProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const [shouldBounce, setShouldBounce] = useState(false);
  const [isSliding, setIsSliding] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isMouseOverSidebar, setIsMouseOverSidebar] = useState(false);
  const isMouseOverSidebarRef = useRef(false);
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [showDemoEnd, setShowDemoEnd] = useState(false);
  const tabRef = useRef<HTMLDivElement>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const [ignoreHoverUntil, setIgnoreHoverUntil] = useState<number | null>(null);
  const [frozenPreviewText, setFrozenPreviewText] = useState<string | null>(null);
  const [ctaSourceRef, setCtaSourceRef] = useState<'main' | 'floater' | null>(null);
  
  // Lightweight tracking (client-side only for mailto prefill)
  const sectionStartRef = useRef<number | null>(null);
  const sectionTotalMsRef = useRef<number>(0);
  const sidebarOpenAtRef = useRef<number | null>(null);
  const sidebarTotalMsRef = useRef<number>(0);
  const sidebarOpenCountRef = useRef<number>(0);
  const sidebarHoverCountRef = useRef<number>(0);
  const endDemoClickedAtRef = useRef<number | null>(null);
  const eventsRef = useRef<Array<{ t: number; label: string }>>([]);
  const startTimeRef = useRef<number | null>(null);
  const lastEventRef = useRef<number | null>(null);

  const logEvent = (label: string) => {
    const now = Date.now();
    eventsRef.current.push({ t: now, label });
    lastEventRef.current = now;
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    // Start section timer
    const now = Date.now();
    sectionStartRef.current = now;
    startTimeRef.current = now;
    logEvent('section_mount');
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // On unmount, finalize section duration and any open sidebar
    return () => {
      if (sectionStartRef.current) {
        sectionTotalMsRef.current += Date.now() - sectionStartRef.current;
        sectionStartRef.current = null;
      }
      if (sidebarOpenAtRef.current) {
        sidebarTotalMsRef.current += Date.now() - sidebarOpenAtRef.current;
        sidebarOpenAtRef.current = null;
      }
      logEvent('section_unmount');
      window.removeEventListener('resize', checkMobile);
    };
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
  const handleSidebarMouseEnter = (e?: React.MouseEvent) => {
    setIsMouseOverSidebar(true);
    isMouseOverSidebarRef.current = true;
    sidebarHoverCountRef.current += 1;
    logEvent('sidebar_hover_enter');
    if (!isMobile) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // Respect cooldown after manual close via tab click
      if (ignoreHoverUntil && Date.now() < ignoreHoverUntil) {
        return;
      }
      setIsPanelOpen(true);
    }
  };

  const handleSidebarMouseLeave = () => {
    setIsMouseOverSidebar(false);
    isMouseOverSidebarRef.current = false;
    logEvent('sidebar_hover_leave');
    if (!isMobile) {
      timeoutRef.current = setTimeout(() => {
        if (!isMouseOverSidebarRef.current) {
          setIsPanelOpen(false);
        }
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
        if (shouldShow && !showPanel) {
          logEvent('section_visible');
        }
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
  }, [shouldBounce, showPanel]);

  // When the What Now section becomes visible, open the sidebar immediately,
  // then auto-close after a short delay unless the user hovers over it.
  useEffect(() => {
    if (!isMobile && showPanel) {
      // Respect cooldown: do not auto-open while cooldown active
      if (ignoreHoverUntil && Date.now() < ignoreHoverUntil) {
        return;
      }
      // Open right away on arrival
      setIsPanelOpen(true);

      // Schedule auto-close unless the user interacts by hovering
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        if (!isMouseOverSidebarRef.current) {
          setIsPanelOpen(false);
        }
      }, 3000); // 3s grace period
    }

    // Cleanup any pending timers when visibility changes or component unmounts
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [showPanel, isMobile, isMouseOverSidebar, ignoreHoverUntil]);

  // Track sidebar open/close durations
  useEffect(() => {
    if (isPanelOpen) {
      // opening
      if (!sidebarOpenAtRef.current) {
        sidebarOpenAtRef.current = Date.now();
        sidebarOpenCountRef.current += 1;
        logEvent('sidebar_open');
      }
    } else {
      // closing
      if (sidebarOpenAtRef.current) {
        sidebarTotalMsRef.current += Date.now() - sidebarOpenAtRef.current;
        sidebarOpenAtRef.current = null;
        logEvent('sidebar_close');
      }
    }
  }, [isPanelOpen]);

  // Build a report text without mutating timers, as of the provided time
  const buildReportSnapshot = (asOf: number, includeTotalsLabel: string | null) => {
    const effectiveSectionMs = sectionTotalMsRef.current + (sectionStartRef.current ? asOf - sectionStartRef.current : 0);
    const effectiveSidebarMs = sidebarTotalMsRef.current + (sidebarOpenAtRef.current ? asOf - sidebarOpenAtRef.current : 0);
    const seconds = (ms: number) => Math.round(ms / 100) / 10; // 0.1s precision
    const lines: string[] = [];
    lines.push(`Demo feedback`);
    lines.push(`Invited: ${invitedFirstName ?? ''}`);
    lines.push(`Date: ${new Date(asOf).toISOString()}`);
    lines.push(`Section: What Now`);
    if (includeTotalsLabel) {
      lines.push(`${includeTotalsLabel}: ${seconds(effectiveSectionMs)}s`);
    } else {
      lines.push(`Time on section: ${seconds(effectiveSectionMs)}s`);
    }
    lines.push(`Sidebar opened: ${sidebarOpenCountRef.current}x`);
    lines.push(`Sidebar hover count: ${sidebarHoverCountRef.current}x`);
    lines.push(`Sidebar total open time: ${seconds(effectiveSidebarMs)}s`);
    lines.push(`End-of-demo clicked: ${endDemoClickedAtRef.current ? 'yes' : 'no'}`);
    lines.push(`User agent: ${navigator.userAgent}`);
    lines.push('');
    // Timeline
    if (startTimeRef.current) {
      lines.push('Timeline:');
      let prev = startTimeRef.current;
      for (const ev of eventsRef.current) {
        const dt = seconds(ev.t - prev);
        const sinceStart = seconds(ev.t - startTimeRef.current);
        lines.push(`- [t+${sinceStart}s | +${dt}s] ${ev.label}`);
        prev = ev.t;
      }
    }
    lines.push('');
    lines.push('Your comments:');
    return lines.join('\n');
  };

  // mailto removed per request; copy flow is the primary path

  const handleStartRipple = (source: 'main' | 'floater') => {
    // For the demo, show an end-of-demo message and freeze preview at CTA click
    setCtaSourceRef(source);
    const now = Date.now();
    logEvent(`cta_click_${source}`);
    endDemoClickedAtRef.current = now;
    // Freeze preview snapshot up to the CTA click moment with a clear label
    const frozen = buildReportSnapshot(now, 'Total time until CTA click');
    setFrozenPreviewText(frozen);
    setShowDemoEnd(true);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isMobile) {
      e.preventDefault();
      // Toggle, but block opening during cooldown
      if (isPanelOpen) {
        setIsPanelOpen(false);
      } else {
        if (ignoreHoverUntil && Date.now() < ignoreHoverUntil) {
          return;
        }
        setIsPanelOpen(true);
      }
    }
  };

  // Helper: close info popup and re-open sidebar (if visible)
  const closeInfoPopup = () => {
    setShowInfoPopup(false);
    // Re-open sidebar when popup closes to restore context, unless in cooldown
    if (!(ignoreHoverUntil && Date.now() < ignoreHoverUntil)) {
      setIsPanelOpen(true);
    }
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

  // Allow other sections to trigger this section's Info popup via a global custom event
  useEffect(() => {
    const openInfo = () => {
      setShowInfoPopup(true);
    };
    window.addEventListener('ripple:openInfo', openInfo as EventListener);
    return () => window.removeEventListener('ripple:openInfo', openInfo as EventListener);
  }, []);

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
        onMouseEnter={(e) => handleSidebarMouseEnter(e)}
        onMouseLeave={handleSidebarMouseLeave}
      >
        {/* Panel Content */}
        <div 
          ref={sidebarRef}
          className="w-[360px] h-full bg-white dark:bg-gray-800 shadow-2xl rounded-r-xl flex flex-col example-sidebar"
        >
          {/* Top padding/spacing */}
          <div className="h-20 flex-shrink-0"></div>
          
          {/* Scrollable content */}
          <div className="sidebar-content flex-1 overflow-y-auto px-8 pt-6 pb-8">
            <h2 className="text-2xl font-bold text-black dark:text-white mb-6 font-sans">
              {invitedFirstName ? `${invitedFirstName}, this could be your story:` : 'This could be your story:'}
            </h2>

            <div className="mb-8">
              <ul className="space-y-3 text-black dark:text-gray-200 font-sans">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  {invitedFirstName ? `${invitedFirstName} shares with a friend` : 'You shared with a friend'}
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
                  {invitedFirstName ? `${invitedFirstName}, you're five steps away` : `You're five steps away`}
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  You earn 2% of our 2%
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  That&rsquo;s 0.04% ownership.
                </li>
              </ul>
            </div>

            
            {/* Your Share - Positioned for Maximum Impact */}
            <div className="mt-6 mb-8 text-center px-6 pt-8 pb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl border-2 border-blue-200 dark:border-blue-700 shadow-lg">
              <div className="text-4xl font-black text-gray-900 dark:text-white font-sans mb-3 leading-tight">
                <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">Your share:</div>
                <div className="text-blue-600 dark:text-blue-400">$4 million</div>
              </div>
              {/* Instruction text intentionally removed from sidebar; it only appears in the popup */}
            </div>

            {/* Divider */}
            <div className="mt-4 mb-4 text-center">
              <span className="text-gray-400 dark:text-gray-500 text-lg">⸻</span>
            </div>

            {/* Referral Breakdown */}
            <div className="p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg">
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
                <li className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                  <span>• Affiliate</span>
                  <span className="font-medium">10% flat (any depth)</span>
                </li>
              </ul>
            </div>
            
            {/* Bottom explanatory sentence */}
            <div className="mt-6 mb-2 flex items-center justify-center">
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center max-w-xs leading-relaxed">
                If this model existed when Facebook started, being even five steps away could have earned you $760M. That’s the power of ripple introductions.
              </p>
            </div>
          </div>
        </div>

        {/* Vertical Tab */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 -right-12 w-12 h-32 bg-white dark:bg-gray-800 shadow-lg rounded-r-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-500 ${
            showPanel ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onTouchStart={handleTouchStart}
          onClick={() => {
            if (isPanelOpen) {
              setIsPanelOpen(false);
              logEvent('tab_close_click');
              // Add a short cooldown to prevent immediate re-open from hover
              setIgnoreHoverUntil(Date.now() + 1000);
            }
          }}
          aria-label={isPanelOpen ? 'Close sidebar' : 'Sidebar handle'}
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
              {isPanelOpen ? '' : 'Example'}
            </span>
            
            {/* Drag handle icon */}
            <GripVertical className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          </div>
        </div>
      </div>

      {/* Demo End Popup */}
      {showDemoEnd && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4" onClick={() => setShowDemoEnd(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-lg w-full shadow-2xl border border-gray-200 dark:border-gray-700 relative" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">End of Demo</h3>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>You’ve reached the end of this demo. This is just a test build.</p>
            </div>
            

            {/* Copy alternative (frozen at CTA click) */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Please copy and send these results back to me:</span>
                <button
                  onClick={async () => {
                    try {
                      const text = frozenPreviewText ?? buildReportSnapshot(Date.now(), 'Time on section');
                      if (navigator.clipboard && navigator.clipboard.writeText) {
                        await navigator.clipboard.writeText(text);
                      } else {
                        // Fallback for older browsers
                        const ta = document.createElement('textarea');
                        ta.value = text;
                        ta.style.position = 'fixed';
                        ta.style.left = '-9999px';
                        document.body.appendChild(ta);
                        ta.focus();
                        ta.select();
                        document.execCommand('copy');
                        document.body.removeChild(ta);
                      }
                      setCopyStatus('copied');
                      setTimeout(() => setCopyStatus('idle'), 2000);
                    } catch (e) {
                      setCopyStatus('error');
                      setTimeout(() => setCopyStatus('idle'), 2000);
                    }
                  }}
                  className={`px-3 py-1.5 rounded text-sm ${copyStatus === 'copied' ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                >
                  {copyStatus === 'copied' ? 'Copied!' : copyStatus === 'error' ? 'Copy failed' : 'Copy'}
                </button>
              </div>
              <pre className="text-xs whitespace-pre-wrap break-words bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded p-3 text-gray-800 dark:text-gray-200 max-h-56 overflow-auto">
{frozenPreviewText ?? buildReportSnapshot(Date.now(), 'Time on section')}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Info Popup */}
      {showInfoPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={closeInfoPopup}>
          <div className="rounded-3xl p-8 md:p-10 max-w-2xl w-full shadow-[0_20px_70px_-20px_rgba(0,0,0,0.6)] border border-white/10 dark:border-white/10 bg-white/90 dark:bg-slate-900/80 relative ring-1 ring-black/5" onClick={(e) => e.stopPropagation()}>
            <div className="absolute -top-8 -left-6">
              <div className="relative w-16 h-16 rounded-full bg-white/10 backdrop-blur-md ring-1 ring-white/20 shadow-xl flex items-center justify-center">
                <img
                  src="/images/Foundermatching_logo.png"
                  alt="Founder Matching Logo"
                  className="w-3/4 h-3/4 object-contain"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              </div>
            </div>
            <button
              onClick={closeInfoPopup}
              className="absolute top-4 right-4 w-8 h-8 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
            
            <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mb-2 text-center tracking-tight">Founder Matching Limited</h3>
            <p className="text-sm md:text-base text-blue-600 dark:text-blue-400 font-semibold mb-7 text-center tracking-wide">
              Think Tinder for Startups
            </p>
            
            <div className="space-y-5 text-slate-700 dark:text-slate-200 leading-relaxed text-[15px] md:text-base">
              <p className="text-justify/auto">
                Imagine how many people dream of starting a company with a big idea, but never move forward because they don&apos;t know the right people to join them. And imagine how many talented people wake up every day stuck in jobs they don&apos;t love, wishing they could pour their skills into a project they believe in.
              </p>
              
              <p className="text-justify/auto">
                That&apos;s where we come in. Founder Matching lets you swipe, connect, and find the co-founders who can help turn your vision into reality. With AI, ideas can accelerate faster than ever — but it will never replace co-founders who share your passion and vision.
              </p>
              
              <p className="text-justify/auto">
                When these matches succeed, real companies are built. We take a small equity share (1–2%) — and we share part of that with you, because we couldn&apos;t do it without you.
              </p>
              
              <div className="mt-6 space-y-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">Our mission is simple:</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-blue-500/90" />
                    <span>Help founders find their first teammates.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-blue-500/90" />
                    <span>Give talented people the chance to join projects they believe in.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-blue-500/90" />
                    <span>Turn everyday introductions into real ownership.</span>
                  </li>
                </ul>
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
          
          {ctaHref ? (
            <Link href={ctaHref} prefetch={false}>
              <Button 
                className="bg-white text-blue-600 hover:bg-gray-50 font-bold px-12 py-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 text-xl"
              >
                Start Your Ripple
                <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
            </Link>
          ) : (
            <Button 
              onClick={() => handleStartRipple('main')}
              className="bg-white text-blue-600 hover:bg-gray-50 font-bold px-12 py-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 text-xl"
            >
              Start Your Ripple
              <ArrowRight className="ml-3 w-6 h-6" />
            </Button>
          )}
          
          <div className="supporting-text text-blue-100 dark:text-blue-200 max-w-2xl mx-auto leading-relaxed mt-8 text-lg italic text-center">
            <p>Before someone else claims the opportunities that could flow through you.</p>
          </div>
        </div>

        {/* Bottom-of-page callout */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 max-w-3xl w-full px-4">
          <div className="bg-transparent border border-white/50 dark:border-white/30 rounded-2xl p-4 sm:p-5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
            <p className="text-sm sm:text-base text-white dark:text-white text-center mb-1">
              Curious about the company behind RippleFind?
            </p>
            <p className="text-sm sm:text-base text-white dark:text-white text-center mb-3">
              Learn how they&apos;re enabling startups.
            </p>
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={() => setShowInfoPopup(true)}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm sm:text-base shadow-md"
                aria-label="About Founder Matching"
              >
                About Founder Matching
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Right Arrow Button */}
      <button
        onClick={() => handleStartRipple('floater')}
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