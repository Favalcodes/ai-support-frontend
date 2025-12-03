import React, { useState } from 'react';
import { MessageSquare, HelpCircle, BookOpen } from 'lucide-react';

interface TabbedChatInterfaceProps {
  children: {
    chatTab: React.ReactNode;
    faqTab: React.ReactNode;
    knowledgeTab: React.ReactNode;
  };
}

type TabType = 'chat' | 'faq' | 'knowledge';

export const TabbedChatInterface: React.FC<TabbedChatInterfaceProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabType>('chat');

  const tabs = [
    { id: 'chat' as TabType, label: 'Chat', icon: MessageSquare },
    { id: 'faq' as TabType, label: 'FAQ', icon: HelpCircle },
    { id: 'knowledge' as TabType, label: 'Knowledge', icon: BookOpen },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 bg-white">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-cyan-600 border-b-2 border-cyan-600 bg-cyan-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'chat' && children.chatTab}
        {activeTab === 'faq' && children.faqTab}
        {activeTab === 'knowledge' && children.knowledgeTab}
      </div>
    </div>
  );
};
