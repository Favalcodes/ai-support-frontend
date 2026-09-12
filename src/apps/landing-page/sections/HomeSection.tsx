import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { avatars, art } from '../../../assets/brand';

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
      {/* Generated brand plate: the relay loop resolving into a chat bubble.
          The subject sits in the right third, so the headline on the left stays
          clear of it. A flat Midnight wash at 55%, the measured minimum that keeps white type above AA (5.13:1)
          without flattening the artwork. */}
      <img
        src={art.heroBackdrop}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-20 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 -z-10 bg-dark-500/55" aria-hidden="true" />

      <div className="relative w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-32 pb-16 sm:pt-36 sm:pb-20 lg:pt-40 lg:pb-28">
        <div className="max-w-3xl">

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

          <div className="flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-10">
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex -space-x-2.5 shrink-0">
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
              <p className="text-sm text-secondary-200 leading-tight">
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
