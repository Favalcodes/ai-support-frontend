import React from 'react';
import {
  Zap,
  Users,
  Shield,
  MessageSquare,
  BarChart3,
  Globe,
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Zap,
      title: 'Instant AI Responses',
      description:
        'Get answers to customer queries in seconds with our advanced AI trained on your knowledge base.',
      color: 'cyan',
    },
    {
      icon: Users,
      title: 'Smart Escalation',
      description:
        'Seamlessly transfer complex queries to human agents when AI confidence is low.',
      color: 'mauve',
    },
    {
      icon: Shield,
      title: 'Knowledge Base RAG',
      description:
        'AI searches your FAQs and articles to provide accurate, contextual responses.',
      color: 'sky',
    },
    {
      icon: MessageSquare,
      title: 'Real-time Chat',
      description:
        'WebSocket-powered live chat for instant communication with customers.',
      color: 'cyan',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description:
        'Track metrics, agent performance, and customer satisfaction in real-time.',
      color: 'mauve',
    },
    {
      icon: Globe,
      title: 'Multi-Company Support',
      description:
        'Manage multiple companies with isolated data and customized branding.',
      color: 'sky',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      cyan: { bg: 'bg-primary-100', text: 'text-primary-600' },
      mauve: { bg: 'bg-primary-100', text: 'text-primary-600' },
      sky: { bg: 'bg-primary-100', text: 'text-primary-600' },
    };
    return colors[color] || colors.cyan;
  };

  return (
    <section id="features" className="py-20 px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Everything you need
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful features that help you deliver world-class customer support at scale
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const colors = getColorClasses(feature.color);
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className={`w-6 h-6 ${colors.text}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};