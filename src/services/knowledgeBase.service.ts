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
   * Get all FAQs for a company (uses auth token for company filtering)
   */
  async getFAQs(companyId: string, categoryId?: string): Promise<FAQ[]> {
    try {
      const params = categoryId ? { categoryId } : {};
      const response = await this.api.get('/api/v1/knowledge/faqs', { params });
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to load FAQs:', error);
      return [];
    }
  }

  /**
   * Get all knowledge articles for a company (uses auth token for company filtering)
   */
  async getArticles(companyId: string, categoryId?: string): Promise<Article[]> {
    try {
      const params = categoryId ? { categoryId } : {};
      const response = await this.api.get('/api/v1/knowledge', { params });
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
      const response = await this.api.get(`/api/v1/knowledge/${articleId}`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to load article:', error);
      return null;
    }
  }

  /**
   * Search FAQs and Articles (uses auth token for company filtering)
   */
  async search(companyId: string, query: string): Promise<{ faqs: FAQ[]; articles: Article[] }> {
    try {
      // Search FAQs
      const faqsResponse = await this.api.get('/api/v1/knowledge/faqs', {
        params: { search: query },
      });

      // Search Articles
      const articlesResponse = await this.api.get('/api/v1/knowledge', {
        params: { search: query },
      });

      return {
        faqs: faqsResponse.data.data || [],
        articles: articlesResponse.data.data || [],
      };
    } catch (error) {
      console.error('Failed to search:', error);
      return { faqs: [], articles: [] };
    }
  }

  /**
   * Get categories for a company (uses auth token for company filtering)
   */
  async getCategories(companyId: string): Promise<Category[]> {
    try {
      const response = await this.api.get('/api/v1/knowledge/categories');
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to load categories:', error);
      return [];
    }
  }

  /**
   * Mark FAQ as helpful (Note: Backend endpoint doesn't exist yet)
   */
  async markFAQHelpful(faqId: string): Promise<void> {
    try {
      // TODO: Backend endpoint needs to be created
      console.warn('markFAQHelpful: Backend endpoint not implemented yet');
      // await this.api.post(`/api/v1/knowledge/faqs/${faqId}/helpful`);
    } catch (error) {
      console.error('Failed to mark FAQ as helpful:', error);
    }
  }
}

export const knowledgeBaseService = new KnowledgeBaseService();