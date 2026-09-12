import { describe, it, expect, vi, beforeEach } from 'vitest';

// Intercept at the axios instance level so the real service code runs.
vi.mock('../api', () => {
  const publicApi = { get: vi.fn(), post: vi.fn(), defaults: { baseURL: '/api/v1' } };
  const api = { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() };
  return { __esModule: true, default: api, publicApi };
});

import api, { publicApi } from '../api';
import { apiService } from '../api.service';
import { messageService } from '../message.service';
import { knowledgeBaseService } from '../knowledgeBase.service';

const ok = (data: unknown) => ({ data: { data } });

describe('API contracts', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('message payloads', () => {
    it('sends user_id, the field SendMessageDto declares', async () => {
      (api.post as any).mockResolvedValue(ok({ id: 'm1' }));

      await messageService.sendMessage('c1', 'hello', 'u1');

      const [, body] = (api.post as any).mock.calls[0];
      // Validation runs with forbidNonWhitelisted, so `userId` was a 422.
      expect(body).toEqual({ message: 'hello', user_id: 'u1' });
      expect(body).not.toHaveProperty('userId');
    });

    it('sends user_id from the widget client too', async () => {
      (publicApi.post as any).mockResolvedValue(ok({ id: 'm1' }));

      await apiService.sendMessage('c1', 'hello', 'u1');

      const [, body] = (publicApi.post as any).mock.calls[0];
      expect(body).toEqual({ message: 'hello', user_id: 'u1' });
    });
  });

  describe('widget knowledge access', () => {
    it('reads FAQs through the public company-scoped route', async () => {
      (publicApi.get as any).mockResolvedValue(ok([]));

      await knowledgeBaseService.getFAQs('co1');

      expect(publicApi.get).toHaveBeenCalledWith('/knowledge/public/co1/faqs');
    });

    it('reads a single article through the company-scoped route, not the unscoped one', async () => {
      (publicApi.get as any).mockResolvedValue(ok({ id: 'a1' }));

      await knowledgeBaseService.getArticle('co1', 'a1');

      // /knowledge/:id had no company filter and no auth: any caller could read
      // any tenant's article by id.
      expect(publicApi.get).toHaveBeenCalledWith('/knowledge/public/co1/articles/a1');
    });

    it('never calls an authenticated knowledge route from the widget', async () => {
      (publicApi.get as any).mockResolvedValue(ok([]));

      await knowledgeBaseService.getCategories('co1');
      await knowledgeBaseService.search('co1', 'billing');

      for (const [url] of (publicApi.get as any).mock.calls) {
        expect(url).toContain('/public/');
      }
      expect(api.get).not.toHaveBeenCalled();
    });

    it('derives categories from the public article list', async () => {
      (publicApi.get as any).mockResolvedValue(
        ok([
          { id: 'a1', title: 'A', content: 'x', category_id: 'c1', category_name: 'Billing' },
          { id: 'a2', title: 'B', content: 'y', category_id: 'c1', category_name: 'Billing' },
          { id: 'a3', title: 'C', content: 'z', category_id: 'c2', category_name: 'Account' },
        ])
      );

      const categories = await knowledgeBaseService.getCategories('co1');

      expect(categories).toEqual([
        { id: 'c2', name: 'Account' },
        { id: 'c1', name: 'Billing' },
      ]);
    });

    it('filters search client-side across FAQs and articles', async () => {
      (publicApi.get as any).mockImplementation((url: string) =>
        Promise.resolve(
          url.includes('/faqs')
            ? ok([{ id: 'f1', question: 'How do I pay?', answer: 'By card' }])
            : ok([{ id: 'a1', title: 'Refunds', content: 'About refunds', created_at: '', updated_at: '' }])
        )
      );

      const { faqs, articles } = await knowledgeBaseService.search('co1', 'refund');

      expect(faqs).toHaveLength(0);
      expect(articles).toHaveLength(1);
    });
  });
});
