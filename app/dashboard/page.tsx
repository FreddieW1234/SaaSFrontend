'use client';

import { useEffect, useState } from 'react';
import { fetchDashboardData } from '@/lib/api';
import styles from './page.module.css';

export default function DashboardPage() {
  const [companyName, setCompanyName] = useState('[Company Name]');

  useEffect(() => {
    // Placeholder: In the future, fetch actual company name from API
    fetchDashboardData();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          Welcome, {companyName}!
        </h1>
        <p className={styles.message}>
          Your data will appear here.
        </p>
      </div>
    </div>
  );
}

