// src/App.tsx
import React from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import "./App.css";

// Public pages
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import AdminOrderDetailPage from "./pages/admin/AdminOrderDetailPage";

const App: React.FC = () => {
  return (
    <div className="app-root">
      <Header />

      <main className="app-main">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/orders/:id" element={<AdminOrderDetailPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />

          {/* 404 fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

const Header: React.FC = () => {
  return (
    <header className="app-header">
      <div className="app-header-inner">
        <div className="app-logo">
          <NavLink to="/">MyStore</NavLink>
        </div>

        <nav className="app-nav">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            Home
          </NavLink>
          <NavLink
            to="/catalog"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            Catalog
          </NavLink>
          <NavLink
            to="/cart"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            Cart
          </NavLink>
          <NavLink
            to="/admin"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            Admin
          </NavLink>
          <NavLink
            to="/login"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            Login
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <p>© {new Date().getFullYear()} MyStore. All rights reserved.</p>
    </footer>
  );
};

const NotFoundPage: React.FC = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you’re looking for doesn’t exist.</p>
      <p>
        <NavLink to="/" className="nav-link">
          Go back home
        </NavLink>
      </p>
    </div>
  );
};

export default App;
