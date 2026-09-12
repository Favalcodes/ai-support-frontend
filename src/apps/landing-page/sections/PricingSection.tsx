import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Starter',
    price: 19,
    description: 'For a small team taking its first support load off email.',
    features: [
      '1,000 conversations / month',
      '1 AI assistant',
      'Knowledge base integration',
      'Basic analytics',
      'Email support',
    ],
    cta: 'Start free trial',
    highlighted: false,
  },
  {
    name: 'Professional',
    price: 49,
    description: 'For a growing team that needs routing and real numbers.',
    features: [
      '10,000 conversations / month',
      'Unlimited AI assistants',
      'Departments and routing',
      'Advanced analytics',
      'Multi-language support',
      'API access',
      'Priority support',
    ],
    cta: 'Start free trial',
    highlighted: true,
    badge: 'Most popular',
  },
  {
    name: 'Enterprise',
    price: null,
    description: 'For organisations with their own rules about everything.',
    features: [
      'Unlimited conversations',
      'Custom analytics',
      'Custom integrations',
      'White-label widget',
      'SLA guarantee',
      'Dedicated support',
      'Custom training',
    ],
    cta: 'Contact sales',
    highlighted: false,
  },
];

export const PricingSection: React.FC = () => {
  return (
    <section id="pricing" className="relative bg-primary-50 py-16 sm:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-ink-500 mb-4">
            Pricing
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tighter text-dark-500 mb-5">
            Priced per conversation, not per seat
          </h2>
          <p className="text-base sm:text-lg text-dark-400 leading-relaxed">
            Add as many agents as you like. You pay for the work the AI does, not for
            the people watching it.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl sm:rounded-3xl p-6 sm:p-8 transition-all duration-300 ${
                plan.highlighted
                  ? 'bg-dark-500 text-white shadow-lift lg:-mt-4 lg:pb-12 ring-1 ring-primary-400/30'
                  : 'bg-white border border-primary-100 hover:border-primary-200 hover:shadow-soft'
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-primary-500 text-white text-xs font-bold uppercase tracking-wide">
                  {plan.badge}
                </span>
              )}

              <h3
                className={`text-lg font-bold mb-2 ${
                  plan.highlighted ? 'text-white' : 'text-dark-500'
                }`}
              >
                {plan.name}
              </h3>
              <p
                className={`text-sm leading-relaxed mb-6 min-h-[2.5rem] ${
                  plan.highlighted ? 'text-secondary-200/80' : 'text-dark-400'
                }`}
              >
                {plan.description}
              </p>

              <div className="flex items-baseline gap-1.5 mb-8">
                {plan.price !== null ? (
                  <>
                    <span
                      className={`text-4xl sm:text-5xl font-extrabold tracking-tighter ${
                        plan.highlighted ? 'text-white' : 'text-dark-500'
                      }`}
                    >
                      ${plan.price}
                    </span>
                    <span
                      className={`text-sm ${
                        plan.highlighted ? 'text-secondary-200/70' : 'text-dark-300'
                      }`}
                    >
                      /month
                    </span>
                  </>
                ) : (
                  <span
                    className={`text-3xl sm:text-4xl font-extrabold tracking-tighter ${
                      plan.highlighted ? 'text-white' : 'text-dark-500'
                    }`}
                  >
                    Let's talk
                  </span>
                )}
              </div>

              <Link
                to={plan.price !== null ? '/register' : '#contact'}
                className={`group flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-xl font-semibold transition-all mb-8 ${
                  plan.highlighted
                    ? 'bg-primary-500 text-white hover:bg-primary-400'
                    : 'bg-dark-500 text-white hover:bg-ink-600'
                }`}
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>

              <ul className="space-y-3.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex items-center justify-center w-5 h-5 rounded-full shrink-0 ${
                        plan.highlighted ? 'bg-primary-500/25' : 'bg-primary-50'
                      }`}
                    >
                      <Check
                        className={`w-3 h-3 ${
                          plan.highlighted ? 'text-secondary-200' : 'text-primary-600'
                        }`}
                      />
                    </span>
                    <span
                      className={`text-sm leading-relaxed ${
                        plan.highlighted ? 'text-secondary-200/90' : 'text-dark-400'
                      }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-dark-300 mt-12">
          All plans include the embeddable widget, the agent dashboard and the knowledge base.
        </p>
      </div>
    </section>
  );
};
