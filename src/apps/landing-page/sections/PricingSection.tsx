import React from 'react';
import { Check, Zap } from 'lucide-react';
import { Button } from '../../../components/ui';

export const PricingSection: React.FC = () => {
  const plans = [
    {
      name: 'Starter',
      price: 19,
      description: 'Perfect for small teams getting started',
      features: [
        '1,000 conversations/month',
        '1 AI assistant',
        'Basic analytics',
        'Email support',
        'Knowledge base integration',
        'Standard response time',
      ],
      highlighted: false,
    },
    {
      name: 'Professional',
      price: 49,
      description: 'For growing businesses with more needs',
      features: [
        '10,000 conversations/month',
        '5 AI assistants',
        'Advanced analytics',
        'Priority support',
        'Custom knowledge base',
        'Fast response time',
        'Multi-language support',
        'API access',
      ],
      highlighted: true,
      badge: 'Most Popular',
    },
    {
      name: 'Enterprise',
      price: null,
      description: 'For large organizations with custom needs',
      features: [
        'Unlimited conversations',
        'Unlimited AI assistants',
        'Custom analytics',
        'Dedicated support',
        'Custom integrations',
        'Instant response time',
        'White-label solution',
        'SLA guarantee',
        'Custom training',
      ],
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include a 14-day free trial.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl border-2 p-8 ${
                plan.highlighted
                  ? 'border-primary-500 shadow-xl scale-105'
                  : 'border-gray-200 hover:border-gray-300'
              } transition-all duration-300`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center px-4 py-1 bg-primary-500 text-white text-sm font-semibold rounded-full shadow-lg">
                    <Zap className="w-4 h-4 mr-1" />
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {plan.name}
              </h3>

              {/* Description */}
              <p className="text-gray-600 mb-6">{plan.description}</p>

              {/* Price */}
              <div className="mb-6">
                {plan.price ? (
                  <div className="flex items-baseline">
                    <span className="text-5xl font-bold text-gray-900">
                      ${plan.price}
                    </span>
                    <span className="text-gray-600 ml-2">/month</span>
                  </div>
                ) : (
                  <div className="text-5xl font-bold text-gray-900">
                    Custom
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <Button
                variant={plan.highlighted ? 'primary' : 'secondary'}
                className="w-full mb-6"
                size="lg"
              >
                {plan.price ? 'Start Free Trial' : 'Contact Sales'}
              </Button>

              {/* Features */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-900 mb-4">
                  What's included:
                </p>
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Link */}
        <div className="text-center mt-12">
          <p className="text-gray-600">
            Have questions?{' '}
            <a href="#contact" className="text-primary-600 hover:text-primary-700 font-medium">
              Contact our sales team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};