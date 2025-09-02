'use client';

import { Card } from '@/components/ui/card';

export function MicroFAQSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Quick Questions
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6 scroll-reveal">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Do I need to know tech?</h3>
            <p className="text-gray-600">Nope. You just need to know people who know people.</p>
          </Card>

          <Card className="p-6 scroll-reveal">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Is this actually free?</h3>
            <p className="text-gray-600">100%. No hidden costs, no subscriptions, no catches.</p>
          </Card>

          <Card className="p-6 scroll-reveal">
            <h3 className="text-lg font-bold text-gray-900 mb-3">How do I get paid?</h3>
            <p className="text-gray-600">When a startup forms through your ripple, we handle everything automatically.</p>
          </Card>

          <Card className="p-6 scroll-reveal">
            <h3 className="text-lg font-bold text-gray-900 mb-3">What if nothing happens?</h3>
            <p className="text-gray-600">You lose nothing. But you might miss the opportunity of a lifetime.</p>
          </Card>
        </div>
      </div>
    </section>
  );
}