// User types
export interface User {
  id: string;
  email: string;
  name: string | null;
  company: string | null;
  phone: string | null;
  whatsapp: string | null;
  country: string | null;
  role: 'user' | 'admin';
  trialInfo?: {
    isInTrial: boolean;
    trialDaysRemaining: number;
    emailVerified: boolean;
  };
  subscription?: {
    planId: string;
    planName: string;
    expiresAt: string;
  };
}

// RFQ types
export interface ProductCategory {
  id: string;
  nameVi: string;
  nameEn: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
}

export interface TranslationVi {
  titleVi: string;
  descriptionVi: string;
}

export interface RFQ {
  id: string;
  slug: string;
  titleEn: string;
  descriptionEn: string;
  translationVi: TranslationVi | null;
  translationStatus: 'pending' | 'translated' | 'failed';
  productCategory: ProductCategory | null;
  quantity: number;
  quantityUnit: string;
  buyerCountry: string;
  incoterms: string;
  targetPrice: number | null;
  shippingPort: string | null;
  createdAt: string;
  isFeatured: boolean;
  qualityScore: number | null;
}

export interface RFQDetail extends RFQ {
  title: string;
  productDescription: string;
  buyerEmail: string | null;
  buyerPhone: string | null;
  buyerWhatsapp: string | null;
  buyerCompany: string | null;
}

export interface RFQAccess {
  canView: boolean;
  contactLevel: 'none' | 'email_only' | 'email_phone' | 'full';
  maskedFields?: string[];
  upgradeRequired?: boolean;
  quotaInfo?: {
    used: number;
    limit: number;
    remaining: number;
  };
  reason?: string;
}

export interface UnlockResult {
  success: boolean;
  rfqId: string;
  contactLevel: string;
  contact: {
    email: string;
    phone: string | null;
    whatsapp: string | null;
    name: string | null;
    company: string | null;
  };
  trialInfo?: {
    used: number;
    limit: number;
    remaining: number;
    daysLeft: number;
    isReopen: boolean;
  };
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    hasNextPage: boolean;
  };
}

export interface RFQListResponse {
  rfqs: RFQ[];
  pagination: {
    page: number;
    limit: number;
    hasNextPage: boolean;
  };
  userContactLevel: string;
}

export interface RFQFilters {
  categories: ProductCategory[];
  countries: string[];
  incoterms: string[];
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name?: string;
  email: string;
  password: string;
  company?: string;
  country?: string;
  phone?: string;
  locale?: string;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  message?: string;
}
