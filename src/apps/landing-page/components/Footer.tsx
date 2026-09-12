import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Github, Mail } from 'lucide-react';
import { logo } from '../../../assets/brand';

/**
 * Dark, link-dense footer in the shape of the reference site: five grouped link
 * columns across the top, a brand block with social icons, a thin legal row, and
 * an oversized wordmark watermark cropped by the bottom edge.
 *
 * The watermark is Indigo on Midnight — a step brighter than the reference's
 * barely-there tint, which is what was asked for, without competing with the
 * links above it.
 */

type FooterLink = { label: string; href: string; internal?: boolean };

const columns: { title: string; links: FooterLink[] }[] = [
  {
    title: 'Product',
    links: [
      { label: 'Chat widget', href: '/demo', internal: true },
      { label: 'Agent dashboard', href: '/login', internal: true },
      { label: 'Knowledge base', href: '#how-it-works' },
      { label: 'Departments', href: '#how-it-works' },
      { label: 'Analytics', href: '#features' },
    ],
  },
  {
    title: 'Features',
    links: [
      { label: 'Instant AI replies', href: '#features' },
      { label: 'Smart escalation', href: '#features' },
      { label: 'Real-time handoff', href: '#features' },
      { label: 'Multi-tenant', href: '#features' },
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
    title: 'Company',
    links: [
      { label: 'Pricing', href: '#pricing' },
      { label: 'Contact', href: '#contact' },
      { label: 'Privacy', href: '#contact' },
      { label: 'Terms', href: '#contact' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Install guide', href: '#how-it-works' },
      { label: 'API access', href: '#pricing' },
      { label: 'Status', href: '#contact' },
      { label: 'Email us', href: 'mailto:support@rlayai.co' },
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
    <footer className="bg-dark-500">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-14 sm:pt-16 lg:pt-20 pb-10">
        <div className="grid gap-10 lg:gap-8 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(5,1fr)]">
          {/* Brand block */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" aria-label="rlayAi home" className="inline-block mb-5">
              <img
                src={logo.fullOnDark}
                alt="rlayAi"
                className="h-12 w-auto"
                width={1200}
                height={360}
              />
            </Link>
            <p className="text-sm text-secondary-300 leading-relaxed max-w-xs mb-6">
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
                    className="flex items-center justify-center w-9 h-9 rounded-lg bg-ink-800 text-secondary-300 hover:bg-primary-500 hover:text-white transition-colors"
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
              <h3 className="text-sm font-bold text-white mb-4">{column.title}</h3>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.label}`}>
                    {link.internal ? (
                      <Link
                        to={link.href}
                        className="text-sm text-secondary-300 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm text-secondary-300 hover:text-white transition-colors"
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

        {/* Legal row */}
        <div className="mt-12 lg:mt-14 pt-6 border-t border-ink-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-secondary-400 order-2 sm:order-1">
            &copy; {year} rlayAi. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 order-1 sm:order-2">
            <a href="#contact" className="text-sm text-secondary-400 hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#contact" className="text-sm text-secondary-400 hover:text-white transition-colors">
              Terms
            </a>
            <a
              href="mailto:support@rlayai.co"
              className="text-sm text-secondary-400 hover:text-white transition-colors"
            >
              support@rlayai.co
            </a>
          </div>
        </div>
      </div>

      {/* Wordmark watermark, cropped by the bottom edge */}
      <div className="relative overflow-hidden select-none pointer-events-none" aria-hidden="true">
        <span className="block -mb-[4vw] text-center font-extrabold leading-[0.76] text-[34vw] tracking-[-0.06em] text-ink-600 whitespace-nowrap">
          rlay<span className="text-ink-500">Ai</span>
        </span>
      </div>
    </footer>
  );
};
