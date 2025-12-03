export enum UserRole {
  USER = 'USER',
  COMPANY_STAFF = 'COMPANY_STAFF',
  COMPANY_ADMIN = 'COMPANY_ADMIN',
  COMPANY_SUPER_ADMIN = 'COMPANY_SUPER_ADMIN',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  company_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
