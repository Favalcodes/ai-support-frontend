import React from 'react';

interface PoweredByProps {
  /**
   * Hidden for white-label customers. The Enterprise plan advertises a
   * white-label widget, so this is a prop rather than a hardcoded badge —
   * wire it to the widget config when that field exists.
   */
  hidden?: boolean;
  /** Light bar for the widget body, or dark for use on a brand-coloured ground. */
  tone?: 'light' | 'dark';
}

const SITE_URL = 'https://rlayai.co';

/**
 * "Powered by rlayAi" bar, pinned to the base of the widget.
 *
 * Deliberately quiet: it sits under the conversation, not over it, and uses the
 * wordmark's own two-tone treatment (Midnight "rlay" + Orion "Ai") rather than
 * loading the logo image, which would add ~95 KB to a widget that hosts embed on
 * their own pages.
 */
export const PoweredBy: React.FC<PoweredByProps> = ({ hidden = false, tone = 'light' }) => {
  if (hidden) return null;

  const isDark = tone === 'dark';

  return (
    <a
      href={SITE_URL}
      target="_blank"
      rel="noreferrer noopener"
      className={`flex items-center justify-center gap-1.5 py-2.5 text-[0.6875rem] font-medium border-t transition-colors ${
        isDark
          ? 'bg-dark-500 border-ink-800 text-secondary-400 hover:text-secondary-200'
          : 'bg-white border-primary-100 text-dark-300 hover:text-dark-500'
      }`}
    >
      {/* The relay loop, drawn inline so the badge costs nothing to load */}
      <svg
        viewBox="0 0 28 14"
        className="w-4 h-4 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        aria-hidden="true"
      >
        <path d="M7 3.2a3.8 3.8 0 1 0 0 7.6c3.4 0 4.6-7.6 8-7.6a3.8 3.8 0 1 1 0 7.6c-1.2 0-2.1-.9-2.8-2" />
      </svg>
      <span>
        Powered by{' '}
        <span className={isDark ? 'font-bold text-white' : 'font-bold text-dark-500'}>
          rlay
        </span>
        <span className="font-bold text-primary-500">Ai</span>
      </span>
    </a>
  );
};
