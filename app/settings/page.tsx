"use client";

import React, { useEffect, useState, type FormEvent } from "react";
import {
  fetchCompanySettings,
  saveCompanySettings,
  type Company,
  type CompanySettingsInput,
} from "@/lib/api";

// Placeholder auth/session hook.
// Replace this with your real auth/session implementation (e.g. Supabase auth, NextAuth, custom context).
const useCompanyId = (): number | null => {
  // Example:
  // const { session } = useAuth();
  // return session?.companyId ?? null;
  return null;
};

const SettingsPage: React.FC = () => {
  const companyId = useCompanyId();

  const [company, setCompany] = useState<Company | null>(null);
  const [storeDomain, setStoreDomain] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [accessToken, setAccessToken] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadSettings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        if (companyId == null) {
          if (!isMounted) return;
          setError("No company ID found. Please sign in again.");
          setIsLoading(false);
          return;
        }

        const currentCompany = await fetchCompanySettings(companyId);

        if (!isMounted) return;

        if (!currentCompany) {
          setError("Company not found.");
          setIsLoading(false);
          return;
        }

        setCompany(currentCompany);
        setStoreDomain(currentCompany.shopify_domain ?? "");
        setApiKey(currentCompany.api_key ?? "");
        setAccessToken(currentCompany.access_token ?? "");
      } catch (err) {
        if (!isMounted) return;

        const message =
          err instanceof Error ? err.message : "Failed to load settings.";
        setError(message);
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (companyId == null) {
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
      setSuccess("Settings saved successfully.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save settings.";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

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
            Connect your Shopify store to sync data with this app.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-4 py-5">
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
              className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

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
              className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

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
              className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
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
          Manage your Shopify integration and connection details.
        </p>
      </header>

      {renderContent()}
    </main>
  );
};

export default SettingsPage;

'use client';

import { useState } from 'react';
import { saveSettings } from '@/lib/api';
import styles from './page.module.css';

export default function SettingsPage() {
  const [shopifyDomain, setShopifyDomain] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [accessToken, setAccessToken] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveSettings({
      shopifyDomain,
      apiKey,
      accessToken,
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Settings</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="shopifyDomain" className={styles.label}>
              Shopify Store Domain
            </label>
            <input
              type="text"
              id="shopifyDomain"
              value={shopifyDomain}
              onChange={(e) => setShopifyDomain(e.target.value)}
              className={styles.input}
              placeholder="your-store.myshopify.com"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="apiKey" className={styles.label}>
              API Key
            </label>
            <input
              type="text"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className={styles.input}
              placeholder="Enter your API key"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="accessToken" className={styles.label}>
              Access Token
            </label>
            <input
              type="text"
              id="accessToken"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              className={styles.input}
              placeholder="Enter your access token"
            />
          </div>
          <button type="submit" className={styles.button}>
            Save Settings
          </button>
        </form>
      </div>
    </div>
  );
}

