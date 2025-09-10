'use client';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SignInDialog } from '@/components/SignInDialog';
// Names are provided via props only; no URL parsing
import HealthDot from '@/components/system/HealthDot';

// Section Components
import { TagSection } from '@/components/sections/TagSection';
import { FirstThingSection } from '@/components/sections/FirstThingSection';
import { FactSection } from '@/components/sections/FactSection';
import { WhoCaresSection } from '@/components/sections/WhoCaresSection';
import { WhyYouSection } from '@/components/sections/WhyYouSection';
import { WhatNowSection } from '@/components/sections/WhatNowSection';
import { RippleGrowSection } from '@/components/sections/RippleGrowSection';
import { MicroFAQSection } from '@/components/sections/MicroFAQSection';
import { FooterSection } from '@/components/sections/FooterSection';

// Move sections array outside component to prevent recreation on every render
const SECTIONS = [
  'tag-section',
  'first-thing-section',
  'fact-section',
  'who-cares-section',
  'why-you-section',
  'what-now-section',
];

// Move function outside component and make it pure
const getSectionIndexFromScroll = (sections: string[]) => {
  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;
  const currentScrollCenter = scrollY + windowHeight / 2;

  for (let i = 0; i < sections.length; i++) {
    const element = document.getElementById(sections[i]);
    if (element) {
      const rect = element.getBoundingClientRect();
      const elementTop = scrollY + rect.top;
      const elementBottom = elementTop + rect.height;

      if (currentScrollCenter >= elementTop && currentScrollCenter <= elementBottom) {
        return i;
      }
    }
  }
  return null; // Return null instead of currentSection to avoid state dependency
};

// Famous names list for cycling animation
const famousNames = [
  { name: 'Elon Musk', color: 'text-blue-600' },
  { name: 'Oprah Winfrey', color: 'text-blue-600' },
  { name: 'Mark Zuckerberg', color: 'text-blue-600' },
  { name: 'Fred Flintstone', parenthetical: '(just kidding)', color: 'text-green-600' },
  { name: 'Serena Williams', color: 'text-blue-600' },
  { name: 'Donald Trump', color: 'text-blue-600' },
  { name: 'Beyoncé', color: 'text-blue-600' },
  { name: 'Albert Einstein', parenthetical: '(ok, someone who knew him)', color: 'text-indigo-600' },
  { name: 'MrBeast', color: 'text-blue-600' },
  { name: 'Taylor Swift', color: 'text-blue-600' },
  { name: 'Ha, you watched to the end?', color: 'text-purple-600' },
];

type IntroProps = {
  inviterName?: string;
  inviteeName?: string;
  code?: string;
  ctaHref?: string; // if provided, primary CTA should link here
};

