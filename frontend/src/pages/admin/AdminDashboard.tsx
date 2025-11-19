// src/pages/admin/AdminDashboard.tsx
import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { fetchDashboardStats, type DashboardStats } from "../../api/admin";

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchDashboardStats();
        setStats(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard stats.");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const totalProducts = stats?.totalProducts ?? 0;
  const totalOrders = stats?.totalOrders ?? 0;
  const totalRevenue = stats?.totalRevenue ?? 0;
  const totalUsers = stats?.totalUsers ?? 0;

  return (
    <AdminLayout>
      <h1 style={{ marginBottom: "0.5rem" }}>Dashboard</h1>
      <p style={{ opacity: 0.7, marginBottom: "1.5rem" }}>
        Overview of store activity.
      </p>

      {loading && (
        <p style={{ marginBottom: "1rem" }}>Loading stats...</p>
      )}

      {error && (
        <p style={{ marginBottom: "1rem", color: "red" }}>{error}</p>
      )}

      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          marginBottom: "2rem",
        }}
      >
        <StatCard title="Products" value={totalProducts} />
        <StatCard title="Orders" value={totalOrders} />
        <StatCard title="Revenue" value={`$${totalRevenue.toFixed(2)}`} />
        <StatCard title="Users" value={totalUsers} />
      </div>

      <div
        style={{
          padding: "1rem",
          background: "#ffffff",
          borderRadius: "0.75rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <p style={{ marginBottom: "0.5rem" }}>
          In the future, you can add charts, revenue over time, and recent orders here.
        </p>
      </div>
    </AdminLayout>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value }) => {
  return (
    <div
      style={{
        background: "#ffffff",
        padding: "1.25rem 1.5rem",
        borderRadius: "0.75rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      <h3 style={{ margin: 0, marginBottom: "0.5rem" }}>{title}</h3>
      <p style={{ margin: 0, fontSize: "1.7rem", fontWeight: 700 }}>{value}</p>
    </div>
  );
};

export default AdminDashboard;
