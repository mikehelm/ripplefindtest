'use client';

import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SignInDialog } from '@/components/SignInDialog';
import { useParams } from 'next/navigation';
import { ParsedNames } from '@/lib/utils';

// Section Components
import { TagSection } from '@/components/sections/TagSection';
import { FirstThingSection } from '@/components/sections/FirstThingSection';
import { FactSection } from '@/components/sections/FactSection';
import { WhoCaresSection } from '@/components/sections/WhoCaresSection';
import { WhyYouSection } from '@/components/sections/WhyYouSection';
import { WhatNowSection } from '@/components/sections/WhatNowSection';

// Move sections array outside component to prevent recreation on every render
const SECTIONS = [
  'tag-section', 
  'first-thing-section',
  'fact-section',
  'who-cares-section',
  'why-you-section',
  'what-now-section'
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
  return null;
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

// Helper function to capitalize the first letter of a string.
const capitalizeFirstLetter = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Helper function to format a URL slug (e.g., "john-doe" to "John Doe")
const formatSlugToName = (slug: string): { firstName: string; lastName: string; fullName: string } => {
  const parts = slug.split('-');
  const firstName = capitalizeFirstLetter(parts[0]);
  const lastName = parts.length > 1 ? capitalizeFirstLetter(parts.slice(1).join('-')) : '';
  const fullName = `${firstName} ${lastName}`.trim();
  return { firstName, lastName, fullName };
};

export default function DynamicLandingPage() {
  const params = useParams();
  const [currentSection, setCurrentSection] = useState(0);
  const [currentNameIndex, setCurrentNameIndex] = useState(0);
  const [isNameTransitioning, setIsNameTransitioning] = useState(false);
  const [nameAnimationStarted, setNameAnimationStarted] = useState(false);
  const [isFirstCycle, setIsFirstCycle] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const nameIntervalRef = useRef<NodeJS.Timeout>();
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const [isOnWhatNowSection, setIsOnWhatNowSection] = useState(false);
  const [shouldHideNav, setShouldHideNav] = useState(false);
  
  // Parse names from URL parameters and store in state for dynamic updates
  const [displayNames, setDisplayNames] = useState<ParsedNames>(() => {
    const defaultNames = {
      inviterFirstName: 'Mike',
      inviterLastName: 'Helm',
      invitedFirstName: 'XXX',
      invitedLastName: 'KAS-Angel',
      inviterFullName: 'Mike Helm',
      invitedFullName: 'XXX KAS-Angel',
    };

    if (!params?.names || !Array.isArray(params.names) || params.names.length !== 2) {
      return defaultNames;
    }

    const [inviterSlug, invitedSlug] = params.names;
    const inviter = formatSlugToName(inviterSlug);
    const invited = formatSlugToName(invitedSlug);

    return {
      inviterFirstName: inviter.firstName,
      inviterLastName: inviter.lastName,
      invitedFirstName: invited.firstName,
      invitedLastName: invited.lastName,
      inviterFullName: inviter.fullName,
      invitedFullName: invited.fullName,
    };
  });
  
  const handleUseDemoNames = () => {
    setDisplayNames({
      inviterFirstName: 'Mike',
      inviterLastName: 'Helm',
      invitedFirstName: 'Graham',
      invitedLastName: 'Brain',
      inviterFullName: 'Mike Helm',
      invitedFullName: 'Graham Brain',
    });
  };
  
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
  }, []);

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
  }, [currentSection]);

  // Name cycling effect
  useEffect(() => {
    if (!nameAnimationStarted) return;

    const startCycling = () => {
      const cycleNames = () => {
        setIsNameTransitioning(true);
        
        setTimeout(() => {
          setCurrentNameIndex((prev) => {
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
      
      nameIntervalRef.current = setTimeout(() => {
        cycleNames();
        
        // Set up regular interval after first cycle
        nameIntervalRef.current = setInterval(cycleNames, 4000);
      }, firstDelay);
    };

    startCycling();

    return () => {
      if (nameIntervalRef.current) {
        clearTimeout(nameIntervalRef.current);
        clearInterval(nameIntervalRef.current);
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
      { threshold: 0.3 }
    );

    observerRef.current = observer;

    // Wait for DOM to be ready, then observe sections
    const timer = setTimeout(() => {
      // Observe sections for animations only
      SECTIONS.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (element) {
          observer.observe(element);
        }
      });
      
      // Also observe elements with section-reveal class for animations
      document.querySelectorAll('.section-reveal').forEach(el => {
        observer.observe(el);
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [nameAnimationStarted]);

  const handleArrowClick = () => {
    const actualCurrentSection = getSectionIndexFromScroll(SECTIONS);
    const nextSectionId = SECTIONS[Math.min(SECTIONS.length - 1, (actualCurrentSection ?? currentSection) + 1)];
    const targetSection = document.getElementById(nextSectionId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      {/* Left Tab - Logo */}
      <div className={`fixed top-0 left-4 z-50 transition-opacity duration-500 ${shouldHideNav ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
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
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-full"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-900 dark:text-white leading-tight -ml-1">RippleFind</span>
              <span className="text-xs font-light text-gray-500 dark:text-gray-400 leading-none">by Founder Matching Limited</span>
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
        inviterFullName={displayNames.inviterFullName}
        invitedFirstName={displayNames.invitedFirstName}
        invitedLastName={displayNames.invitedLastName}
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
      <WhatNowSection onTitleClick={handleArrowClick} />

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