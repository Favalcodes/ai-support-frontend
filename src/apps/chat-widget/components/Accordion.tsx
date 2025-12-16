import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AccordionItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({ items, className = '' }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-shadow hover:shadow-sm"
        >
          <button
            onClick={() => toggleItem(item.id)}
            className="w-full text-left p-3 flex items-start justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex-1 pr-3">
              {item.category && (
                <span className="inline-block px-2 py-0.5 text-xs font-medium text-primary-700 bg-primary-100 rounded mb-1">
                  {item.category}
                </span>
              )}
              <p className="text-sm font-medium text-gray-900">{item.question}</p>
            </div>
            {expandedId === item.id ? (
              <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
            )}
          </button>
          {expandedId === item.id && item.answer && (
            <div className="px-3 pb-3 border-t border-gray-100">
              <p className="text-sm text-gray-700 mt-2">{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
