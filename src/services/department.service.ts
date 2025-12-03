import api from './api';

export interface Department {
  id: string;
  company_id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  staff?: any[]; // Staff members in this department
}

export interface CreateDepartmentDto {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  display_order?: number;
}

export interface UpdateDepartmentDto {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
  display_order?: number;
  is_active?: boolean;
}

export const departmentService = {
  // Get all departments for company
  async getDepartments(): Promise<Department[]> {
    const response = await api.get('/departments');
    return response.data.data;
  },

  // Get single department with staff
  async getDepartment(id: string): Promise<Department> {
    const response = await api.get(`/departments/${id}`);
    return response.data.data;
  },

  // Create department
  async createDepartment(data: CreateDepartmentDto): Promise<Department> {
    const response = await api.post('/departments', data);
    return response.data.data;
  },

  // Update department
  async updateDepartment(id: string, data: UpdateDepartmentDto): Promise<Department> {
    const response = await api.put(`/departments/${id}`, data);
    return response.data.data;
  },

  // Delete department (soft delete)
  async deleteDepartment(id: string): Promise<void> {
    await api.delete(`/departments/${id}`);
  },

  // Get public departments (for widget - no auth required)
  async getPublicDepartments(companyId: string): Promise<Department[]> {
    const response = await api.get(`/departments/public/${companyId}`);
    return response.data.data;
  },
};
