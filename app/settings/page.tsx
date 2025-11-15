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

