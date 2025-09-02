'use client';

export function FooterSection() {
  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          <span className="text-lg font-bold">RippleFind</span>
        </div>
        <p className="text-gray-400 mb-2">
          A viral campaign by Founder Matching
        </p>
        <p className="text-gray-500 text-sm">
          © 2024 All rights reserved.
        </p>
      </div>
    </footer>
  );
}