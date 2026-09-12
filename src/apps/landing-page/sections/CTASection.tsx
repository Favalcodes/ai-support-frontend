import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CTASection: React.FC = () => {
  return (
    <section className="bg-primary-500 py-16 sm:py-20 lg:py-24">
      <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tighter text-white mb-4 sm:mb-5">
          Put the repetitive questions on autopilot
        </h2>
        <p className="text-base sm:text-lg text-secondary-200 leading-relaxed mb-8 sm:mb-10 max-w-2xl mx-auto">
          Set up your knowledge base, paste in the widget, and watch the first tier of
          your queue answer itself. Free for 14 days.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link
            to="/register"
            className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white text-primary-600 font-semibold hover:bg-secondary-100 transition-colors"
          >
            Start free trial
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-primary-600 border border-primary-400 text-white font-semibold hover:bg-primary-700 transition-colors"
          >
            Talk to us first
          </a>
        </div>
      </div>
    </section>
  );
};
