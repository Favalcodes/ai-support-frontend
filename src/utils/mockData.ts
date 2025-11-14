import { Conversation, ConversationStatus } from '../types/conversation.types';
import { Message, MessageRole } from '../types/message.types';
import { User, UserRole } from '../types/user.types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'sarah.mitchell@example.com',
    first_name: 'Sarah',
    last_name: 'Mitchell',
    role: UserRole.USER,
    company_id: 'company-1',
    is_active: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 'user-2',
    email: 'mike.johnson@example.com',
    first_name: 'Mike',
    last_name: 'Johnson',
    role: UserRole.USER,
    company_id: 'company-1',
    is_active: true,
    created_at: '2024-02-10T10:00:00Z',
    updated_at: '2024-02-10T10:00:00Z',
  },
  {
    id: 'user-3',
    email: 'emily.rodriguez@example.com',
    first_name: 'Emily',
    last_name: 'Rodriguez',
    role: UserRole.USER,
    company_id: 'company-1',
    is_active: true,
    created_at: '2024-03-05T10:00:00Z',
    updated_at: '2024-03-05T10:00:00Z',
  },
];

// Mock Agent
export const mockAgent: User = {
  id: 'agent-1',
  email: 'agent@company.com',
  first_name: 'John',
  last_name: 'Doe',
  role: UserRole.COMPANY_STAFF,
  company_id: 'company-1',
  is_active: true,
  created_at: '2024-01-01T10:00:00Z',
  updated_at: '2024-01-01T10:00:00Z',
};

// Mock Conversations
export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    user_id: 'user-1',
    company_id: 'company-1',
    category_id: 'cat-1',
    assigned_staff_id: 'agent-1',
    status: ConversationStatus.OPEN,
    active: true,
    needs_human_agent: false,
    created_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
    last_activity: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    user: mockUsers[0],
    category: {
      id: 'cat-1',
      name: 'Billing',
      description: 'Billing related queries',
    },
  },
  {
    id: 'conv-2',
    user_id: 'user-2',
    company_id: 'company-1',
    category_id: 'cat-2',
    assigned_staff_id: 'agent-1',
    status: ConversationStatus.OPEN,
    active: true,
    needs_human_agent: false,
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    last_activity: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    user: mockUsers[1],
    category: {
      id: 'cat-2',
      name: 'Technical',
      description: 'Technical support',
    },
  },
  {
    id: 'conv-3',
    user_id: 'user-3',
    company_id: 'company-1',
    category_id: 'cat-3',
    assigned_staff_id: 'agent-1',
    status: ConversationStatus.OPEN,
    active: true,
    needs_human_agent: false,
    created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
    last_activity: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    user: mockUsers[2],
    category: {
      id: 'cat-3',
      name: 'General',
      description: 'General inquiries',
    },
  },
];

// Mock Messages for conv-1
export const mockMessages: Record<string, Message[]> = {
  'conv-1': [
    {
      id: 'msg-1',
      conversation_id: 'conv-1',
      user_id: 'user-1',
      role: MessageRole.USER,
      content: 'Hi, I need help with my billing dashboard. It keeps showing an error.',
      created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-2',
      conversation_id: 'conv-1',
      role: MessageRole.AI,
      content:
        "I understand you're experiencing issues with the billing dashboard. Let me connect you with a billing specialist who can help you directly.",
      sources: [
        {
          type: 'faq',
          id: 'faq-1',
          content: 'Billing FAQ',
          similarity: 0.85,
        },
      ],
      confidence_score: 0.75,
      created_at: new Date(Date.now() - 9 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-3',
      conversation_id: 'conv-1',
      role: MessageRole.SYSTEM,
      content: 'John Doe (Agent) has joined the conversation.',
      created_at: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-4',
      conversation_id: 'conv-1',
      user_id: 'agent-1',
      role: MessageRole.AI,
      content: "Hi Sarah! I'm here to help. Can you tell me what error message you're seeing?",
      created_at: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-5',
      conversation_id: 'conv-1',
      user_id: 'user-1',
      role: MessageRole.USER,
      content: 'It says "Payment method not found" but I know I have a card on file.',
      created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-6',
      conversation_id: 'conv-1',
      user_id: 'agent-1',
      role: MessageRole.AI,
      content:
        "I see. Let me check your account. It looks like your payment method expired last month. You'll need to update it in Settings → Billing → Payment Methods.",
      created_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    },
  ],
  'conv-2': [
    {
      id: 'msg-7',
      conversation_id: 'conv-2',
      user_id: 'user-2',
      role: MessageRole.USER,
      content: 'How do I reset my password?',
      created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-8',
      conversation_id: 'conv-2',
      role: MessageRole.AI,
      content:
        'To reset your password:\n1. Click "Forgot Password" on the login page\n2. Enter your email\n3. Check your inbox for a reset link\n4. Follow the instructions in the email',
      sources: [
        {
          type: 'article_chunk',
          id: 'article-1',
          content: 'Password Reset Guide',
          similarity: 0.92,
        },
      ],
      confidence_score: 0.88,
      created_at: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
    },
  ],
  'conv-3': [
    {
      id: 'msg-9',
      conversation_id: 'conv-3',
      user_id: 'user-3',
      role: MessageRole.USER,
      content: 'Thank you for the help earlier!',
      created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    },
  ],
};