export const API_BASE_URL = 'https://virfq.com/api';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  VERIFY_OTP: '/auth/verify-otp',
  RESEND_OTP: '/auth/resend-otp',
  FORGOT_PASSWORD: '/auth/forgot-password',
  CHANGE_PASSWORD: '/auth/change-password',
  ME: '/auth/me',
  LOGOUT: '/auth/logout',
  
  // User
  PROFILE: '/users/profile',
  
  // RFQ
  RFQ_LIST: '/rfq',
  RFQ_DETAIL: (id: string) => `/rfq/${id}`,
  RFQ_UNLOCK: (id: string) => `/rfq/${id}/unlock`,
  
  // Plans
  PLANS: '/plans',
  
  // Payments
  BANK_TRANSFER: '/payments/bank-transfer',
  VALIDATE_COUPON: '/coupons/validate',
};
