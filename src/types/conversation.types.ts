import type { User } from "./user.types";

export enum ConversationStatus {
  OPEN = 'OPEN',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export interface Conversation {
  id: string;
  user_id: string;
  company_id: string;
  category_id?: string;
  assigned_staff_id?: string;
  status: ConversationStatus;
  active: boolean;
  needs_human_agent: boolean;
  created_at: string;
  updated_at: string;
  last_activity: string;
  last_message?: string;
  department_name?: string;
  user?: User;
  assignedStaff?: User;
  category?: Category;
  rating?: number;
  rating_comment?: string;
  rated_at?: string;
  /** Present when the API expands the owning company relation. */
  company?: Company;
  /** Free-text note recorded when an agent resolves the conversation. */
  resolution_notes?: string;
  notes?: string;
  escalation_reason?: string;
  assigned_at?: string;
  /** Supplied by the paginated/list endpoints. */
  message_count?: number;
}

export interface Company {
  id: string;
  name: string;
  email?: string;
  phone_number?: string;
  city?: string;
  country?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}