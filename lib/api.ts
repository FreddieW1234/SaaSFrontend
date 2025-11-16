import supabase from './supabaseClient';

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

export async function signup(
  email: string,
  password: string,
  companyName: string,
): Promise<SignupResult> {
  // 1) Create company
  const {
    data: company,
    error: companyError,
  } = await supabase
    .from('companies')
    .insert({
      name: companyName,
      shopify_domain: null,
      api_key: null,
      access_token: null,
    })
    .select('*')
    .single();

  if (companyError || !company) {
    throw new Error(companyError?.message ?? 'Failed to create company');
  }

  // 2) Create user linked to company
  const {
    data: user,
    error: userError,
  } = await supabase
    .from('users')
    .insert({
      email,
      // WARNING: for demo only. Store a proper password hash in a real application.
      password_hash: password,
      company_id: company.id,
    })
    .select('*')
    .single();

  if (userError || !user) {
    // At this point the company has already been created; in a real-world app you
    // might want to clean it up via a backend RPC / transaction.
    throw new Error(userError?.message ?? 'Failed to create user');
  }

  return {
    user: user as AppUser,
    company: company as Company,
  };
}

export async function login(email: string, password: string): Promise<LoginResult> {
  const {
    data: user,
    error,
  } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .eq('password_hash', password)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const {
    data: company,
    error: companyError,
  } = await supabase
    .from('companies')
    .select('*')
    .eq('id', user.company_id)
    .maybeSingle();

  if (companyError) {
    throw new Error(companyError.message);
  }

  return {
    user: user as AppUser,
    company: (company as Company) ?? null,
  };
}

// =================
// Dashboard / Data
// =================

export async function fetchDashboardData(
  companyId: number,
): Promise<DashboardData | null> {
  const {
    data,
    error,
  } = await supabase
    .from('dashboard_data')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data as DashboardData) ?? null;
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
  const {
    data,
    error,
  } = await supabase
    .from('companies')
    .update({
      shopify_domain: shopifyDomain,
      api_key: apiKey,
      access_token: accessToken,
    })
    .eq('id', companyId)
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? 'Failed to save settings');
  }

  return data as Company;
}

// ===========
// Admin APIs
// ===========

export async function fetchCompanies(): Promise<Company[]> {
  const { data, error } = await supabase.from('companies').select('*').order('created_at', {
    ascending: false,
  });

  if (error) {
    throw new Error(error.message);
  }

  return (data as Company[]) ?? [];
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
  const {
    data,
    error,
  } = await supabase
    .from('companies')
    .select('*')
    .eq('id', companyId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data as Company) ?? null;
}

export async function saveCompanySettings(
  companyId: number,
  settings: CompanySettingsInput,
): Promise<Company> {
  return saveSettings(companyId, settings.storeDomain, settings.apiKey, settings.accessToken);
}

