import React, { useState, useEffect } from 'react';
import { X, Send, Home as HomeIcon, MessageSquare, BookOpen, ArrowLeft, Minimize2, Plus } from 'lucide-react';
import { ConnectedChatWindow } from './ConnectedChatWindow';
import { PreChatForm } from './PreChatForm';
import { Accordion } from './Accordion';
import { useChat } from '@/hooks/useChat';
import { useChatStore } from '@/stores/chatStore';
import { apiService } from '@/services/api.service';
import { knowledgeBaseService } from '@/services/knowledgeBase.service';
import { departmentService, type Department } from '@/services/department.service';
import { conversationService, type Conversation } from '@/services/conversation.service';
import type { FAQ, Article } from '@/types/knowledge.types';
import { PoweredBy } from './PoweredBy';

interface IntercomStyleWidgetProps {
  onClose: () => void;
  onMinimize?: () => void;
  companyId: string;
  companyName?: string;
  user?: any; // User from company platform (if auto-synced)
}

type TabType = 'home' | 'messages' | 'articles';
type MessagesView = 'list' | 'departments' | 'form' | 'chat';

export const IntercomStyleWidget: React.FC<IntercomStyleWidgetProps> = ({
  onClose,
  onMinimize,
  companyId,
  companyName = 'Support',
  user: externalUser,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [messagesView, setMessagesView] = useState<MessagesView>('list');

  const {
    conversation,
    user: chatUser,
    startConversation,
  } = useChat(companyId);

  const { setConversation, setMessages } = useChatStore();

  // Auto-sync with external user if provided
  useEffect(() => {
    if (externalUser && !chatUser) {
      // Auto-login user from company platform
      // This would call your authentication service
      console.log('Auto-syncing user from company platform:', externalUser);
    }
  }, [externalUser, chatUser]);

  const isLoggedIn = !!chatUser || !!externalUser;

  // Handle sending message from Home
  const handleSendMessage = () => {
    setActiveTab('messages');
    if (!isLoggedIn) {
      // Require login before starting conversation - skip department selection, go to form
      setMessagesView('form');
    } else if (conversation) {
      setMessagesView('chat');
    } else {
      setMessagesView('list');
    }
  };

  // Handle starting new conversation
  const handleStartNewConversation = () => {
    if (!isLoggedIn) {
      // Require login before starting conversation
      setMessagesView('form');
    } else {
      // User is logged in, show department selection (optional)
      setMessagesView('departments');
    }
  };

  // Handle department selection
  const handleSelectDepartment = async (deptId: string) => {
    try {
      await startConversation({
        first_name: externalUser?.firstName || chatUser?.first_name,
        last_name: externalUser?.lastName || chatUser?.last_name,
        email: externalUser?.email || chatUser?.email,
        category_id: deptId,
      });
      setMessagesView('chat');
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  };

  // Handle skipping department selection
  const handleSkipDepartment = async () => {
    try {
      await startConversation({
        first_name: externalUser?.firstName || chatUser?.first_name,
        last_name: externalUser?.lastName || chatUser?.last_name,
        email: externalUser?.email || chatUser?.email,
      });
      setMessagesView('chat');
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  };

  // Handle selecting existing conversation
  const handleSelectConversation = async (conversationId: string) => {
    // Set the conversation and switch to chat view
    setConversation({ id: conversationId } as any);

    // Load conversation history
    try {
      const history = await apiService.getConversationHistory(conversationId);
      setMessages(history);
    } catch (error) {
      console.error('Failed to load conversation history:', error);
    }

    setMessagesView('chat');
  };

  // Handle form submission
  const handleFormSubmit = async (userData: any) => {
    try {
      await startConversation({
        ...userData,
        // category_id is now optional and comes from userData if provided
      });
      setMessagesView('chat');
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  };

  // Handle back from chat
  const handleBackFromChat = () => {
    setMessagesView('list');
  };

  // Handle resume conversation from home screen
  const handleResumeConversation = () => {
    setActiveTab('messages');
    setMessagesView('chat');
  };

  return (
    <div className="w-[400px] h-[650px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
      {/* Header */}
      <ChatHeader
        companyName={companyName}
        onClose={onClose}
        onMinimize={onMinimize}
        showBack={messagesView === 'chat'}
        onBack={handleBackFromChat}
      />

      {/* Tab Navigation - Only show when not in active chat */}
      {messagesView !== 'chat' && (
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      )}

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {/* Home Tab */}
        {activeTab === 'home' && messagesView !== 'chat' && (
          <HomeTab
            onSendMessage={handleSendMessage}
            onResumeConversation={handleResumeConversation}
            companyId={companyId}
            lastConversation={isLoggedIn ? conversation : null}
          />
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <>
            {messagesView === 'list' && (
              <MessagesListView
                onStartNew={handleStartNewConversation}
                onSelectConversation={handleSelectConversation}
                companyId={companyId}
                userId={chatUser?.id || externalUser?.id}
              />
            )}

            {messagesView === 'departments' && (
              <DepartmentSelection
                onSelectDepartment={handleSelectDepartment}
                onSkip={handleSkipDepartment}
                companyId={companyId}
              />
            )}

            {messagesView === 'form' && (
              <PreChatFormView
                onSubmit={handleFormSubmit}
                companyId={companyId}
              />
            )}

            {messagesView === 'chat' && conversation && chatUser && (
              <ConnectedChatWindow
                companyId={companyId}
                userId={chatUser.id}
                conversationId={conversation.id}
              />
            )}
          </>
        )}

        {/* Articles Tab */}
        {activeTab === 'articles' && messagesView !== 'chat' && (
          <ArticlesTab companyId={companyId} />
        )}
      </div>

      {/* Attribution, pinned to the base across every tab */}
      <PoweredBy />
    </div>
  );
};

// Chat Header Component
interface ChatHeaderProps {
  companyName: string;
  onClose: () => void;
  onMinimize?: () => void;
  showBack?: boolean;
  onBack?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  companyName,
  onClose,
  onMinimize,
  showBack,
  onBack,
}) => {
  return (
    <div className="bg-primary-500 px-5 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {showBack && onBack && (
          <button
            onClick={onBack}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
        )}
        <div>
          <h2 className="text-white font-semibold text-lg">{companyName}</h2>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-green-300 rounded-full"></div>
            <span className="text-white/90 text-sm">We're online</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {onMinimize && (
          <button
            onClick={onMinimize}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Minimize"
          >
            <Minimize2 className="w-5 h-5 text-white" />
          </button>
        )}
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};

