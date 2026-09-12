import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { illustrations, avatars } from '../../../assets/brand';

/**
 * Stepped process section, in the shape of the reference site: a sticky column
 * on the left holding the section framing, and tall numbered panels on the right
 * that scroll past it. Each panel carries its own visual, so the sequence reads
 * without any tab or scroll-sync interaction to go wrong.
 */

const steps = [
  {
    number: '01',
    title: 'Add your knowledge',
    description:
      'Paste in your FAQs and help articles. rlayAi chunks and embeds them, so every answer is drawn from something you actually published.',
    points: ['Articles and FAQs', 'Embedded automatically', 'Re-indexed on every edit'],
  },
  {
    number: '02',
    title: 'Embed the widget',
    description:
      'Copy two script tags out of your dashboard into your site. No build step, no framework requirement, no npm install.',
    points: ['Two script tags', 'Works on any stack', 'Colour and copy are yours'],
  },
  {
    number: '03',
    title: 'Watch the queue shrink',
    description:
      'The AI takes the repetitive questions. Anything needing judgement moves to your team with the transcript already attached.',
    points: ['Instant first reply', 'Escalation with context', 'Routed by department'],
  },
];

const departments = [
  { src: illustrations.deptBilling, label: 'Billing' },
  { src: illustrations.deptTechnical, label: 'Technical' },
  { src: illustrations.deptSuccess, label: 'Customer Success' },
  { src: illustrations.deptGeneral, label: 'General' },
];

/** A small, purpose-built visual per step. Flat colour only. */
const StepVisual: React.FC<{ index: number }> = ({ index }) => {
  if (index === 0) {
    return (
      <div className="space-y-2.5">
        {['Refund policy', 'Shipping times', 'Cancelling a plan'].map((doc, i) => (
          <div
            key={doc}
            className="flex items-center justify-between px-4 py-3 bg-white border border-primary-100 rounded-xl"
          >
            <span className="text-sm font-medium text-dark-500">{doc}</span>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-ink-500">
              <Check className="w-3.5 h-3.5" />
              {i === 2 ? 'Indexing' : 'Indexed'}
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (index === 1) {
    return (
      <div className="rounded-xl bg-dark-500 p-4 overflow-x-auto">
        <pre className="text-[0.72rem] sm:text-xs leading-relaxed text-secondary-300 font-mono">
          <code>{`<script>
  window.chatWidgetConfig = {
    companyId: 'your-company-id'
  };
</script>
<script src="…/widget/chat-widget.js" async></script>`}</code>
        </pre>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      <div className="flex justify-end">
        <p className="bg-primary-500 text-white text-sm rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[85%]">
          Where is my refund?
        </p>
      </div>
      <div className="flex gap-2.5">
        <img src={avatars.bot} alt="" aria-hidden="true" className="w-7 h-7 rounded-full shrink-0" />
        <p className="bg-white text-dark-500 text-sm rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[85%] border border-primary-100">
          Refunds land within 5 days. Yours was issued on 3 May.
        </p>
      </div>
      <div className="flex items-center gap-2.5 px-3 py-2.5 bg-secondary-200 border border-secondary-400 rounded-xl">
        <img src={avatars.sarah} alt="" aria-hidden="true" className="w-7 h-7 rounded-full shrink-0" />
        <p className="text-xs text-ink-700 font-medium leading-snug">
          Escalated to <span className="font-bold">Sarah</span> — full thread attached
        </p>
      </div>
    </div>
  );
};

export const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="relative bg-white py-16 sm:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-16 items-start">
          {/* Sticky framing */}
          <div className="min-w-0 lg:sticky lg:top-28">
            <p className="text-sm font-semibold uppercase tracking-widest text-ink-500 mb-4">
              How it works
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tighter text-dark-500 mb-5">
              Live at ANYTIME
            </h2>
            <p className="text-base sm:text-lg text-dark-400 leading-relaxed mb-8">
              Three steps, none of which need an engineer for longer than a coffee.
            </p>
            <Link
              to="/register"
              className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-colors"
            >
              Start free trial
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Steps */}
          <ol className="min-w-0 space-y-5 sm:space-y-6">
            {steps.map((step, index) => (
              <li
                key={step.number}
                className="min-w-0 rounded-2xl sm:rounded-3xl bg-primary-50 border border-primary-100 p-6 sm:p-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-500 text-white text-sm font-bold shrink-0">
                    {step.number}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-dark-500">{step.title}</h3>
                </div>

                <p className="text-dark-400 leading-relaxed mb-5">{step.description}</p>

                <ul className="flex flex-wrap gap-x-5 gap-y-2 mb-6">
                  {step.points.map((point) => (
                    <li key={point} className="flex items-center gap-1.5 text-sm text-ink-600">
                      <Check className="w-4 h-4 text-primary-500 shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>

                <StepVisual index={index} />
              </li>
            ))}
          </ol>
        </div>

        {/* Routing */}
        <div className="mt-16 sm:mt-24 rounded-2xl sm:rounded-3xl bg-dark-500 p-6 sm:p-9 lg:p-12">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-10 items-center">
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 tracking-tight">
                Routed to the right desk
              </h3>
              <p className="text-secondary-200 leading-relaxed">
                Visitors pick a department before they ever type, so an escalated billing
                question lands with the people who can actually refund it. Agents can be
                scoped to one department or set as all-rounders.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {departments.map((dept) => (
                <div
                  key={dept.label}
                  className="flex flex-col items-center gap-3 p-4 sm:p-5 rounded-2xl bg-white"
                >
                  <img src={dept.src} alt="" aria-hidden="true" className="w-11 h-11" loading="lazy" />
                  <span className="text-sm font-semibold text-dark-500 text-center leading-tight">
                    {dept.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
