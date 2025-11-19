import React from "react";
import AdminLayout from "../../components/admin/AdminLayout";

const AdminUsersPage: React.FC = () => {
  return (
    <AdminLayout>
      <h1 style={{ marginBottom: "0.5rem" }}>Users</h1>
      <p style={{ opacity: 0.7, marginBottom: "1.5rem" }}>
        Manage registered users and their roles. (Placeholder for now.)
      </p>

      <div
        style={{
          padding: "1rem",
          background: "#ffffff",
          borderRadius: "0.75rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <p>User list, roles, and permissions UI will go here.</p>
      </div>
    </AdminLayout>
  );
};

export default AdminUsersPage;
