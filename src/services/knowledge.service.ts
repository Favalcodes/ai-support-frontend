import api from './api';

export interface KnowledgeCategory {
  id: string;
  name: string;
  description?: string;
  company_id: string;
  articles: KnowledgeArticle[];
  created_at: string;
  updated_at: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  category_id: string;
  category?: KnowledgeCategory;
  company_id: string;
  views: number;
  created_at: string;
  updated_at: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
}

export interface CreateArticleDto {
  title: string;
  content: string;
  category_id: string;
}

export interface UpdateArticleDto {
  title?: string;
  content?: string;
  category_id?: string;
}

export interface CreateFaqDto {
  question: string;
  answer: string;
}

export interface UpdateFaqDto {
  question?: string;
  answer?: string;
}

class KnowledgeService {
  // Categories
  async getCategories(): Promise<KnowledgeCategory[]> {
    const response = await api.get('/knowledge/categories');
    return response.data.data;
  }

  async getCategoryById(id: string): Promise<KnowledgeCategory> {
    const response = await api.get(`/knowledge/categories/${id}`);
    return response.data.data;
  }

  async createCategory(data: CreateCategoryDto): Promise<KnowledgeCategory> {
    const response = await api.post('/knowledge/categories', data);
    return response.data.data;
  }

  async updateCategory(id: string, data: UpdateCategoryDto): Promise<KnowledgeCategory> {
    const response = await api.patch(`/knowledge/categories/${id}`, data);
    return response.data.data;
  }

  async deleteCategory(id: string): Promise<void> {
    await api.delete(`/knowledge/categories/${id}`);
  }

  // Articles
  async getArticles(params?: { categoryId?: string; search?: string }): Promise<KnowledgeArticle[]> {
    const response = await api.get('/knowledge', { params });
    return response.data.data;
  }

  async getArticleById(id: string): Promise<KnowledgeArticle> {
    const response = await api.get(`/knowledge/${id}`);
    return response.data.data;
  }

  async createArticle(data: CreateArticleDto): Promise<KnowledgeArticle> {
    const response = await api.post('/knowledge', data);
    return response.data.data;
  }

  async updateArticle(id: string, data: UpdateArticleDto): Promise<KnowledgeArticle> {
    const response = await api.patch(`/knowledge/${id}`, data);
    return response.data.data;
  }

  async deleteArticle(id: string): Promise<void> {
    await api.delete(`/knowledge/${id}`);
  }

  // FAQs
  async getFaqs(search?: string): Promise<FAQ[]> {
    const response = await api.get('/knowledge/faqs', { params: { search } });
    return response.data.data;
  }

  async getFaqById(id: string): Promise<FAQ> {
    const response = await api.get(`/knowledge/faqs/${id}`);
    return response.data.data;
  }

  async createFaq(data: CreateFaqDto): Promise<FAQ> {
    const response = await api.post('/knowledge/faqs', data);
    return response.data.data;
  }

  async updateFaq(id: string, data: UpdateFaqDto): Promise<FAQ> {
    const response = await api.patch(`/knowledge/faqs/${id}`, data);
    return response.data.data;
  }

  async deleteFaq(id: string): Promise<void> {
    await api.delete(`/knowledge/faqs/${id}`);
  }
}

export const knowledgeService = new KnowledgeService();