export default function Intro({ inviterName, inviteeName, code, ctaHref }: IntroProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [currentNameIndex, setCurrentNameIndex] = useState(0);
  const [isNameTransitioning, setIsNameTransitioning] = useState(false);
  const [nameAnimationStarted, setNameAnimationStarted] = useState(false);
  const [isFirstCycle, setIsFirstCycle] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  // Use browser-compatible timer types for client code
  const nameTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nameIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const [isOnWhatNowSection, setIsOnWhatNowSection] = useState(false);
  const [shouldHideNav, setShouldHideNav] = useState(false);

  // No URL parsing; derive invited first/last from prop
  const invitedFirstFromProp = inviteeName
    ? inviteeName.split(' ')[0]
    : 'Hey';
  const invitedLastFromProp = inviteeName
    ? (inviteeName.split(' ').slice(1).join(' ') || '')
    : 'You';
  const inviterFullName = inviterName || 'The Member';
  const handleUseDemoNames = () => {};

  // Use the constant sections array
  const sections = SECTIONS;

  // Mouse wheel scroll behavior
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Only handle significant wheel movements
      if (Math.abs(e.deltaY) < 50) return;

      // Get current section from actual scroll position
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      let actualCurrentSection = 0;

      // Find which section we're currently in
      for (let i = 0; i < SECTIONS.length; i++) {
        const element = document.getElementById(SECTIONS[i]);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = scrollY + rect.top;

          // If we're past the middle of this section, this is our current section
          if (scrollY >= elementTop - windowHeight / 2) {
            actualCurrentSection = i;
          }
        }
      }

      // Prevent scrolling up from the "What Now?" section (last section)
      if (actualCurrentSection === SECTIONS.length - 1 && e.deltaY < 0) {
        e.preventDefault();
        return;
      }

      // Determine direction and next section
      const direction = e.deltaY > 0 ? 1 : -1;
      const nextSection = Math.max(0, Math.min(SECTIONS.length - 1, actualCurrentSection + direction));

      // Only scroll if we're going to a different section
      if (nextSection !== actualCurrentSection) {
        e.preventDefault();

        const targetElement = document.getElementById(SECTIONS[nextSection]);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });

          // Update state immediately
          setCurrentSection(nextSection);
        }
      }
    };

    // Add event listener
    document.addEventListener('wheel', handleWheel);

    return () => {
      document.removeEventListener('wheel', handleWheel);
    };
  }, []); // Remove sections dependency since we use SECTIONS constant

  // Track scroll position to update current section
  useEffect(() => {
    const handleScroll = () => {
      const actualSection = getSectionIndexFromScroll(SECTIONS);
      if (actualSection !== null && actualSection !== currentSection) {
        setCurrentSection(actualSection);
      }

      // Check if we're on the "what-now-section"
      const whatNowSection = document.getElementById('what-now-section');
      if (whatNowSection) {
        const rect = whatNowSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        // Start fading when the section is 30% visible from the top
        const isOnWhatNow = rect.top <= windowHeight * 0.7;
        setIsOnWhatNowSection(isOnWhatNow);
        setShouldHideNav(isOnWhatNow);
      }
    };

    const throttledScroll = (() => {
      let ticking = false;
      return () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            handleScroll();
            ticking = false;
          });
          ticking = true;
        }
      };
    })();

    window.addEventListener('scroll', throttledScroll);

    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, [currentSection]); // Keep currentSection dependency for comparison

  // Name cycling effect
  useEffect(() => {
    if (!nameAnimationStarted) return;

    const startCycling = () => {
      const cycleNames = () => {
        setIsNameTransitioning(true);

        // Clear any previous transition timeout
        if (transitionTimeoutRef.current) {
          clearTimeout(transitionTimeoutRef.current);
        }

        transitionTimeoutRef.current = setTimeout(() => {
          setCurrentNameIndex((prev: number) => {
            const nextIndex = (prev + 1) % famousNames.length;
            if (nextIndex === 0) {
              setIsFirstCycle(false);
            }
            return nextIndex;
          });
          setIsNameTransitioning(false);
        }, 500);
      };

      // First name shows for 6 seconds, then 4 seconds for each subsequent name
      const firstDelay = isFirstCycle ? 6000 : 4000;

      // Use a timeout to delay the first cycle, then an interval for subsequent cycles
      nameTimeoutRef.current = setTimeout(() => {
        cycleNames();

        // Set up regular interval after first cycle
        nameIntervalRef.current = setInterval(cycleNames, 4000);
      }, firstDelay);
    };

    startCycling();

    return () => {
      if (nameTimeoutRef.current) {
        clearTimeout(nameTimeoutRef.current);
        nameTimeoutRef.current = null;
      }
      if (nameIntervalRef.current) {
        clearInterval(nameIntervalRef.current);
        nameIntervalRef.current = null;
      }
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = null;
      }
    };
  }, [nameAnimationStarted, isFirstCycle]);

  // Fallback: Start animation after 3 seconds if not started by intersection observer
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (!nameAnimationStarted) {
        setNameAnimationStarted(true);
      }
    }, 3000);

    return () => clearTimeout(fallbackTimer);
  }, [nameAnimationStarted]);

  useEffect(() => {
    // Intersection observer for animations only
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add revealed class for animations
            entry.target.classList.add('revealed');

            // Start name animation when fact section becomes visible
            if (entry.target.id === 'fact-section' && !nameAnimationStarted && entry.intersectionRatio > 0.3) {
              setNameAnimationStarted(true);
            }
          }
        });
      },
      { threshold: 0.3 },
    );

    observerRef.current = observer;

    // Wait for DOM to be ready, then observe sections
    const timer = setTimeout(() => {
      // Observe sections for animations only
      SECTIONS.forEach((sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
          observer.observe(element);
        }
      });

      // Also observe elements with section-reveal class for animations
      document.querySelectorAll('.section-reveal').forEach((el) => {
        observer.observe(el);
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [nameAnimationStarted]); // Remove sections dependency since we use SECTIONS constant

  const handleArrowClick = () => {
    const actualCurrentSection = getSectionIndexFromScroll(SECTIONS);
    const nextSectionId = SECTIONS[Math.min(SECTIONS.length - 1, (actualCurrentSection ?? currentSection) + 1)];
    const targetSection = document.getElementById(nextSectionId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Invitee name for headline: from props only; fallback "Hey You"

  // Logo: use a single canonical asset from public/

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Affiliate Chip (optional) */}
      {(inviterName || inviteeName) && (
        <div
          style={{
            position: 'fixed',
            top: 12,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(16,16,16,0.85)',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: 999,
            fontSize: 13,
            zIndex: 70,
            boxShadow: '0 6px 18px rgba(0,0,0,0.25)'
          }}
        >
          Invited by <strong>{inviterName || 'a Founder Matching member'}</strong>
          {inviteeName ? <span> · For <strong>{inviteeName}</strong></span> : null}
        </div>
      )}
      {/* Navigation */}
      {/* Left Tab - Logo (always visible, elevated z-index) */}
      <div className={`fixed top-0 left-4 z-[60] pointer-events-auto transition-opacity duration-500 opacity-100`}>
        <div
          className="bg-white dark:bg-gray-800 rounded-b-2xl px-4 py-2 shadow-2xl border-2 border-gray-200 dark:border-gray-700"
          onClick={() => {
            const firstSection = document.getElementById(SECTIONS[0]);
            if (firstSection) {
              firstSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
        >
          <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-all duration-300 hover:scale-105">
            <div className="relative inline-block" style={{ width: 48, height: 48 }}>
              <img
                src="/ripplefindlogo.png"
                alt="RippleFind logo"
                width={48}
                height={48}
                className="object-contain"
              />
              <HealthDot className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-900 dark:text-white leading-snug -ml-1">RippleFind</span>
              <span className="text-xs font-light text-gray-500 dark:text-gray-400 leading-snug mt-1">
                by{' '}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.dispatchEvent(new Event('ripple:openInfo'));
                  }}
                  className="text-blue-600 dark:text-blue-400 underline hover:no-underline"
                >
                  Founder Matching
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Tab - Sign In & Theme Toggle */}
      <div className={`fixed top-0 right-4 z-50 transition-opacity duration-500 ${shouldHideNav ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="bg-white dark:bg-gray-800 rounded-b-xl p-2 pr-6 shadow-2xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <SignInDialog>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:shadow-xl hover:scale-105 transition-all duration-300 px-4 py-1 shadow-lg"
              >
                Sign In
              </Button>
            </SignInDialog>
          </div>
        </div>
      </div>

      {/* Main Sections */}
      <TagSection 
        onArrowClick={handleArrowClick} 
        onTitleClick={handleArrowClick}
        inviterFullName={inviterFullName}
        invitedFirstName={invitedFirstFromProp}
        invitedLastName={invitedLastFromProp}
        onUseDemoNames={handleUseDemoNames}
      />
      <FirstThingSection onTitleClick={handleArrowClick} />
      <FactSection 
        famousNames={famousNames}
        currentNameIndex={currentNameIndex}
        isNameTransitioning={isNameTransitioning}
        onTitleClick={handleArrowClick}
      />
      <WhoCaresSection onTitleClick={handleArrowClick} />
      <WhyYouSection onTitleClick={handleArrowClick} />
      <WhatNowSection onTitleClick={handleArrowClick} ctaHref={ctaHref} />

      {/* Floating Scroll Arrow */}
      <button
        onClick={handleArrowClick}
        className={`scroll-arrow ${currentSection >= SECTIONS.length - 1 ? 'hidden' : ''}`}
        aria-label="Scroll to next section"
      >
        <div className="w-20 h-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-xl flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 hover:scale-110 transition-all duration-300 border-2 border-blue-100 dark:border-gray-600">
          <ChevronDown className="w-10 h-10 text-gray-700 dark:text-gray-300" />
        </div>
      </button>
    </div>
  );
}
