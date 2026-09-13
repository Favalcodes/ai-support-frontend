/**
 * Remembers who the visitor is between page loads.
 *
 * The server already resumes a conversation when it recognises the visitor's
 * email (see ConversationService.startConversation: an active conversation
 * younger than 24h is returned rather than a new one). The widget had no
 * matching memory of its own, so a reload dropped the in-memory store, showed
 * the pre-chat form again, and the visitor landed in a brand new conversation
 * unless they happened to retype the same address.
 *
 * Scoped per company so two widgets on the same origin cannot read each other's
 * visitor. Every access is guarded: storage throws in private windows and when
 * the embedding site blocks third-party storage, and a widget must not take the
 * host page down with it.
 */

export interface VisitorSession {
  userId: string;
  conversationId: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

const KEY_PREFIX = 'rlayai:visitor:';

const keyFor = (companyId: string) => `${KEY_PREFIX}${companyId}`;

export const loadVisitorSession = (companyId: string): VisitorSession | null => {
  try {
    const raw = window.localStorage.getItem(keyFor(companyId));
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<VisitorSession>;
    // A record missing either id cannot resume anything, so treat it as absent.
    if (!parsed?.userId || !parsed?.conversationId || !parsed?.email) return null;

    return parsed as VisitorSession;
  } catch {
    return null;
  }
};

export const saveVisitorSession = (companyId: string, session: VisitorSession): void => {
  try {
    window.localStorage.setItem(keyFor(companyId), JSON.stringify(session));
  } catch {
    // Storage unavailable or full. The widget still works for this page view.
  }
};

export const clearVisitorSession = (companyId: string): void => {
  try {
    window.localStorage.removeItem(keyFor(companyId));
  } catch {
    // Nothing to do: if we cannot clear it we also cannot have written it.
  }
};
