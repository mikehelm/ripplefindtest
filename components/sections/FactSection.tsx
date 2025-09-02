'use client';

interface FamousPerson {
  name: string;
  color: string;
  parenthetical?: string;
}

interface FactSectionProps {
  famousNames: FamousPerson[];
  currentNameIndex: number;
  isNameTransitioning: boolean;
  onTitleClick?: () => void;
}

export function FactSection({ famousNames, currentNameIndex, isNameTransitioning, onTitleClick }: FactSectionProps) {
  return (
    <section id="fact-section" className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 section-reveal pt-16 pb-32">
      <div className="max-w-4xl mx-auto text-center section-reveal -mt-8">
        <h2 
          className="impact-title impact-text text-gray-900 dark:text-white mb-12 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
          onClick={onTitleClick}
        >
          FACT:
        </h2>
        
        <div className="supporting-text section-text text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-8 border-2 border-gray-200 dark:border-gray-700 max-w-2xl mx-auto shadow-lg mb-6">
            <div className="supporting-text section-text text-gray-700 dark:text-gray-300 leading-snug">
              <p className="mb-2">You&apos;re only five connections away from anyone on Earth.</p>
              <p>That includes billionaires, inventors, future icons.</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-200 leading-tight text-center">
            <p className="mb-2">You are probably 3 or less from...</p>
            <span className="name-container">
              {famousNames.map((person, index) => (
                <span
                  key={index}
                  className={`animated-name ${person.color} ${
                    index === currentNameIndex && !isNameTransitioning ? 'active' : ''
                  } ${
                    index === currentNameIndex && isNameTransitioning ? 'exiting' : ''
                  }`}
                >
                  {person.name}
                  {person.parenthetical && (
                    <span className="parenthetical ml-1">{person.parenthetical}</span>
                  )}
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}