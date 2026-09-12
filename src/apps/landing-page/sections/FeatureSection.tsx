import React from 'react';
import { Zap, Users, BookOpen, MessageSquare, BarChart3, Building2 } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Instant AI responses',
    description:
      'Customers get an answer in seconds, at 3am or on a Sunday, without anyone on your team being awake for it.',
  },
  {
    icon: Users,
    title: 'Smart escalation',
    description:
      'When confidence drops or the question needs judgement, the conversation moves to a human with the full transcript attached.',
  },
  {
    icon: BookOpen,
    title: 'Answers from your docs',
    description:
      'Retrieval over your own articles and FAQs, so replies cite what you actually published rather than inventing something plausible.',
  },
  {
    icon: MessageSquare,
    title: 'Real-time handoff',
    description:
      'Live typing indicators and instant delivery over websockets. The customer never notices the seam between AI and agent.',
  },
  {
    icon: BarChart3,
    title: 'Analytics that mean something',
    description:
      'Resolution rate, escalation rate, response time and satisfaction, measured from your real conversations.',
  },
  {
    icon: Building2,
    title: 'Built multi-tenant',
    description:
      'Departments, roles and per-company isolation from the first line of code, not bolted on when the second customer arrives.',
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="relative bg-primary-50 py-16 sm:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12 sm:mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-ink-500 mb-4">
            What you get
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tighter text-dark-500 mb-5">
            Everything the first reply needs
          </h2>
          <p className="text-base sm:text-lg text-dark-400 leading-relaxed">
            Most support tools make you choose between fast and correct. Grounding the
            model in your own knowledge base, then escalating early, gets you both.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative bg-white rounded-2xl p-6 sm:p-7 border border-primary-100 hover:border-primary-200 hover:shadow-lift transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center mb-5 group-hover:bg-primary-500 transition-colors duration-300">
                  <Icon className="w-6 h-6 text-primary-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-bold text-dark-500 mb-2.5">{feature.title}</h3>
                <p className="text-[0.95rem] text-dark-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Outcome cards, in the shape of the reference site's stat row: three
            dark panels, each led by one oversized figure.

            The two stock office photographs that used to sit here were dropped —
            warm, beige-heavy colour outside the palette, and both carried visible
            generation artifacts ("Orion Blue" printed on the chairs and a mug). */}
        <div className="mb-10 sm:mb-12">
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-dark-500 text-center">
            Why teams move their first tier to rlayAi
          </h3>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
          {[
            {
              figure: '1st tier',
              bg: 'bg-dark-500',
              title: 'Agents stop repeating themselves',
              body: 'The routine questions never reach the queue. What does reach it arrives with the history already read.',
            },
            {
              figure: '4 desks',
              bg: 'bg-ink-500',
              title: 'One queue, split by department',
              body: 'Billing, technical and success each see their own work, and all-rounders see everything.',
            },
            {
              figure: '2 tags',
              bg: 'bg-primary-600',
              title: 'Installed in an afternoon',
              body: 'Two script tags into your site. No build step, no framework requirement, no npm install.',
            },
          ].map((card) => (
            <div
              key={card.figure}
              className={`${card.bg} rounded-2xl sm:rounded-3xl p-7 sm:p-8 flex flex-col justify-between min-h-[15rem]`}
            >
              <p className="text-5xl sm:text-6xl font-extrabold tracking-tighter text-secondary-500 mb-6">
                {card.figure}
              </p>
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-white mb-2.5">{card.title}</h4>
                <p className="text-sm sm:text-base text-secondary-200 leading-relaxed">
                  {card.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
