import api from './api';

export interface Company {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  email: string;
  phone_number: string;
  number_of_staff: number;
  created_at: string;
  updated_at: string;
}

export interface UpdateCompanyDto {
  name?: string;
  address?: string;
  city?: string;
  country?: string;
  email?: string;
  phone_number?: string;
}

export const companyService = {
  // Get current user's company
  async getCurrentCompany(): Promise<Company> {
    const response = await api.get('/company/');
    return response.data.data;
  },

  // Get company by ID
  async getCompany(companyId: string): Promise<Company> {
    const response = await api.get(`/company/${companyId}`);
    return response.data.data;
  },

  // Update company details (SUPER_ADMIN only)
  async updateCompany(companyId: string, data: UpdateCompanyDto): Promise<Company> {
    const response = await api.patch(`/company/${companyId}`, data);
    return response.data.data;
  },
};
