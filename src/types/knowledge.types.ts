export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category_id?: string;
  category_name?: string;
  helpful_count?: number;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  category_id?: string;
  category_name?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}