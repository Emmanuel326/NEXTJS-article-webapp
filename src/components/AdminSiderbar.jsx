import Link from "next/link";
import styles from "../styles/AdminSidebar.module.css";

export default function AdminSidebar() {
  return (
    <aside className={styles.sidebar} aria-label="Admin Sidebar">
      <h2 className={styles.title}>Admin Menu</h2>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <Link href="/admin/dashboard">
            <a className={styles.navLink}>Dashboard</a>
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/admin/create-blog">
            <a className={styles.navLink}>Create Blog</a>
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/admin/articles">
            <a className={styles.navLink}>Articles</a>
          </Link>
        </li>
        {/* Additional links can be added here */}
      </ul>
    </aside>
  );
}


