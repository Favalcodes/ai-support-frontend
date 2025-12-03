import api from './api';

export interface WidgetConfig {
  id: string;
  company_id: string;
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  primary_color: string;
  title: string;
  welcome_message: string;
  placeholder_text: string;
  auto_open: boolean;
  auto_open_delay: number;
  default_category_id?: string;
  logo_url?: string;
  avatar_url?: string;
  business_hours?: {
    enabled: boolean;
    timezone: string;
    hours: {
      [key: string]: { open: string; close: string; enabled: boolean };
    };
  };
  offline_message?: string;
  allowed_domains?: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdateWidgetConfigDto {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  primary_color?: string;
  title?: string;
  welcome_message?: string;
  placeholder_text?: string;
  auto_open?: boolean;
  auto_open_delay?: number;
  default_category_id?: string;
  logo_url?: string;
  avatar_url?: string;
  business_hours?: {
    enabled: boolean;
    timezone: string;
    hours: {
      [key: string]: { open: string; close: string; enabled: boolean };
    };
  };
  offline_message?: string;
  allowed_domains?: string[];
  is_active?: boolean;
}

export const widgetService = {
  // Get widget configuration
  async getConfig(): Promise<WidgetConfig> {
    const response = await api.get('/widget/config');
    return response.data.data;
  },

  // Update widget configuration
  async updateConfig(data: UpdateWidgetConfigDto): Promise<WidgetConfig> {
    const response = await api.put('/widget/config', data);
    return response.data.data;
  },

  // Get installation code
  async getInstallCode(): Promise<{ code: string; config: WidgetConfig }> {
    const response = await api.get('/widget/install-code');
    return response.data.data;
  },

  // Get public widget config (no auth)
  async getPublicConfig(companyId: string): Promise<Partial<WidgetConfig>> {
    const response = await api.get(`/widget/public/${companyId}`);
    return response.data.data;
  },
};
