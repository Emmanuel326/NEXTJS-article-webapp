"use client";

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router"; // Use next/router for pages
import AuthContext from "../../context/AuthContext";
import styles from "../../styles/login.module.css";

export default function AdminLogin() {
  const { user, login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting login with username:", username);
    await login(username, password);
  };

  // Check for user and redirect only if we're not already on the dashboard.
  useEffect(() => {
    console.log("AdminLogin useEffect: user =", user, "router.pathname =", router.pathname);
    if (user && router.pathname !== "/admin/dashboard") {
      router.replace("/admin/dashboard");
    }
  }, [user, router.pathname]);

  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.loginTitle}>Admin Login</h2>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <input 
          className={styles.loginInput}
          type="text" 
          placeholder="Username" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required 
        />
        <input 
          className={styles.loginInput}
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
        <button className={styles.loginButton} type="submit">Login</button>
      </form>
    </div>
  );
}

// This flag tells _app.js not to wrap this page in the public layout.
AdminLogin.noLayout = true;
