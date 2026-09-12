import axios, { AxiosInstance } from 'axios';
import type { FAQ, Article, Category } from '../types/knowledge.types';

/**
 * Knowledge access for the embedded widget.
 *
 * Every call here runs for an anonymous visitor, so it may only use the public,
 * company-scoped endpoints. It previously called the authenticated routes
 * (/knowledge, /knowledge/faqs, /knowledge/categories), which returned 401 for
 * widget users, and read single articles through /knowledge/:id, which had no
 * company filter at all.
 */
class KnowledgeBaseService {
  private api: AxiosInstance;

  constructor() {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4001/api/v1';
    this.api = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
  }

  /**
   * Get all FAQs for a company (public endpoint for chat widget)
   */
  async getFAQs(companyId: string, categoryId?: string): Promise<FAQ[]> {
    try {
      const response = await this.api.get(`/knowledge/public/${companyId}/faqs`);
      const faqs: FAQ[] = response.data.data || [];
      return categoryId ? faqs.filter((f) => f.category_id === categoryId) : faqs;
    } catch (error) {
      console.error('Failed to load FAQs:', error);
      return [];
    }
  }

  /**
   * Get all knowledge articles for a company (public endpoint for chat widget)
   */
  async getArticles(companyId: string, categoryId?: string): Promise<Article[]> {
    try {
      const response = await this.api.get(`/knowledge/public/${companyId}/articles`);
      const articles: Article[] = response.data.data || [];
      return categoryId ? articles.filter((a) => a.category_id === categoryId) : articles;
    } catch (error) {
      console.error('Failed to load articles:', error);
      return [];
    }
  }

  /**
   * Get a single article. The company is part of the path so the server can scope
   * the lookup; an article id alone is not enough to read another tenant's content.
   */
  async getArticle(companyId: string, articleId: string): Promise<Article | null> {
    try {
      const response = await this.api.get(
        `/knowledge/public/${companyId}/articles/${articleId}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Failed to load article:', error);
      return null;
    }
  }

  /**
   * Search the company's public FAQs and articles.
   *
   * Filtering happens client-side over the public lists because the server-side
   * search routes require a staff token that widget visitors never have.
   */
  async search(companyId: string, query: string): Promise<{ faqs: FAQ[]; articles: Article[] }> {
    try {
      const term = query.trim().toLowerCase();
      const [faqs, articles] = await Promise.all([
        this.getFAQs(companyId),
        this.getArticles(companyId),
      ]);

      if (!term) return { faqs, articles };

      return {
        faqs: faqs.filter(
          (f) =>
            f.question.toLowerCase().includes(term) ||
            f.answer.toLowerCase().includes(term)
        ),
        articles: articles.filter(
          (a) =>
            a.title.toLowerCase().includes(term) ||
            a.content.toLowerCase().includes(term)
        ),
      };
    } catch (error) {
      console.error('Failed to search:', error);
      return { faqs: [], articles: [] };
    }
  }

  /**
   * Categories are derived from the public article list rather than fetched from
   * the authenticated /knowledge/categories route.
   */
  async getCategories(companyId: string): Promise<Category[]> {
    try {
      const articles = await this.getArticles(companyId);
      const byId = new Map<string, Category>();

      for (const article of articles) {
        if (article.category_id && !byId.has(article.category_id)) {
          byId.set(article.category_id, {
            id: article.category_id,
            name: article.category_name ?? 'Uncategorised',
          });
        }
      }

      return [...byId.values()].sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Failed to load categories:', error);
      return [];
    }
  }

  /**
   * Mark a FAQ as helpful.
   */
  async markFAQHelpful(companyId: string, faqId: string): Promise<void> {
    try {
      await this.api.post(`/knowledge/public/${companyId}/faqs/${faqId}/helpful`);
    } catch (error) {
      console.error('Failed to mark FAQ as helpful:', error);
    }
  }
}

export const knowledgeBaseService = new KnowledgeBaseService();
