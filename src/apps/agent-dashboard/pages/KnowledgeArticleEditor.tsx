import toast from 'react-hot-toast';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Eye } from 'lucide-react';
import { Button, Input, Card, Badge, RichTextEditor } from '../../../components/ui';
import { knowledgeService, KnowledgeCategory } from '../../../services/knowledge.service';

export const KnowledgeArticleEditor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [categories, setCategories] = useState<KnowledgeCategory[]>([]);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category_id: '',
  });

  // Load categories
  useEffect(() => {
    loadCategories();
  }, []);

  // Load article if editing
  useEffect(() => {
    if (isEditMode && id) {
      loadArticle(id);
    }
  }, [id, isEditMode]);

  const loadCategories = async () => {
    try {
      const data = await knowledgeService.getCategories();
      setCategories(data);
      if (!isEditMode && data.length > 0) {
        setFormData(prev => ({ ...prev, category_id: data[0].id }));
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
      toast.error('Failed to load categories. Please try again.');
    }
  };

  const loadArticle = async (articleId: string) => {
    setIsLoading(true);
    try {
      const article = await knowledgeService.getArticleById(articleId);
      setFormData({
        title: article.title,
        content: article.content,
        category_id: article?.category?.id,
      });
    } catch (error) {
      console.error('Failed to load article:', error);
      toast.error('Failed to load article. Please try again.');
      navigate('/dashboard/knowledge');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim() || !formData.category_id) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      if (isEditMode && id) {
        await knowledgeService.updateArticle(id, formData);
        toast.success('Article updated successfully!');
      } else {
        await knowledgeService.createArticle(formData);
        toast.success('Article created successfully!');
      }
      navigate('/dashboard/knowledge');
    } catch (error) {
      console.error('Failed to save article:', error);
      toast.error('Failed to save article. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || 'Unknown';
  };

  if (isLoading) {
    return (
      <div className="h-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard/knowledge')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditMode ? 'Edit Article' : 'Create New Article'}
              </h1>
              <p className="text-gray-600 mt-1">
                {isEditMode ? 'Update article details' : 'Write a new knowledge base article'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={() => setShowPreview(!showPreview)}>
              <Eye className="w-4 h-4 mr-2" />
              {showPreview ? 'Edit' : 'Preview'}
            </Button>
            <Button onClick={handleSave} loading={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isEditMode ? 'Update' : 'Publish'}
            </Button>
          </div>
        </div>

        {showPreview ? (
          /* Preview Mode */
          <Card className="p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{formData.title || 'Untitled Article'}</h1>
              <Badge variant="info">{getCategoryName(formData.category_id)}</Badge>
            </div>
            <div className="prose prose-cyan max-w-none">
              {formData.content ? (
                <div
                  dangerouslySetInnerHTML={{ __html: formData.content }}
                  className="text-gray-900"
                />
              ) : (
                <p className="text-gray-400 italic">No content yet...</p>
              )}
            </div>
          </Card>
        ) : (
          /* Edit Mode */
          <div className="space-y-6">
            {/* Title and Category */}
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Article Title *
                  </label>
                  <Input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter a descriptive title for your article"
                    className="text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>

            {/* Content Editor */}
            <Card className="p-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Article Content *
                  </label>
                  <span className="text-xs text-gray-500">
                    Use the toolbar to format your content
                  </span>
                </div>
                <RichTextEditor
                  value={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  placeholder="Start writing your article content here..."
                />
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
