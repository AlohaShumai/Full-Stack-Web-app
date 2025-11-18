// src/App.tsx
import React from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div style={{ padding: '1.5rem' }}>
      <h1>Portfolio E-commerce</h1>
      {user ? (
        <p>Logged in as <strong>{user.email}</strong> ({user.role})</p>
      ) : (
        <p>You are not logged in.</p>
      )}

      <nav style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <Link to="/">Home</Link>
        {!user && <Link to="/login">Login</Link>}
        {!user && <Link to="/register">Register</Link>}
        {user && <Link to="/dashboard">Dashboard</Link>}
      </nav>
    </div>
  );
};

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: '1.5rem' }}>
      <h1>Dashboard</h1>
      <p>Welcome, <strong>{user?.email}</strong>!</p>
      <p>Role: {user?.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
