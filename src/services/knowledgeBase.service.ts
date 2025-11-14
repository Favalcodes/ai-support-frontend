import axios, { AxiosInstance } from 'axios';
import type { FAQ, Article, Category } from '../types/knowledge.types';

class KnowledgeBaseService {
  private api: AxiosInstance;

  constructor() {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    this.api = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
  }

  /**
   * Get all FAQs for a company
   */
  async getFAQs(companyId: string, categoryId?: string): Promise<FAQ[]> {
    try {
      const params = categoryId ? { category_id: categoryId } : {};
      const response = await this.api.get(`/api/companies/${companyId}/faqs`, { params });
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to load FAQs:', error);
      return [];
    }
  }

  /**
   * Get all knowledge articles for a company
   */
  async getArticles(companyId: string, categoryId?: string): Promise<Article[]> {
    try {
      const params = categoryId ? { category_id: categoryId } : {};
      const response = await this.api.get(`/api/companies/${companyId}/articles`, { params });
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to load articles:', error);
      return [];
    }
  }

  /**
   * Get a single article by ID
   */
  async getArticle(articleId: string): Promise<Article | null> {
    try {
      const response = await this.api.get(`/api/articles/${articleId}`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to load article:', error);
      return null;
    }
  }

  /**
   * Search FAQs and Articles
   */
  async search(companyId: string, query: string): Promise<{ faqs: FAQ[]; articles: Article[] }> {
    try {
      const response = await this.api.get(`/api/companies/${companyId}/search`, {
        params: { q: query },
      });
      return {
        faqs: response.data.data.faqs || [],
        articles: response.data.data.articles || [],
      };
    } catch (error) {
      console.error('Failed to search:', error);
      return { faqs: [], articles: [] };
    }
  }

  /**
   * Get categories for a company
   */
  async getCategories(companyId: string): Promise<Category[]> {
    try {
      const response = await this.api.get(`/api/companies/${companyId}/categories`);
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to load categories:', error);
      return [];
    }
  }

  /**
   * Mark FAQ as helpful
   */
  async markFAQHelpful(faqId: string): Promise<void> {
    try {
      await this.api.post(`/api/faqs/${faqId}/helpful`);
    } catch (error) {
      console.error('Failed to mark FAQ as helpful:', error);
    }
  }
}

export const knowledgeBaseService = new KnowledgeBaseService();