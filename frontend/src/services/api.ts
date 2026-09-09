import { ResumeParseResponse, UserProfile } from '../types';

function getApiBaseUrl(): string {
  let url = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000/api/v1';
  url = url.trim().replace(/\/+$/, '');
  if (!url.endsWith('/api/v1')) {
    url = `${url}/api/v1`;
  }
  return url;
}

const API_BASE_URL = getApiBaseUrl();

// Token & Session Storage Keys
const TOKEN_KEY = 'jobpal_auth_token';
const USER_SESSION_KEY = 'jobpal_user_session';
const REMEMBERED_EMAIL_KEY = 'jobpal_remembered_email';

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token: string | null): void {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch (err) {
    console.warn('Unable to access localStorage for auth token:', err);
  }
}

export function getStoredUserSession(): Partial<UserProfile> | null {
  try {
    const raw = localStorage.getItem(USER_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveStoredUserSession(user: Partial<UserProfile>): void {
  try {
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
  } catch (err) {
    console.warn('Unable to save user session to localStorage:', err);
  }
}

export function clearUserSession(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_SESSION_KEY);
  } catch (err) {
    console.warn('Unable to clear user session from localStorage:', err);
  }
}

export function getRememberedEmail(): string {
  try {
    return localStorage.getItem(REMEMBERED_EMAIL_KEY) || '';
  } catch {
    return '';
  }
}

export function setRememberedEmail(email: string, remember: boolean): void {
  try {
    if (remember && email) {
      localStorage.setItem(REMEMBERED_EMAIL_KEY, email);
    } else {
      localStorage.removeItem(REMEMBERED_EMAIL_KEY);
    }
  } catch (err) {
    console.warn('Unable to save remembered email:', err);
  }
}

// Authentication API calls
export async function loginUser(
  email: string,
  password: string
): Promise<{ access_token: string; token_type: string; user?: Partial<UserProfile> }> {
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Invalid email or password' }));
      throw new Error(errorData.detail || 'Authentication failed. Please check your credentials.');
    }

    const data = await response.json();
    if (data.access_token) {
      setAuthToken(data.access_token);
    }
    return data;
  } catch (err: any) {
    // If backend is offline or unreachable, permit offline/local sign-in for resilience
    if (err.message && !err.message.includes('Authentication failed') && !err.message.includes('Invalid')) {
      console.warn('Backend unavailable, proceeding in offline mode:', err.message);
      return {
        access_token: 'offline_token_' + Date.now(),
        token_type: 'bearer',
        user: { email },
      };
    }
    throw err;
  }
}

export async function signupUser(
  userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    state?: string;
    country?: string;
    primaryGoal?: string;
    role?: string;
    skills?: string[];
  }
): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Registration failed' }));
      throw new Error(errorData.detail || 'Failed to create account. Email may already be in use.');
    }

    return await response.json();
  } catch (err: any) {
    // If backend is unreachable, return simulated response for offline/local mode
    if (err.message && !err.message.includes('already exists') && !err.message.includes('Registration failed')) {
      console.warn('Backend unavailable during signup, saving locally:', err.message);
      return {
        id: Date.now(),
        ...userData,
        plan: 'Free Plan',
      };
    }
    throw err;
  }
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch {
    return null;
  }
}

// Resumes API calls
export async function parseResumeFile(file: File): Promise<ResumeParseResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('filename', file.name);

  const token = getAuthToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/resumes/parse-and-extract`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Failed to parse resume' }));
      throw new Error(errorData.detail || `Server returned error ${response.status}`);
    }

    return await response.json();
  } catch (err: any) {
    console.error('API Error parsing resume file:', err);
    throw err;
  }
}

export async function parseResumeText(rawText: string, filename: string = 'pasted_resume.txt'): Promise<ResumeParseResponse> {
  const formData = new FormData();
  formData.append('raw_text', rawText);
  formData.append('filename', filename);

  const token = getAuthToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/resumes/parse-and-extract`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Failed to parse resume' }));
      throw new Error(errorData.detail || `Server returned error ${response.status}`);
    }

    return await response.json();
  } catch (err: any) {
    console.error('API Error parsing resume text:', err);
    throw err;
  }
}

export async function checkBackendHealth(): Promise<{ status: string; groq_configured?: boolean }> {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api/v1', '')}/health`, {
      method: 'GET',
    });
    if (response.ok) {
      return await response.json();
    }
    return { status: 'offline' };
  } catch {
    return { status: 'offline' };
  }
}
