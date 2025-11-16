import React from 'react';

// =========
// TypeDefs
// =========

export interface Company {
  id: number;
  name: string;
  shopify_domain: string | null;
  api_key: string | null;
  access_token: string | null;
  created_at: string;
}

export interface AppUser {
  id: number;
  email: string;
  password_hash: string;
  company_id: number;
  created_at: string;
}

export interface DashboardData {
  company_id: string;
  name: string;
  data: unknown | null;
}

export interface LoginResult {
  userId: string;
  companyId: string;
}

export interface SignupResult {
  userId: string;
  companyId: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  companyName: string;
}

// NOTE: In a real application you should NEVER store or compare raw passwords on the client.
// This example follows the provided schema (users.password_hash) but you should replace this
// with a secure, server-side authentication flow in production.

// ================
// Auth / Accounts
// ================

const BACKEND_BASE_URL = 'https://saasbackend-55cm.onrender.com/';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function signup(
  email: string,
  password: string,
  companyName: string,
): Promise<SignupResult> {
  const response = await fetch(`${BACKEND_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      company_name: companyName,
    }),
  });

  const result = await handleResponse<SignupResult>(response);
  
  // Store companyId in localStorage
  if (result.companyId) {
    localStorage.setItem('companyId', result.companyId);
    localStorage.setItem('userId', result.userId);
  }
  
  return result;
}

export async function login(email: string, password: string): Promise<LoginResult> {
  const response = await fetch(`${BACKEND_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const result = await handleResponse<LoginResult>(response);
  
  // Store companyId in localStorage
  if (result.companyId) {
    localStorage.setItem('companyId', result.companyId);
    localStorage.setItem('userId', result.userId);
  }
  
  return result;
}

// Helper functions for login/signup pages
export async function handleLogin(credentials: LoginCredentials): Promise<void> {
  try {
    const result = await login(credentials.email, credentials.password);
    // Redirect to dashboard after successful login
    window.location.href = '/dashboard';
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed';
    alert(message);
    throw error;
  }
}

export async function handleSignup(credentials: SignupCredentials): Promise<void> {
  try {
    const result = await signup(credentials.email, credentials.password, credentials.companyName);
    // Redirect to dashboard after successful signup
    window.location.href = '/dashboard';
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Signup failed';
    alert(message);
    throw error;
  }
}

// =================
// Dashboard / Data
// =================

export async function fetchDashboardData(
  companyId: number | string,
): Promise<DashboardData | null> {
  const response = await fetch(`${BACKEND_BASE_URL}/dashboard/${companyId}`, {
    method: 'GET',
  });

  // The backend returns DashboardCompanyResponse with company_id, name, and data
  if (response.status === 404) {
    return null;
  }

  return handleResponse<DashboardData>(response);
}

// Hook to get companyId from localStorage (proper React hook)
export function useCompanyId(): number | null {
  const [companyId, setCompanyId] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const stored = localStorage.getItem('companyId');
    const parsed = stored ? parseInt(stored, 10) : null;
    setCompanyId(parsed);

    // Listen for storage changes (e.g., when user logs in from another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'companyId') {
        const newValue = e.newValue ? parseInt(e.newValue, 10) : null;
        setCompanyId(newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return companyId;
}

// ==========
// Settings
// ==========

export async function saveSettings(
  companyId: number,
  shopifyDomain: string,
  apiKey: string,
  accessToken: string,
): Promise<Company> {
  // This helper now calls the FastAPI settings endpoint underneath
  return saveCompanySettings(companyId, {
    storeDomain: shopifyDomain,
    apiKey,
    accessToken,
  });
}

// ===========
// Admin APIs
// ===========

export async function fetchCompanies(): Promise<Company[]> {
  // This function still uses Supabase directly in the original implementation.
  // If you add an admin endpoint in FastAPI, you can update this to use fetch as well.
  throw new Error('fetchCompanies is not implemented against the FastAPI backend yet.');
}

// ====================
// Company Settings API
// ====================

export interface CompanySettingsInput {
  storeDomain: string;
  apiKey: string;
  accessToken: string;
}

export async function fetchCompanySettings(
  companyId: number | string,
): Promise<Company | null> {
  const response = await fetch(`${BACKEND_BASE_URL}/settings/${companyId}`, {
    method: 'GET',
  });

  if (response.status === 404) {
    return null;
  }

  // Backend returns CompanyResponse which matches Company interface
  return handleResponse<Company>(response);
}

export async function saveCompanySettings(
  companyId: number | string,
  settings: CompanySettingsInput,
): Promise<Company> {
  const response = await fetch(`${BACKEND_BASE_URL}/settings/${companyId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      shopify: {
        shop_domain: settings.storeDomain,
        api_key: settings.apiKey,
        access_token: settings.accessToken,
      },
    }),
  });

  // Backend returns CompanyResponse which matches Company interface
  return handleResponse<Company>(response);
}

