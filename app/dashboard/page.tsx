"use client";

import React, { useEffect, useState } from "react";
import { fetchDashboardData, type DashboardData } from "@/lib/api";

// Placeholder auth/session hook.
// Replace this with your real auth/session implementation (e.g. Supabase auth, NextAuth, custom context).
const useCompanyId = (): number | null => {
  return 1; // temporary test company ID
};

const DashboardPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const companyId = useCompanyId();

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (companyId == null) {
          if (!isMounted) return;
          setError("No company ID found. Please sign in again.");
          setIsLoading(false);
          return;
        }

        const data = await fetchDashboardData(companyId);

        if (!isMounted) return;

        setDashboardData(data);
      } catch (err) {
        if (!isMounted) return;

        const message =
          err instanceof Error ? err.message : "Failed to load dashboard data";
        setError(message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, [companyId]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="rounded-md bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Loading dashboard data...
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

    if (!dashboardData) {
      return (
        <div className="rounded-md bg-slate-50 px-4 py-3 text-sm text-slate-600">
          No dashboard data available yet.
        </div>
      );
    }

    // data_json is typed as any here, so we stringify it for display
    const prettyJson =
      typeof dashboardData.data_json === "string"
        ? dashboardData.data_json
        : JSON.stringify(dashboardData.data_json, null, 2);

    return (
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <h2 className="text-sm font-semibold text-slate-900">
            Dashboard Snapshot
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Latest dashboard data for your company.
          </p>
        </div>
        <div className="px-4 py-4">
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Company ID
              </dt>
              <dd className="mt-1 font-mono text-slate-900">
                {dashboardData.company_id}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Record ID
              </dt>
              <dd className="mt-1 font-mono text-slate-900">
                {dashboardData.id}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Created At
              </dt>
              <dd className="mt-1 font-mono text-xs text-slate-900">
                {new Date(dashboardData.created_at).toLocaleString()}
              </dd>
            </div>
          </dl>

          <div className="mt-6">
            <h3 className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Data
            </h3>
            <pre className="mt-2 max-h-80 overflow-auto rounded-md bg-slate-900 p-3 text-xs text-slate-50">
              {prettyJson}
            </pre>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          High-level metrics and data for your company.
        </p>
      </header>

      {renderContent()}
    </main>
  );
};

export default DashboardPage;

