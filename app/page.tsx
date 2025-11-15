import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>B2B SaaS Dashboard</h1>
        <p className={styles.description}>
          Welcome to your B2B SaaS Dashboard. Get started by logging in or signing up.
        </p>
        <div className={styles.actions}>
          <Link href="/login" className={styles.button}>
            Login
          </Link>
          <Link href="/signup" className={styles.buttonSecondary}>
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
