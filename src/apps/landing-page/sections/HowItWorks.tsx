import React from 'react';
import { Upload, Code, Rocket } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: 1,
      icon: Upload,
      title: 'Upload Knowledge',
      description: 'Add your FAQs, articles, and documentation to train the AI',
    },
    {
      number: 2,
      icon: Code,
      title: 'Embed Widget',
      description: 'Add our chat widget to your website with a single line of code',
    },
    {
      number: 3,
      icon: Rocket,
      title: 'Start Supporting',
      description: 'AI handles common queries, agents step in for complex issues',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            How it works
          </h2>
          <p className="text-xl text-gray-600">
            Three simple steps to transform your customer support
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                {/* Connector Line (desktop only) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-primary-500"></div>
                )}

                {/* Step Card */}
                <div className="relative z-10 text-center">
                  {/* Number Badge */}
                  <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-glow-cyan">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 bg-white border-4 border-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 -mt-8">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};