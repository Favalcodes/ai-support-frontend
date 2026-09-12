import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { avatars } from '../../../assets/brand';

const trustPoints = ['No credit card required', '14-day free trial', 'Cancel anytime'];

const handoffFaces = [
  { src: avatars.bot, label: 'rlayAi assistant' },
  { src: avatars.sarah, label: 'Sarah, Support Specialist' },
  { src: avatars.david, label: 'David, Technical Support' },
  { src: avatars.elena, label: 'Elena, Customer Success' },
];

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Carry the address into signup so the visitor does not retype it
    navigate(`/register${email ? `?email=${encodeURIComponent(email)}` : ''}`);
  };

  return (
    <section className="relative isolate min-h-[42rem] lg:min-h-[46rem] flex items-center overflow-hidden">
      {/*
        HERO BACKDROP SLOT.

        None of the supplied photographs suit a full-bleed hero: they are literal,
        busy office shots with no open area for the headline to sit in. Rather
        than put one behind the type anyway, this stays a flat Midnight ground
        until the generated plate exists.

        To drop the image in: save it to src/assets/brand/lifestyle/hero_backdrop.jpg,
        export it from the brand index, then uncomment the two elements below.
        The generation prompt is in docs/IMAGE_PROMPTS.md.

        <img
          src={lifestyle.heroBackdrop}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-20 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 bg-dark-500/80" aria-hidden="true" />
      */}
      <div className="absolute inset-0 -z-10 bg-dark-500" aria-hidden="true" />

      <div className="relative w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-32 pb-16 sm:pt-36 sm:pb-20 lg:pt-40 lg:pb-28">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-primary-800 border border-primary-600 rounded-full text-xs font-semibold text-secondary-300 mb-6 sm:mb-7">
            <span className="w-2 h-2 rounded-full bg-secondary-400" />
            Answers from your knowledge base, not guesses
          </div>

          <h1 className="text-[2.5rem] sm:text-6xl lg:text-7xl leading-[1.05] font-extrabold tracking-tighter text-white mb-5 sm:mb-6">
            Support that answers
            <span className="block text-secondary-500 mt-1">and knows when to stop</span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-secondary-200 leading-relaxed mb-8 sm:mb-10 max-w-2xl">
            rlayAi replies instantly from your own articles and FAQs. The moment a
            question needs a person, it hands the whole conversation to your team with
            the context already in place.
          </p>

          {/* Inline capture, in the shape of the reference hero */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-2 sm:p-2 sm:bg-white/10 sm:border sm:border-white/20 sm:rounded-2xl max-w-xl mb-8 sm:mb-9"
          >
            <label htmlFor="hero-email" className="sr-only">
              Work email
            </label>
            <input
              id="hero-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your work email"
              className="flex-1 min-w-0 px-5 py-3.5 rounded-xl bg-white/10 sm:bg-transparent border border-white/20 sm:border-0 text-white placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-secondary-400 sm:focus:ring-0"
            />
            <button
              type="submit"
              className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-400 transition-colors shrink-0"
            >
              Start free trial
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-10">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {handoffFaces.map((face) => (
                  <img
                    key={face.label}
                    src={face.src}
                    alt={face.label}
                    title={face.label}
                    className="w-9 h-9 rounded-full ring-2 ring-dark-500 object-cover"
                    loading="lazy"
                  />
                ))}
              </div>
              <p className="text-sm text-secondary-200 leading-tight whitespace-nowrap">
                <span className="block font-semibold text-white">
                  AI first, humans on standby
                </span>
                Escalates with full context
              </p>
            </div>

            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {trustPoints.map((point) => (
                <li key={point} className="flex items-center gap-2 text-sm text-secondary-300">
                  <Check className="w-4 h-4 text-secondary-400 shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
