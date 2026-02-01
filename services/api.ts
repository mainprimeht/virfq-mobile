import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '../constants';
import type { 
  ApiResponse, 
  PaginatedResponse, 
  LoginResponse, 
  User, 
  RFQ, 
  UnlockedContact,
  ProfileUpdate,
  Plan,
  RFQFilters,
} from '../types';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = API_BASE_URL;
    this.loadToken();
  }

  private async loadToken() {
    try {
      this.token = await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Failed to load token:', error);
    }
  }

  private async saveToken(token: string, refreshToken?: string) {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      if (refreshToken) {
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
      }
      this.token = token;
    } catch (error) {
      console.error('Failed to save token:', error);
    }
  }

  async clearToken() {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      this.token = null;
    } catch (error) {
      console.error('Failed to clear token:', error);
    }
  }

  async getToken(): Promise<string | null> {
    if (!this.token) {
      this.token = await SecureStore.getItemAsync(TOKEN_KEY);
    }
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Request failed');
      }

      return data;
    } catch (error: any) {
      if (error.message === 'Network request failed') {
        throw new Error('Không có kết nối mạng');
      }
      throw error;
    }
  }

  // Auth APIs
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.request<ApiResponse<LoginResponse>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.data) {
      await this.saveToken(response.data.accessToken, response.data.refreshToken);
      return response.data;
    }
    throw new Error('Login failed');
  }

  async register(name: string, email: string, password: string): Promise<void> {
    await this.request<ApiResponse<void>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async verifyOTP(email: string, otp: string): Promise<LoginResponse> {
    const response = await this.request<ApiResponse<LoginResponse>>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
    
    if (response.data) {
      await this.saveToken(response.data.accessToken, response.data.refreshToken);
      return response.data;
    }
    throw new Error('Verification failed');
  }

  async resendOTP(email: string): Promise<void> {
    await this.request<ApiResponse<void>>('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async forgotPassword(email: string): Promise<void> {
    await this.request<ApiResponse<void>>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await this.request<ApiResponse<void>>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  async getMe(): Promise<User> {
    const response = await this.request<ApiResponse<User>>('/auth/me');
    if (response.data) {
      return response.data;
    }
    throw new Error('Failed to get user');
  }

  async logout(): Promise<void> {
    try {
      await this.request<ApiResponse<void>>('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      // Ignore logout errors
    }
    await this.clearToken();
  }

  // User APIs
  async updateProfile(data: ProfileUpdate): Promise<User> {
    const response = await this.request<ApiResponse<User>>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (response.data) {
      return response.data;
    }
    throw new Error('Failed to update profile');
  }

  // RFQ APIs
  async getRFQs(filters: RFQFilters = {}): Promise<PaginatedResponse<RFQ>> {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.categories?.length) {
      filters.categories.forEach(c => params.append('category', c));
    }
    if (filters.countries?.length) {
      filters.countries.forEach(c => params.append('country', c));
    }
    if (filters.incoterms?.length) {
      filters.incoterms.forEach(i => params.append('incoterm', i));
    }

    const query = params.toString();
    const endpoint = `/rfq${query ? `?${query}` : ''}`;
    
    return this.request<PaginatedResponse<RFQ>>(endpoint);
  }

  async getRFQDetail(id: string): Promise<RFQ> {
    const response = await this.request<ApiResponse<RFQ>>(`/rfq/${id}`);
    if (response.data) {
      return response.data;
    }
    throw new Error('RFQ not found');
  }

  async unlockRFQ(id: string): Promise<ApiResponse<UnlockedContact>> {
    return this.request<ApiResponse<UnlockedContact>>(`/rfq/${id}/unlock`, {
      method: 'POST',
    });
  }

  // Plan APIs
  async getPlans(): Promise<Plan[]> {
    const response = await this.request<ApiResponse<Plan[]>>('/plans');
    return response.data || [];
  }

  // Payment APIs
  async createBankTransfer(planId: string, period: number, couponCode?: string): Promise<{
    orderId: string;
    bankInfo: {
      bankName: string;
      accountNumber: string;
      accountName: string;
      content: string;
      amount: number;
      qrUrl?: string;
    };
    expiresAt: string;
  }> {
    const response = await this.request<ApiResponse<any>>('/payments/bank-transfer', {
      method: 'POST',
      body: JSON.stringify({ planId, period, couponCode }),
    });
    if (response.data) {
      return response.data;
    }
    throw new Error('Failed to create payment');
  }

  async validateCoupon(code: string, planId: string): Promise<{
    valid: boolean;
    discount: number;
    discountType: 'percent' | 'fixed';
  }> {
    const response = await this.request<ApiResponse<any>>('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code, planId }),
    });
    return response.data || { valid: false, discount: 0, discountType: 'percent' };
  }
}

export const api = new ApiService();
