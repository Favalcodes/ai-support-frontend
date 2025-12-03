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
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}