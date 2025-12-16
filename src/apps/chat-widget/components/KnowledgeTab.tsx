import React, { useState, useEffect } from 'react';
import { BookOpen, Loader2, ExternalLink, Clock, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category?: string;
  updated_at: string;
  views?: number;
}

interface KnowledgeTabProps {
  companyId: string;
  departmentId?: string;
  onStartChat?: () => void;
}

export const KnowledgeTab: React.FC<KnowledgeTabProps> = ({
  companyId,
  departmentId,
  onStartChat,
}) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, [companyId, departmentId]);

  const loadArticles = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      // const data = await knowledgeService.getArticles({ companyId, departmentId, limit: 10 });

      // Demo data
      const demoArticles: Article[] = [
        {
          id: '1',
          title: 'Getting Started with Your Account',
          excerpt: 'Learn how to set up your account, customize your profile, and get the most out of our platform.',
          category: 'Getting Started',
          updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          views: 1234,
        },
        {
          id: '2',
          title: 'Security Best Practices',
          excerpt: 'Important security tips to keep your account safe, including two-factor authentication and password management.',
          category: 'Security',
          updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          views: 856,
        },
        {
          id: '3',
          title: 'Managing Your Subscription',
          excerpt: 'Everything you need to know about upgrading, downgrading, and managing your subscription plan.',
          category: 'Billing',
          updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          views: 645,
        },
        {
          id: '4',
          title: 'Integrations Guide',
          excerpt: 'Connect your favorite tools and services with our platform. Step-by-step integration guides.',
          category: 'Integrations',
          updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          views: 423,
        },
        {
          id: '5',
          title: 'Troubleshooting Common Issues',
          excerpt: 'Quick solutions to the most common problems our users encounter.',
          category: 'Support',
          updated_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          views: 987,
        },
      ];

      setArticles(demoArticles);
    } catch (error) {
      console.error('Failed to load articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTimeAgo = (date: string): string => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return '';
    }
  };

  const handleArticleClick = (articleId: string) => {
    // In a real implementation, this would open the article in a modal or new page
    console.log('Opening article:', articleId);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="p-4 bg-white border-b border-gray-200 flex-shrink-0">
        <h3 className="text-lg font-semibold text-gray-900">Knowledge Base</h3>
        <p className="text-sm text-gray-600 mt-1">
          Browse our help articles and guides
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 min-h-0">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin mb-3" />
            <p className="text-sm text-gray-600">Loading articles...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <BookOpen className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-gray-600 font-medium">No articles available</p>
            <p className="text-gray-500 text-sm mt-2">
              Need help? Chat with our support team
            </p>
            {onStartChat && (
              <button
                onClick={onStartChat}
                className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Chat with Support
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {articles.map((article) => (
              <button
                key={article.id}
                onClick={() => handleArticleClick(article.id)}
                className="w-full bg-white rounded-lg border border-gray-200 p-4 text-left hover:shadow-md hover:border-primary-300 transition-all group"
              >
                {/* Category Badge */}
                {article.category && (
                  <span className="inline-block px-2 py-0.5 text-xs font-medium text-primary-700 bg-primary-100 rounded mb-2">
                    {article.category}
                  </span>
                )}

                {/* Title */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {article.title}
                  </h4>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary-600 flex-shrink-0 transition-colors" />
                </div>

                {/* Excerpt */}
                <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                  {article.excerpt}
                </p>

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{getTimeAgo(article.updated_at)}</span>
                  </div>
                  {article.views !== undefined && (
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      <span>{article.views.toLocaleString()} views</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer - Need more help? */}
      {!isLoading && articles.length > 0 && onStartChat && (
        <div className="p-4 bg-white border-t border-gray-200 flex-shrink-0">
          <div className="bg-primary-50 rounded-lg p-3 text-center">
            <p className="text-sm text-gray-700 mb-2">Can't find what you're looking for?</p>
            <button
              onClick={onStartChat}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
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
