'use client';

import { Card } from '@/components/ui/card';
import { Users, TrendingUp, Star } from 'lucide-react';

export function RippleGrowSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            See Your Ripple Grow
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Watch your network expand in real-time as connections form and opportunities emerge.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 scroll-reveal">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Your Network</h3>
            <p className="text-gray-600 leading-relaxed">
              See everyone you&apos;ve connected, up to 5 levels deep. Each person represents potential.
            </p>
          </Card>

          <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 scroll-reveal">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Live Growth</h3>
            <p className="text-gray-600 leading-relaxed">
              Get notified when someone joins through your ripple. Watch your influence expand.
            </p>
          </Card>

          <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 scroll-reveal">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Your Share</h3>
            <p className="text-gray-600 leading-relaxed">
              When startups form through your network, you earn a piece. Simple as that.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}