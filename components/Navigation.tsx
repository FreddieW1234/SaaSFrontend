import Link from 'next/link';
import styles from './Navigation.module.css';

export default function Navigation() {
  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          SaaS Dashboard
        </Link>
        <ul className={styles.menu}>
          <li>
            <Link href="/login" className={styles.link}>
              Login
            </Link>
          </li>
          <li>
            <Link href="/signup" className={styles.link}>
              Signup
            </Link>
          </li>
          <li>
            <Link href="/dashboard" className={styles.link}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/settings" className={styles.link}>
              Settings
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

