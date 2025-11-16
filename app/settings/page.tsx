"use client";

import React, { useEffect, useState, type FormEvent } from "react";
import {
  fetchCompanySettings,
  saveCompanySettings,
  useCompanyId,
  type Company,
  type CompanySettingsInput,
} from "@/lib/api";

const SettingsPage: React.FC = () => {
  const companyId = useCompanyId();

  const [company, setCompany] = useState<Company | null>(null);
  const [storeDomain, setStoreDomain] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [accessToken, setAccessToken] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // ---------- Load Settings ----------
  useEffect(() => {
    let isMounted = true;

    const loadSettings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        if (!companyId) {
          if (isMounted) setError("No company ID found. Please sign in again.");
          return;
        }

        const currentCompany = await fetchCompanySettings(companyId);

        if (!isMounted) return;

        if (!currentCompany) {
          if (isMounted) setError("Company not found.");
          return;
        }

        setCompany(currentCompany);
        setStoreDomain(currentCompany.shopify_domain ?? "");
        setApiKey(currentCompany.api_key ?? "");
        setAccessToken(currentCompany.access_token ?? "");
      } catch (err) {
        if (isMounted) {
          setError("Failed to load settings.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadSettings();
    return () => {
      isMounted = false;
    };
  }, [companyId]);

  // ---------- Save Settings ----------
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!companyId) {
      setError("No company ID found. Please sign in again.");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    const payload: CompanySettingsInput = {
      storeDomain,
      apiKey,
      accessToken,
    };

    try {
      const updatedCompany = await saveCompanySettings(companyId, payload);
      setCompany(updatedCompany);
      setSuccess("Settings saved successfully!");
    } catch (err) {
      setError("Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  // ---------- UI Renderer ----------
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="rounded-md bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Loading settings...
        </div>
      );
    }

    if (error) {
      return (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      );
    }

    if (!company) {
      return (
        <div className="rounded-md bg-slate-50 px-4 py-3 text-sm text-slate-600">
          No company settings available.
        </div>
      );
    }

    return (
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <h2 className="text-sm font-semibold text-slate-900">
            Shopify Integration
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Connect your Shopify store and sync your settings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-4 py-5">
          {/* Shopify Domain */}
          <div className="space-y-1">
            <label
              htmlFor="storeDomain"
              className="block text-sm font-medium text-slate-700"
            >
              Shopify Store Domain
            </label>
            <input
              id="storeDomain"
              type="text"
              value={storeDomain}
              onChange={(e) => setStoreDomain(e.target.value)}
              placeholder="your-store.myshopify.com"
              className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm"
            />
          </div>

          {/* API Key */}
          <div className="space-y-1">
            <label
              htmlFor="apiKey"
              className="block text-sm font-medium text-slate-700"
            >
              API Key
            </label>
            <input
              id="apiKey"
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm"
            />
          </div>

          {/* Access Token */}
          <div className="space-y-1">
            <label
              htmlFor="accessToken"
              className="block text-sm font-medium text-slate-700"
            >
              Access Token
            </label>
            <input
              id="accessToken"
              type="password"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm"
            />
          </div>

          {/* Save button + status */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:bg-slate-400"
            >
              {isSaving ? "Saving..." : "Save Settings"}
            </button>

            <div className="space-y-2 text-sm">
              {success && (
                <div className="rounded-md bg-emerald-50 px-3 py-2 text-emerald-700">
                  {success}
                </div>
              )}
              {error && (
                <div className="rounded-md bg-red-50 px-3 py-2 text-red-700">
                  {error}
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    );
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Settings
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Manage your Shopify integration and app connection details.
        </p>
      </header>

      {renderContent()}
    </main>
  );
};

export default SettingsPage;
