// src/components/AdminLayout.jsx
import { AuthProvider } from "../context/AuthContext";
import styles from "../styles/AdminLayout.module.css";

const AdminLayout = ({ children }) => {
  return (
    <AuthProvider>
      <div className={styles.adminLayout}>
        {children}
      </div>
    </AuthProvider>
  );
};

export default AdminLayout;
