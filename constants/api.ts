// API Configuration
export const API_BASE_URL = 'https://virfq.com/api';
export const DEV_API_URL = 'http://localhost:3000/api';

// Use production API by default
export const API_URL = __DEV__ ? DEV_API_URL : API_BASE_URL;

// API Endpoints
export const ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
  VERIFY_EMAIL: '/auth/verify-email',
  VERIFY_OTP: '/auth/verify-otp',
  RESEND_VERIFICATION: '/auth/resend-verification',
  REQUEST_RESET: '/auth/request-reset',
  RESET_PASSWORD: '/auth/reset-password',
  CHANGE_PASSWORD: '/auth/change-password',
  
  // RFQ
  RFQ_LIST: '/rfq',
  RFQ_DETAIL: (id: string) => `/rfq/${id}`,
  RFQ_UNLOCK: (id: string) => `/rfq/${id}/unlock`,
  RFQ_FILTERS: '/rfq/filters',
  
  // User
  PROFILE: '/users/profile',
  
  // Other
  CATEGORIES: '/categories',
  PLANS: '/plans',
  CONTACT: '/contact',
} as const;
