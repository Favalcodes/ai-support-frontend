import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Github, Mail } from 'lucide-react';
import { logo } from '../../../assets/brand';

/**
 * Wide, link-dense footer on a light ground, in the shape of the reference site:
 * brand block on the left, four grouped link columns, a social row, and a thin
 * legal bar underneath.
 */

type FooterLink = { label: string; href: string; internal?: boolean };

const columns: { title: string; links: FooterLink[] }[] = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'How it works', href: '#how-it-works' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Chat widget', href: '/demo', internal: true },
      { label: 'Agent dashboard', href: '/login', internal: true },
    ],
  },
  {
    title: 'Use cases',
    links: [
      { label: 'Billing support', href: '#features' },
      { label: 'Technical support', href: '#features' },
      { label: 'Customer success', href: '#features' },
      { label: 'General enquiries', href: '#features' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Knowledge base', href: '#how-it-works' },
      { label: 'Install guide', href: '#how-it-works' },
      { label: 'API access', href: '#pricing' },
      { label: 'Status', href: '#contact' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Contact', href: '#contact' },
      { label: 'Support', href: 'mailto:support@rlayai.co' },
      { label: 'Privacy', href: '#contact' },
      { label: 'Terms', href: '#contact' },
    ],
  },
];

const socials = [
  { label: 'Twitter', href: 'https://twitter.com', Icon: Twitter },
  { label: 'LinkedIn', href: 'https://linkedin.com', Icon: Linkedin },
  { label: 'GitHub', href: 'https://github.com', Icon: Github },
  { label: 'Email', href: 'mailto:support@rlayai.co', Icon: Mail },
];

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary-50 border-t border-primary-100">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20">
        <div className="grid gap-10 lg:gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          {/* Brand block */}
          <div className="md:col-span-2 lg:col-span-1">
            <Link to="/" aria-label="rlayAi home" className="inline-block mb-5">
              <img src={logo.full} alt="rlayAi" className="h-8 w-auto" width={1200} height={360} />
            </Link>
            <p className="text-sm text-dark-400 leading-relaxed max-w-xs mb-6">
              AI customer support that answers from your own knowledge base, and hands
              off to your team the moment it should.
            </p>

            <ul className="flex items-center gap-2">
              {socials.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={label}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noreferrer noopener' : undefined}
                    className="flex items-center justify-center w-9 h-9 rounded-lg bg-white border border-primary-100 text-dark-400 hover:text-primary-600 hover:border-primary-300 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Link columns */}
          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="text-sm font-bold text-dark-500 mb-4">{column.title}</h3>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.label}`}>
                    {link.internal ? (
                      <Link
                        to={link.href}
                        className="text-sm text-dark-400 hover:text-primary-600 transition-colors"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm text-dark-400 hover:text-primary-600 transition-colors"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Sign-up strip */}
        <div className="mt-12 lg:mt-14 pt-8 border-t border-primary-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div>
            <p className="text-base font-bold text-dark-500">Ready to try it?</p>
            <p className="text-sm text-dark-400">14 days free. No card required.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-colors"
            >
              Create account
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-white border border-primary-100 text-dark-500 text-sm font-semibold hover:border-primary-300 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>

      {/* Legal bar */}
      <div className="border-t border-primary-100">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-dark-300 order-2 sm:order-1">
            &copy; {year} rlayAi. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 order-1 sm:order-2">
            <a href="#contact" className="text-sm text-dark-300 hover:text-dark-500 transition-colors">
              Privacy
            </a>
            <a href="#contact" className="text-sm text-dark-300 hover:text-dark-500 transition-colors">
              Terms
            </a>
            <a
              href="mailto:support@rlayai.co"
              className="text-sm text-dark-300 hover:text-dark-500 transition-colors"
            >
              support@rlayai.co
            </a>
          </div>
        </div>
      </div>

      {/*
        Oversized wordmark watermark across the base of the footer, in the shape
        of the reference site but deliberately more pronounced: Euphoria Blue on
        the near-white footer rather than a barely-there tint.

        Sized in vw so it always spans the full width and is cropped by the
        footer's bottom edge at every breakpoint. Decorative only - the real
        wordmark is the logo at the top of the footer, so this is hidden from
        assistive technology and not selectable.
      */}
      <div
        className="relative overflow-hidden select-none pointer-events-none"
        aria-hidden="true"
      >
        <span className="block -mb-[3vw] text-center font-extrabold leading-[0.76] text-[36vw] tracking-[-0.06em] text-secondary-500 whitespace-nowrap">
          rlay<span className="text-primary-500">Ai</span>
        </span>
      </div>
    </footer>
  );
};
