import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Loader2, MessageSquare, HelpCircle } from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

interface FAQTabProps {
  companyId: string;
  departmentId?: string;
  onStartChat?: () => void;
}

export const FAQTab: React.FC<FAQTabProps> = ({ companyId, departmentId, onStartChat }) => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadFAQs();
  }, [companyId, departmentId]);

  const loadFAQs = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      // const data = await knowledgeService.getFAQs({ companyId, departmentId, limit: 10 });

      // Demo data
      const demoFAQs: FAQ[] = [
        {
          id: '1',
          question: 'How do I reset my password?',
          answer: 'To reset your password, click on the "Forgot Password" link on the login page. You will receive an email with instructions to create a new password.',
          category: 'Account',
        },
        {
          id: '2',
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise customers.',
          category: 'Billing',
        },
        {
          id: '3',
          question: 'How long does shipping take?',
          answer: 'Standard shipping typically takes 3-5 business days. Express shipping is available and takes 1-2 business days.',
          category: 'Shipping',
        },
        {
          id: '4',
          question: 'Can I cancel my subscription?',
          answer: 'Yes, you can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period.',
          category: 'Account',
        },
        {
          id: '5',
          question: 'Do you offer refunds?',
          answer: 'We offer a 30-day money-back guarantee. If you\'re not satisfied, contact our support team within 30 days of purchase for a full refund.',
          category: 'Billing',
        },
      ];

      setFaqs(demoFAQs);
    } catch (error) {
      console.error('Failed to load FAQs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="p-4 bg-white border-b border-gray-200 flex-shrink-0">
        <h3 className="text-lg font-semibold text-gray-900">Frequently Asked Questions</h3>
        <p className="text-sm text-gray-600 mt-1">
          Find quick answers to common questions
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 min-h-0">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader2 className="w-8 h-8 text-cyan-500 animate-spin mb-3" />
            <p className="text-sm text-gray-600">Loading FAQs...</p>
          </div>
        ) : faqs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <HelpCircle className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-gray-600 font-medium">No FAQs available</p>
            <p className="text-gray-500 text-sm mt-2">
              Can't find what you're looking for?
            </p>
            {onStartChat && (
              <button
                onClick={onStartChat}
                className="mt-4 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
              >
                Chat with Support
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-shadow hover:shadow-md"
              >
                <button
                  onClick={() => toggleExpand(faq.id)}
                  className="w-full px-4 py-3 flex items-start justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 pr-4">
                    {faq.category && (
                      <span className="inline-block px-2 py-0.5 text-xs font-medium text-cyan-700 bg-cyan-100 rounded mb-1">
                        {faq.category}
                      </span>
                    )}
                    <p className="text-sm font-medium text-gray-900">{faq.question}</p>
                  </div>
                  {expandedId === faq.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>

                {expandedId === faq.id && (
                  <div className="px-4 pb-3 border-t border-gray-100">
                    <p className="text-sm text-gray-700 mt-3">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer - Still need help? */}
      {!isLoading && faqs.length > 0 && onStartChat && (
        <div className="p-4 bg-white border-t border-gray-200 flex-shrink-0">
          <div className="bg-cyan-50 rounded-lg p-3 text-center">
            <p className="text-sm text-gray-700 mb-2">Still need help?</p>
            <button
              onClick={onStartChat}
              className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors text-sm font-medium"
            >
              <MessageSquare className="w-4 h-4" />
              Chat with Support
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
