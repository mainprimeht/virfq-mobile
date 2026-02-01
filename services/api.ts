import * as SecureStore from 'expo-secure-store';
import { API_URL, ENDPOINTS } from '../constants';
import type { 
  User, 
  RFQ, 
  RFQDetail, 
  RFQAccess, 
  RFQListResponse, 
  RFQFilters,
  UnlockResult,
  LoginRequest,
  RegisterRequest,
  AuthResponse 
} from '../types';

const SESSION_KEY = 'rfq_session';

// Get stored session token
async function getSessionToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(SESSION_KEY);
  } catch {
    return null;
  }
}

// Store session token
export async function setSessionToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(SESSION_KEY, token);
}

// Clear session token
export async function clearSessionToken(): Promise<void> {
  await SecureStore.deleteItemAsync(SESSION_KEY);
}

// Base fetch with auth
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getSessionToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Cookie: `rfq_session=${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  // Handle set-cookie from response
  const setCookie = response.headers.get('set-cookie');
  if (setCookie) {
    const match = setCookie.match(/rfq_session=([^;]+)/);
    if (match) {
      await setSessionToken(match[1]);
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || error.error?.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// ============ AUTH API ============

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const result = await apiFetch<AuthResponse>(ENDPOINTS.LOGIN, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return result;
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  return apiFetch<AuthResponse>(ENDPOINTS.REGISTER, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function logout(): Promise<void> {
  await apiFetch(ENDPOINTS.LOGOUT, { method: 'POST' });
  await clearSessionToken();
}

export async function getMe(): Promise<{ user: User | null }> {
  return apiFetch<{ user: User | null }>(ENDPOINTS.ME);
}

export async function verifyOTP(email: string, otp: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>(ENDPOINTS.VERIFY_OTP, {
    method: 'POST',
    body: JSON.stringify({ email, otp }),
  });
}

export async function resendVerification(email: string, locale = 'vi'): Promise<{ success: boolean; message: string }> {
  return apiFetch(ENDPOINTS.RESEND_VERIFICATION, {
    method: 'POST',
    body: JSON.stringify({ email, locale }),
  });
}

export async function requestPasswordReset(email: string, locale = 'vi'): Promise<{ success: boolean; message: string }> {
  return apiFetch(ENDPOINTS.REQUEST_RESET, {
    method: 'POST',
    body: JSON.stringify({ email, locale }),
  });
}

// ============ RFQ API ============

interface RFQListParams {
  page?: number;
  limit?: number;
  q?: string;
  category?: string;
  country?: string;
  incoterm?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export async function getRFQList(params: RFQListParams = {}): Promise<RFQListResponse> {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  
  const query = searchParams.toString();
  const endpoint = query ? `${ENDPOINTS.RFQ_LIST}?${query}` : ENDPOINTS.RFQ_LIST;
  
  return apiFetch<RFQListResponse>(endpoint);
}

export async function getRFQDetail(id: string): Promise<{ rfq: RFQDetail; access: RFQAccess }> {
  return apiFetch(ENDPOINTS.RFQ_DETAIL(id));
}

export async function checkUnlockStatus(id: string): Promise<{
  isUnlocked: boolean;
  canUnlock: boolean;
  reason: string | null;
  planCode: string;
  trialInfo?: {
    isActive: boolean;
    used: number;
    limit: number;
    remaining: number;
    daysLeft: number;
    canUnlock: boolean;
  };
}> {
  return apiFetch(`${ENDPOINTS.RFQ_UNLOCK(id)}`);
}

export async function unlockRFQ(id: string): Promise<UnlockResult> {
  return apiFetch(ENDPOINTS.RFQ_UNLOCK(id), { method: 'POST' });
}

export async function getRFQFilters(): Promise<RFQFilters> {
  return apiFetch(ENDPOINTS.RFQ_FILTERS);
}

// ============ USER API ============

export async function getProfile(): Promise<{ user: User }> {
  return apiFetch(ENDPOINTS.PROFILE);
}

export async function updateProfile(data: Partial<User>): Promise<{ success: boolean; user: User }> {
  return apiFetch(ENDPOINTS.PROFILE, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
): Promise<{ success: boolean; message: string }> {
  return apiFetch(ENDPOINTS.CHANGE_PASSWORD, {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
  });
}