// Tab Navigation Component
interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home' as TabType, label: 'Home', icon: HomeIcon },
    { id: 'messages' as TabType, label: 'Messages', icon: MessageSquare },
    { id: 'articles' as TabType, label: 'Articles', icon: BookOpen },
  ];

  return (
    <div className="flex border-b border-gray-200">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              isActive
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Icon className="w-4 h-4" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

// Home Tab Component
interface HomeTabProps {
  onSendMessage: () => void;
  companyId: string;
  lastConversation: any;
  onResumeConversation?: () => void;
}

const HomeTab: React.FC<HomeTabProps> = ({ onSendMessage, companyId, lastConversation, onResumeConversation }) => {
  const [recentFAQs, setRecentFAQs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFAQs = async () => {
      try {
        setIsLoading(true);
        const faqs = await knowledgeBaseService.getFAQs(companyId);
        // Get first 15 FAQs
        setRecentFAQs(faqs.slice(0, 15));
      } catch (error) {
        console.error('Failed to load FAQs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFAQs();
  }, [companyId]);

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Welcome Section */}
      <div className="p-6 text-center">
        <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-2xl">👋</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Hi there!</h3>
        <p className="text-gray-600">How can we help you today?</p>
      </div>

      {/* Send Message CTA */}
      <div className="px-4 mb-6">
        <button
          onClick={onSendMessage}
          className="w-full bg-white border-2 border-gray-200 hover:border-primary-500 rounded-xl py-3.5 px-4 text-gray-700 hover:text-primary-600 font-medium transition-all flex items-center justify-between group"
        >
          <span>Send us a message</span>
          <div className="w-8 h-8 bg-gray-100 group-hover:bg-primary-50 rounded-lg flex items-center justify-center transition-colors">
            <Send className="w-4 h-4 text-gray-500 group-hover:text-primary-600" />
          </div>
        </button>
      </div>

      {/* Last Conversation (if logged in) */}
      {lastConversation && (
        <div className="px-4 mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Recent conversation</h4>
          <button
            onClick={onResumeConversation}
            className="w-full bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Your last conversation</p>
                <p className="text-xs text-gray-500 mt-1">Click to continue</p>
              </div>
              <span className="text-xs text-gray-400">Just now</span>
            </div>
          </button>
        </div>
      )}

      {/* Recent FAQs */}
      <div className="px-4 pb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Popular questions</h4>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : recentFAQs.length > 0 ? (
          <Accordion
            items={recentFAQs.map(faq => ({
              id: faq.id,
              question: faq.question,
              answer: faq.answer || '',
              category: faq.category_name
            }))}
          />
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">No FAQs available yet</p>
        )}
      </div>
    </div>
  );
};

// Messages List View Component
interface MessagesListViewProps {
  onStartNew: () => void;
  companyId: string;
  userId?: string;
  onSelectConversation?: (conversationId: string) => void;
}

