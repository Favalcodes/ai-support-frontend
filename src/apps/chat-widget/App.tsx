import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, MousePointerClick } from 'lucide-react';
import { ChatWidgetContainer } from './components/ChatWidgetContainer';
import { logo } from '../../assets/brand';

/**
 * Public demo page for the embeddable widget.
 *
 * The install snippet shown here is the same one the dashboard generates. It
 * previously documented `window.getLyncConfig` and a cdn.supporthub.ai URL,
 * neither of which exists, alongside the old chocolate default colour.
 */

const DEMO_COMPANY_ID = 'd37e75b2-e62f-4c76-a339-e8b125d85706';

const installSnippet = `<!-- rlayAi Widget -->
<script>
  window.chatWidgetConfig = {
    companyId: 'YOUR_COMPANY_ID',
    apiUrl: 'https://api.rlayai.co/api/v1'
  };
</script>
<script src="https://app.rlayai.co/widget/chat-widget.js" async></script>
<!-- End rlayAi Widget -->`;

const options: { name: string; type: string; default: string; note: string }[] = [
  { name: 'companyId', type: 'string', default: 'required', note: 'Found in Widget Settings' },
  { name: 'apiUrl', type: 'string', default: "the script's origin", note: 'Your API root' },
  { name: 'user', type: 'object', default: 'none', note: 'Skips the pre-chat form for signed-in users' },
  { name: 'position', type: "'bottom-right' | 'bottom-left'", default: 'bottom-right', note: 'Which corner it docks to' },
];

export const ChatWidgetApp: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-500">
      {/* Slim header */}
      <header className="border-b border-ink-800">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <Link to="/" aria-label="rlayAi home">
            <img src={logo.fullOnDark} alt="rlayAi" className="h-10 w-auto" />
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-secondary-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to site
            </Link>
            <Link
              to="/register"
              className="group inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-primary-500 text-white text-sm font-semibold hover:bg-primary-400 transition-colors"
            >
              Start free trial
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-14 sm:py-20">
        <p className="text-sm font-semibold uppercase tracking-widest text-secondary-400 mb-4">
          Live demo
        </p>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tighter text-white mb-5">
          This page has the widget on it
        </h1>
        <p className="text-base sm:text-lg text-secondary-200 leading-relaxed max-w-2xl mb-8">
          Exactly what your customers would see. It is docked in the bottom-right
          corner of this page — open it, ask something, and watch it answer from the
          knowledge base before offering a human.
        </p>

        <div className="inline-flex items-center gap-2.5 px-4 py-3 rounded-xl bg-primary-800 border border-primary-600 text-secondary-200 text-sm mb-14">
          <MousePointerClick className="w-4 h-4 text-secondary-400 shrink-0" />
          Open the chat button in the bottom-right corner to try it
        </div>

        {/* Install */}
        <section className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
            Adding it to your own site
          </h2>
          <p className="text-secondary-200 leading-relaxed mb-5 max-w-2xl">
            Two script tags, anywhere before <code className="text-secondary-300">&lt;/body&gt;</code>.
            Your dashboard generates this with your company ID already filled in.
          </p>
          <div className="rounded-2xl bg-dark-700 border border-ink-800 p-5 overflow-x-auto">
            <pre className="text-xs sm:text-sm leading-relaxed text-secondary-300 font-mono">
              <code>{installSnippet}</code>
            </pre>
          </div>
        </section>

        {/* Options */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-5">
            Configuration
          </h2>
          <div className="rounded-2xl border border-ink-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[34rem]">
                <thead className="bg-dark-700">
                  <tr className="text-left text-white">
                    <th className="py-3 px-4 font-semibold">Option</th>
                    <th className="py-3 px-4 font-semibold">Type</th>
                    <th className="py-3 px-4 font-semibold">Default</th>
                    <th className="py-3 px-4 font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {options.map((opt, i) => (
                    <tr
                      key={opt.name}
                      className={i < options.length - 1 ? 'border-b border-ink-800' : ''}
                    >
                      <td className="py-3 px-4 font-mono text-secondary-300">{opt.name}</td>
                      <td className="py-3 px-4 text-secondary-400">{opt.type}</td>
                      <td className="py-3 px-4 text-secondary-400">{opt.default}</td>
                      <td className="py-3 px-4 text-secondary-400">{opt.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      {/* The widget itself, which is the point of the page */}
      <ChatWidgetContainer companyId={DEMO_COMPANY_ID} position="bottom-right" />
    </div>
  );
};
