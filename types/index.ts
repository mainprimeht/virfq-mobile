// User Types
export interface User {
  id: string;
  email: string;
  name?: string;
  company?: string;
  phone?: string;
  whatsapp?: string;
  country?: string;
  role?: string;
  createdAt: string;
  updatedAt?: string;
  subscription?: Subscription;
  trialInfo?: TrialInfo;
}

export interface Subscription {
  planId: string;
  planName: string;
  status: 'active' | 'expired' | 'cancelled';
  expiresAt?: string;
  dailyLimit?: number;
  usedToday?: number;
}

export interface TrialInfo {
  isInTrial: boolean;
  trialEndsAt?: string;
  trialDaysRemaining?: number;
}

// RFQ Types
export interface RFQ {
  id: string;
  titleEn: string;
  descriptionEn?: string;
  productCategory?: ProductCategory;
  buyerCountry: string;
  buyerCountryCode?: string;
  quantity: string;
  quantityUnit?: string;
  incoterms: string;
  qualityScore?: number;
  isFeatured?: boolean;
  isEarlyAccess?: boolean;
  createdAt: string;
  updatedAt?: string;
  translationVi?: RFQTranslation;
}

export interface RFQTranslation {
  titleVi?: string;
  descriptionVi?: string;
}

export interface ProductCategory {
  id: string;
  nameEn: string;
  nameVi?: string;
  slug?: string;
}

export interface UnlockedContact {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// Auth Types
export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  email: string;
}

// Plan Types
export interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  features: string[];
  dailyLimit: number;
  canViewEmail: boolean;
  canViewPhone: boolean;
  canExportCsv: boolean;
}

// Filter Types
export interface RFQFilters {
  search?: string;
  categories?: string[];
  countries?: string[];
  incoterms?: string[];
  page?: number;
  limit?: number;
}

// Profile Update
export interface ProfileUpdate {
  name?: string;
  company?: string;
  phone?: string;
  whatsapp?: string;
  country?: string;
}
