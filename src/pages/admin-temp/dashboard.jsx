"use client";


import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import AuthContext from "../../context/AuthContext";
import AdminSidebar from "../../components/AdminSidebar";
import AdminLayout from "../../components/AdminLayout";
import styles from "./dashboard.module.css";

export default function Dashboard() {
  const { user, loading, logout } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/admin/login");
    }
  }, [user, loading]);

  if (loading || !user) {
    return <p>Loading...</p>;
  }

  return (
    <AdminLayout>
      <div className={styles.dashboardContainer}>
        <AdminSidebar />
        <div className={styles.mainContent}>
          <header className={styles.dashboardHeader}>
            <h1 className={styles.dashboardTitle}>Welcome, {user.email}</h1>
            <button className={styles.logoutButton} onClick={logout}>
              Logout
            </button>
          </header>
          <div className={styles.content}>
            {/* Additional dashboard content goes here */}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
