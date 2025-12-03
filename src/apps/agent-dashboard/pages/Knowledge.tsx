import React, { useState, useEffect } from 'react';
import { Search, Plus, FileText, Edit, Trash2, Eye, HelpCircle, Folder, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Card, Badge, Textarea } from '../../../components/ui';
import { knowledgeService, KnowledgeArticle, KnowledgeCategory, FAQ } from '../../../services/knowledge.service';

export const KnowledgePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'articles' | 'faqs' | 'categories'>('articles');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Helper function to strip HTML tags from content
  const stripHtml = (html: string): string => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  // Articles state
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [categories, setCategories] = useState<KnowledgeCategory[]>([]);

  // FAQs state
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [faqForm, setFaqForm] = useState({ question: '', answer: '' });

  // Category state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<KnowledgeCategory | null>(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [categoriesData, articlesData, faqsData] = await Promise.all([
        knowledgeService.getCategories(),
        knowledgeService.getArticles(),
        knowledgeService.getFaqs(),
      ]);
      setCategories(categoriesData);
      setArticles(articlesData);
      setFaqs(faqsData);
    } catch (error) {
      console.error('Failed to load data:', error);
      alert('Failed to load knowledge base data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter articles
  const filteredArticles = articles.filter((article) => {
    const plainTextContent = stripHtml(article.content);
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plainTextContent.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Filter FAQs
  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Article operations
  const handleCreateArticle = () => {
    navigate('/dashboard/knowledge/article/new');
  };

  const handleEditArticle = (articleId: string) => {
    navigate(`/dashboard/knowledge/article/${articleId}`);
  };

  const handleDeleteArticle = async (articleId: string) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    try {
      await knowledgeService.deleteArticle(articleId);
      setArticles(articles.filter(a => a.id !== articleId));
    } catch (error) {
      console.error('Failed to delete article:', error);
      alert('Failed to delete article. Please try again.');
    }
  };

  const handleViewArticle = (articleId: string) => {
    navigate(`/dashboard/knowledge/article/${articleId}`);
  };

  // FAQ operations
  const handleCreateFaq = () => {
    setEditingFaq(null);
    setFaqForm({ question: '', answer: '' });
    setShowFaqModal(true);
  };

  const handleEditFaq = (faq: FAQ) => {
    setEditingFaq(faq);
    setFaqForm({ question: faq.question, answer: faq.answer });
    setShowFaqModal(true);
  };

  const handleSaveFaq = async () => {
    if (!faqForm.question.trim() || !faqForm.answer.trim()) {
      alert('Please fill in both question and answer');
      return;
    }

    setIsSaving(true);
    try {
      if (editingFaq) {
        const updated = await knowledgeService.updateFaq(editingFaq.id, faqForm);
        setFaqs(faqs.map(f => f.id === updated.id ? updated : f));
      } else {
        const created = await knowledgeService.createFaq(faqForm);
        setFaqs([created, ...faqs]);
      }
      setShowFaqModal(false);
      setFaqForm({ question: '', answer: '' });
    } catch (error) {
      console.error('Failed to save FAQ:', error);
      alert('Failed to save FAQ. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteFaq = async (faqId: string) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      await knowledgeService.deleteFaq(faqId);
      setFaqs(faqs.filter(f => f.id !== faqId));
    } catch (error) {
      console.error('Failed to delete FAQ:', error);
      alert('Failed to delete FAQ. Please try again.');
    }
  };

  // Category operations
  const handleCreateCategory = () => {
    setEditingCategory(null);
    setCategoryForm({ name: '', description: '' });
    setShowCategoryModal(true);
  };

  const handleEditCategory = (category: KnowledgeCategory) => {
    setEditingCategory(category);
    setCategoryForm({ name: category.name, description: category.description || '' });
    setShowCategoryModal(true);
  };

  const handleSaveCategory = async () => {
    if (!categoryForm.name.trim()) {
      alert('Please enter a category name');
      return;
    }

    setIsSaving(true);
    try {
      if (editingCategory) {
        const updated = await knowledgeService.updateCategory(editingCategory.id, categoryForm);
        setCategories(categories.map(c => c.id === updated.id ? updated : c));
      } else {
        const created = await knowledgeService.createCategory(categoryForm);
        setCategories([...categories, created]);
      }
      setShowCategoryModal(false);
      setCategoryForm({ name: '', description: '' });
    } catch (error) {
      console.error('Failed to save category:', error);
      alert('Failed to save category. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    const articlesInCategory = articles.filter(a => a.category_id === categoryId);
    if (articlesInCategory.length > 0) {
      alert(`Cannot delete category. It contains ${articlesInCategory.length} article(s). Please move or delete the articles first.`);
      return;
    }

    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await knowledgeService.deleteCategory(categoryId);
      setCategories(categories.filter(c => c.id !== categoryId));
      if (selectedCategory === categoryId) {
        setSelectedCategory('all');
      }
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert('Failed to delete category. Please try again.');
    }
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || 'Unknown';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
          <p className="text-gray-600 mt-1">Manage articles, FAQs, and categories</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('articles')}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'articles'
                ? 'border-cyan-500 text-cyan-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            Articles ({articles.length})
          </button>
          <button
            onClick={() => setActiveTab('faqs')}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'faqs'
                ? 'border-cyan-500 text-cyan-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            FAQs ({faqs.length})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'categories'
                ? 'border-cyan-500 text-cyan-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Folder className="w-4 h-4" />
            Categories ({categories.length})
          </button>
        </div>

        {/* Search and Actions */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          {activeTab === 'articles' && (
            <>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <Button onClick={handleCreateArticle}>
                <Plus className="w-4 h-4 mr-2" />
                New Article
              </Button>
            </>
          )}
          {activeTab === 'faqs' && (
            <Button onClick={handleCreateFaq}>
              <Plus className="w-4 h-4 mr-2" />
              New FAQ
            </Button>
          )}
          {activeTab === 'categories' && (
            <Button onClick={handleCreateCategory}>
              <Plus className="w-4 h-4 mr-2" />
              New Category
            </Button>
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
            <p className="text-gray-600 mt-4">Loading...</p>
          </div>
        ) : (
          <>
            {/* Articles Tab */}
            {activeTab === 'articles' && (
              <div className="space-y-4">
                {filteredArticles.length === 0 ? (
                  <Card className="p-12 text-center">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles found</h3>
                    <p className="text-gray-600 mb-6">
                      {searchQuery ? 'Try adjusting your search terms' : 'Create your first article to get started'}
                    </p>
                    {!searchQuery && (
                      <Button onClick={handleCreateArticle}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Article
                      </Button>
                    )}
                  </Card>
                ) : (
                  filteredArticles.map((article) => (
                    <Card key={article.id} className="p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{article.title}</h3>
                            <Badge variant="info">
                              {article.category ? article.category.name : getCategoryName(article.category_id)}
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {stripHtml(article.content).substring(0, 200)}...
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {article.views || 0} views
                            </span>
                            <span>•</span>
                            <span>Updated {formatDate(article.updated_at)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button variant="ghost" size="sm" onClick={() => handleViewArticle(article.id)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEditArticle(article.id)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteArticle(article.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            )}

            {/* FAQs Tab */}
            {activeTab === 'faqs' && (
              <div className="space-y-4">
                {filteredFaqs.length === 0 ? (
                  <Card className="p-12 text-center">
                    <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No FAQs found</h3>
                    <p className="text-gray-600 mb-6">
                      {searchQuery ? 'Try adjusting your search terms' : 'Create your first FAQ to get started'}
                    </p>
                    {!searchQuery && (
                      <Button onClick={handleCreateFaq}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create FAQ
                      </Button>
                    )}
                  </Card>
                ) : (
                  filteredFaqs.map((faq) => (
                    <Card key={faq.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                          <p className="text-gray-600 text-sm">{faq.answer}</p>
                          <p className="text-xs text-gray-500 mt-3">
                            Updated {formatDate(faq.updated_at)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button variant="ghost" size="sm" onClick={() => handleEditFaq(faq)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteFaq(faq.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            )}

            {/* Categories Tab */}
            {activeTab === 'categories' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.length === 0 ? (
                  <Card className="p-12 text-center col-span-full">
                    <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No categories found</h3>
                    <p className="text-gray-600 mb-6">Create your first category to organize articles</p>
                    <Button onClick={handleCreateCategory}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Category
                    </Button>
                  </Card>
                ) : (
                  categories.map((category) => {
                    const articleCount = articles.filter(a => a.category_id === category.id).length;
                    return (
                      <Card key={category.id} className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <Folder className="w-8 h-8 text-cyan-600" />
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => handleEditCategory(category)}>
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCategory(category.id)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                        {category.description && (
                          <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                        )}
                        <p className="text-sm text-gray-500">{articleCount} articles</p>
                      </Card>
                    );
                  })
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* FAQ Modal */}
      {showFaqModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingFaq ? 'Edit FAQ' : 'Create FAQ'}
              </h2>
              <button onClick={() => setShowFaqModal(false)}>
                <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question *
                </label>
                <Input
                  type="text"
                  value={faqForm.question}
                  onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                  placeholder="Enter the frequently asked question"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Answer *
                </label>
                <Textarea
                  value={faqForm.answer}
                  onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                  placeholder="Enter the answer to this question"
                  rows={6}
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => setShowFaqModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveFaq} loading={isSaving}>
                {editingFaq ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h2>
              <button onClick={() => setShowCategoryModal(false)}>
                <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <Input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="Enter category name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <Textarea
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  placeholder="Enter category description (optional)"
                  rows={3}
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => setShowCategoryModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveCategory} loading={isSaving}>
                {editingCategory ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
