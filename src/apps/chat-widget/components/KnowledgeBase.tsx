import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, MessageCircle, BookOpen, ThumbsUp, X } from 'lucide-react';
import { knowledgeBaseService } from '@/services/knowledgeBase.service';
import type { FAQ, Article, Category } from '@/types/knowledge.types';

interface KnowledgeBaseViewProps {
  companyId: string;
  onStartChat: () => void;
  onClose: () => void;
}

export const KnowledgeBaseView: React.FC<KnowledgeBaseViewProps> = ({
  companyId,
  onStartChat,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'faqs' | 'articles'>('faqs');
  const [searchQuery, setSearchQuery] = useState('');
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [expandedFAQs, setExpandedFAQs] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to strip HTML tags from content
  const stripHtml = (html: string): string => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  // Load initial data
  useEffect(() => {
    loadData();
  }, [companyId, selectedCategory]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [faqsData, articlesData, categoriesData] = await Promise.all([
        knowledgeBaseService.getFAQs(companyId, selectedCategory || undefined),
        knowledgeBaseService.getArticles(companyId, selectedCategory || undefined),
        knowledgeBaseService.getCategories(companyId),
      ]);

      setFaqs(faqsData);
      setArticles(articlesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to load knowledge base:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      loadData();
      return;
    }

    try {
      const results = await knowledgeBaseService.search(companyId, query);
      setFaqs(results.faqs);
      setArticles(results.articles);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  // Toggle FAQ expansion
  const toggleFAQ = (faqId: string) => {
    const newExpanded = new Set(expandedFAQs);
    if (newExpanded.has(faqId)) {
      newExpanded.delete(faqId);
    } else {
      newExpanded.add(faqId);
    }
    setExpandedFAQs(newExpanded);
  };

  // Mark FAQ as helpful
  const markHelpful = async (faqId: string) => {
    await knowledgeBaseService.markFAQHelpful(faqId);
    // Update local state
    setFaqs(faqs.map(faq => 
      faq.id === faqId 
        ? { ...faq, helpful_count: (faq.helpful_count || 0) + 1 }
        : faq
    ));
  };

  // View full article
  const viewArticle = async (articleId: string) => {
    const article = await knowledgeBaseService.getArticle(articleId);
    if (article) {
      setSelectedArticle(article);
    }
  };

  // Filtered items based on search
  const filteredFAQs = searchQuery 
    ? faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;

  const filteredArticles = searchQuery
    ? articles.filter(article => {
        const plainTextContent = stripHtml(article.content);
        return article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
               plainTextContent.toLowerCase().includes(searchQuery.toLowerCase());
      })
    : articles;

  return (
    <div className="w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-cyan-500 to-sky-400 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg">Help Center</h3>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs opacity-90">
          Find answers or chat with our team
        </p>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
          />
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="px-4 py-2 border-b border-gray-200">
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === null
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-cyan-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('faqs')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'faqs'
              ? 'text-cyan-600 border-b-2 border-cyan-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <MessageCircle className="w-4 h-4" />
            FAQs ({filteredFAQs.length})
          </div>
        </button>
        <button
          onClick={() => setActiveTab('articles')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'articles'
              ? 'text-cyan-600 border-b-2 border-cyan-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <BookOpen className="w-4 h-4" />
            Articles ({filteredArticles.length})
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : selectedArticle ? (
          /* Full Article View */
          <div className="p-4">
            <button
              onClick={() => setSelectedArticle(null)}
              className="flex items-center gap-1 text-cyan-600 hover:text-cyan-700 text-sm mb-4"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Back to articles
            </button>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {selectedArticle.title}
            </h3>
            {selectedArticle.category_name && (
              <span className="inline-block px-2 py-1 bg-cyan-100 text-cyan-700 text-xs rounded-full mb-4">
                {selectedArticle.category_name}
              </span>
            )}
            <div
              className="prose prose-sm max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
            />
          </div>
        ) : activeTab === 'faqs' ? (
          /* FAQs List */
          <div className="divide-y divide-gray-200">
            {filteredFAQs.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No FAQs found</p>
              </div>
            ) : (
              filteredFAQs.map((faq) => (
                <div key={faq.id} className="p-4">
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full text-left flex items-start justify-between gap-2 group"
                  >
                    <span className="font-medium text-gray-900 text-sm group-hover:text-cyan-600 transition-colors">
                      {faq.question}
                    </span>
                    <ChevronRight
                      className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                        expandedFAQs.has(faq.id) ? 'rotate-90' : ''
                      }`}
                    />
                  </button>
                  {expandedFAQs.has(faq.id) && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {faq.answer}
                      </p>
                      <div className="mt-3 flex items-center gap-4">
                        <button
                          onClick={() => markHelpful(faq.id)}
                          className="flex items-center gap-1 text-xs text-gray-500 hover:text-cyan-600 transition-colors"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          Helpful {faq.helpful_count ? `(${faq.helpful_count})` : ''}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          /* Articles List */
          <div className="divide-y divide-gray-200">
            {filteredArticles.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No articles found</p>
              </div>
            ) : (
              filteredArticles.map((article) => (
                <button
                  key={article.id}
                  onClick={() => viewArticle(article.id)}
                  className="w-full p-4 text-left hover:bg-gray-50 transition-colors group"
                >
                  <h4 className="font-medium text-gray-900 text-sm mb-1 group-hover:text-cyan-600 transition-colors">
                    {article.title}
                  </h4>
                  <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                    {article.excerpt || stripHtml(article.content).substring(0, 150) + '...'}
                  </p>
                  {article.category_name && (
                    <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                      {article.category_name}
                    </span>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400">
                      {new Date(article.updated_at).toLocaleDateString()}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-600 text-center mb-3">
          Can't find what you're looking for?
        </p>
        <button
          onClick={onStartChat}
          className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-sky-400 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-sky-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-5 h-5" />
          Chat with Support
        </button>
      </div>
    </div>
  );
};