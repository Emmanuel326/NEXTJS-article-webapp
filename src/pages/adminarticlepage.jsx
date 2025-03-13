"use client";

import React from 'react';
import AdminArticleEditor from '../components/AdminArticleEditor';
import { motion } from 'framer-motion';
import styles from '../styles/adminpage.module.css';

// Note: In a production environment, ensure this page is protected via authentication/authorization.

function AdminArticlePage() {
  return (
    <motion.div 
      className={styles.adminArticlePage}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.container}>
        <h1 className={styles.pageHeading}>Admin Article Editor</h1>
        <AdminArticleEditor />
      </div>
    </motion.div>
  );
}

export default AdminArticlePage;