const MessagesListView: React.FC<MessagesListViewProps> = ({ onStartNew, companyId, userId, onSelectConversation }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadConversations = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await conversationService.getUserConversationHistory(userId, companyId, 10);
        setConversations(data);
      } catch (error) {
        console.error('Failed to load conversations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConversations();
  }, [userId, companyId]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <MessageSquare className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversations yet</h3>
        <p className="text-gray-600 text-center mb-6">Start a conversation with our team</p>
        <button
          onClick={onStartNew}
          className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Start new conversation
        </button>
      </div>
    );
  }

  const handleConversationClick = (conversationId: string) => {
    if (onSelectConversation) {
      onSelectConversation(conversationId);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => handleConversationClick(conv.id)}
              className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {conv.last_message || 'New conversation'}
                  </p>
                  <span className="text-xs text-gray-500 mt-1 inline-block">
                    {formatTime(conv.last_activity || conv.updated_at)}
                  </span>
                  {conv.status && (
                    <span className={`ml-2 text-xs px-2 py-0.5 rounded ${
                      conv.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {conv.status}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onStartNew}
          className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-3 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Start new conversation
        </button>
      </div>
    </div>
  );
};

// Department Selection Component
interface DepartmentSelectionProps {
  onSelectDepartment: (deptId: string) => void;
  onSkip: () => void;
  companyId: string;
}

const DepartmentSelection: React.FC<DepartmentSelectionProps> = ({
  onSelectDepartment,
  onSkip,
  companyId,
}) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        setIsLoading(true);
        const data = await departmentService.getPublicDepartments(companyId);
        setDepartments(data.filter(d => d.is_active));
      } catch (error) {
        console.error('Failed to load departments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDepartments();
  }, [companyId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Choose a team (Optional)</h3>
        <p className="text-gray-600 text-sm">Select the team that can best help you, or continue without selecting</p>
      </div>

      {departments.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {departments.map((dept) => (
              <button
                key={dept.id}
                onClick={() => onSelectDepartment(dept.id)}
                className="p-4 bg-gray-50 hover:bg-gray-100 border-2 border-transparent hover:border-primary-500 rounded-xl transition-all text-left"
              >
                <div className="text-2xl mb-2">{dept.icon || '💬'}</div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">{dept.name}</h4>
                <p className="text-xs text-gray-600">{dept.description || 'How can we help you?'}</p>
              </button>
            ))}
          </div>
          <button
            onClick={onSkip}
            className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors"
          >
            Continue without selecting
          </button>
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No departments available</p>
          <button
            onClick={onSkip}
            className="px-4 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
};

// Pre-Chat Form View Component
interface PreChatFormViewProps {
  onSubmit: (data: any) => void;
  onBack?: () => void;
  companyId: string;
}

const PreChatFormView: React.FC<PreChatFormViewProps> = ({ onSubmit, onBack, companyId }) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        setIsLoading(true);
        const data = await departmentService.getPublicDepartments(companyId);
        setDepartments(data.filter(d => d.is_active));
      } catch (error) {
        console.error('Failed to load departments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDepartments();
  }, [companyId]);

  const categories = departments.map(dept => ({
    id: dept.id,
    name: dept.name
  }));

  return (
    <div className="flex flex-col h-full">
      {onBack && (
        <div className="p-4 border-b border-gray-200 flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h3 className="font-semibold text-gray-900">Start a conversation</h3>
            <p className="text-xs text-gray-600">We'll need some details first</p>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <PreChatForm
          onSubmit={onSubmit}
          isLoading={false}
          categories={categories}
        />
      </div>
    </div>
  );
};

// Articles Tab Component
interface ArticlesTabProps {
  companyId: string;
}

const ArticlesTab: React.FC<ArticlesTabProps> = ({ companyId }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setIsLoading(true);
        const data = await knowledgeBaseService.getArticles(companyId);
        // Get first 15 articles sorted by most recent
        setArticles(data.slice(0, 15));
      } catch (error) {
        console.error('Failed to load articles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadArticles();
  }, [companyId]);

  const stripHtml = (html: string): string => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const plainText = stripHtml(content);
    const wordCount = plainText.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
  };

  const handleBackToList = () => {
    setSelectedArticle(null);
  };

  // Show article detail view if an article is selected
  if (selectedArticle) {
    return (
      <div className="flex flex-col h-full overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex items-center gap-3">
          <button
            onClick={handleBackToList}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{selectedArticle.title}</h3>
            {selectedArticle.category_name && (
              <p className="text-xs text-primary-600">{selectedArticle.category_name}</p>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div
            className="prose prose-sm max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Help articles</h3>
        <p className="text-gray-600 text-sm">Find answers in our documentation</p>
      </div>

      <div className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : articles.length > 0 ? (
          <div className="space-y-2">
            {articles.map((article) => (
              <button
                key={article.id}
                onClick={() => handleArticleClick(article)}
                className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <h4 className="font-medium text-gray-900 text-sm mb-2">{article.title}</h4>
                {article.excerpt && (
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">{stripHtml(article.excerpt)}</p>
                )}
                <div className="flex items-center justify-between">
                  {article.category_name && (
                    <span className="text-xs text-primary-600">{article.category_name}</span>
                  )}
                  <span className="text-xs text-gray-500">{estimateReadTime(article.content)}</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No articles available yet</p>
          </div>
        )}
      </div>
    </div>
  );
};
