import React, { type ReactNode, type CSSProperties } from "react";
import { NavLink } from "react-router-dom";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div style={containerStyle}>
      {/* Sidebar */}
      <aside style={sidebarStyle}>
        <h2 style={logoStyle}>Admin Panel</h2>

        <nav style={{ marginTop: "2rem" }}>
          <NavLink to="/admin" style={navLinkStyle}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/products" style={navLinkStyle}>
            Products
          </NavLink>
          <NavLink to="/admin/orders" style={navLinkStyle}>
            Orders
          </NavLink>
          <NavLink to="/admin/users" style={navLinkStyle}>
            Users
          </NavLink>
          <NavLink to="/admin/settings" style={navLinkStyle}>
            Settings
          </NavLink>
        </nav>
      </aside>

      {/* Main area */}
      <main style={contentWrapperStyle}>
        <div style={topbarStyle}>
          <p style={{ margin: 0, fontWeight: 500 }}>Admin Dashboard</p>
        </div>

        <div style={pageContentStyle}>
          <p
            style={{
              fontSize: "0.9rem",
              opacity: 0.6,
              marginBottom: "0.75rem",
            }}
          >
            AdminLayout is working – this text is from AdminLayout.
          </p>
          {children}
        </div>
      </main>
    </div>
  );
};

const containerStyle: CSSProperties = {
  display: "flex",
  minHeight: "100vh",
  background: "#f3f4f6",
};

const sidebarStyle: CSSProperties = {
  width: "240px",
  background: "#111827",
  color: "#f9fafb",
  padding: "1.5rem 1.25rem",
  display: "flex",
  flexDirection: "column",
};

const logoStyle: CSSProperties = {
  margin: 0,
  fontSize: "1.4rem",
  fontWeight: 700,
};

const navLinkStyle: CSSProperties = {
  display: "block",
  color: "#d1d5db",
  padding: "0.5rem 0",
  textDecoration: "none",
  fontSize: "0.95rem",
};

const contentWrapperStyle: CSSProperties = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  background: "#e5e7eb",
};

const topbarStyle: CSSProperties = {
  background: "#ffffff",
  padding: "1rem 1.5rem",
  borderBottom: "1px solid #e5e7eb",
};

const pageContentStyle: CSSProperties = {
  padding: "1.5rem",
};

export default AdminLayout;
