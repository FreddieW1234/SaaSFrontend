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
  id: number;
  company_id: number;
  data_json: unknown;
  created_at: string;
}

export interface LoginResult {
  user: AppUser;
  company: Company | null;
}

export interface SignupResult {
  user: AppUser;
  company: Company;
}

// NOTE: In a real application you should NEVER store or compare raw passwords on the client.
// This example follows the provided schema (users.password_hash) but you should replace this
// with a secure, server-side authentication flow in production.

// ================
// Auth / Accounts
// ================

const BACKEND_BASE_URL = 'https://your-backend.onrender.com';

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

  // The backend should return a JSON body matching SignupResult
  // { user: AppUser, company: Company }
  return handleResponse<SignupResult>(response);
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

  // The backend should return a JSON body matching LoginResult
  // { user: AppUser, company: Company | null }
  return handleResponse<LoginResult>(response);
}

// =================
// Dashboard / Data
// =================

export async function fetchDashboardData(
  companyId: number,
): Promise<DashboardData | null> {
  const response = await fetch(`${BACKEND_BASE_URL}/dashboard/${companyId}`, {
    method: 'GET',
  });

  // The backend should return either null/404 or a single DashboardData object
  // If the backend wraps it differently, adjust this mapping accordingly.
  if (response.status === 404) {
    return null;
  }

  return handleResponse<DashboardData | null>(response);
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
  companyId: number,
): Promise<Company | null> {
  const response = await fetch(`${BACKEND_BASE_URL}/settings/${companyId}`, {
    method: 'GET',
  });

  if (response.status === 404) {
    return null;
  }

  // The backend should return a structure that can be mapped to Company.
  // If necessary, adapt the mapping here to match the backend response.
  return handleResponse<Company | null>(response);
}

export async function saveCompanySettings(
  companyId: number,
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

  // The backend should return a structure that can be mapped to Company.
  // If necessary, adapt the mapping here to match the backend response.
  return handleResponse<Company>(response);
}

