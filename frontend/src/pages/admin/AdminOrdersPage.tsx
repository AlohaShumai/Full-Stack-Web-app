// src/pages/admin/AdminOrdersPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  fetchAdminOrders,
  type OrderSummary,
} from "../../api/admin";

const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchAdminOrders();
        setOrders(data);
        setError(null);
      } catch (err) {
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const formatCurrency = (value: number | string) =>
    `$${Number(value).toFixed(2)}`;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString();

  return (
    <AdminLayout>
      <h1 style={{ marginBottom: "0.5rem" }}>Orders</h1>
      <p style={{ opacity: 0.7, marginBottom: "1.5rem" }}>
        View and manage customer orders.
      </p>

      <div style={card}>
        {loading && <p>Loading orders…</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && orders.length === 0 && (
          <p>No orders found.</p>
        )}

        {!loading && !error && orders.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>ID</th>
                  <th style={th}>Customer</th>
                  <th style={th}>Total</th>
                  <th style={th}>Status</th>
                  <th style={th}>Created</th>
                  <th style={th}>Items</th>
                  <th style={th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td style={td}>{order.id}</td>
                    <td style={td}>
                      {order.user.name || order.user.email}
                    </td>
                    <td style={td}>{formatCurrency(order.total)}</td>
                    <td style={td}>
                      <span style={statusBadge(order.status)}>
                        {order.status}
                      </span>
                    </td>
                    <td style={td}>{formatDate(order.createdAt)}</td>
                    <td style={td}>{order.items.length}</td>
                    <td style={td}>
                      <button
                        style={btn}
                        onClick={() => navigate(`/admin/orders/${order.id}`)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

// Styles
const card: React.CSSProperties = {
  background: "#fff",
  padding: "1.5rem",
  borderRadius: "0.75rem",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const table: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "0.95rem",
};

const th: React.CSSProperties = {
  textAlign: "left",
  padding: "0.5rem",
  borderBottom: "1px solid #e5e7eb",
};

const td: React.CSSProperties = {
  padding: "0.5rem",
  borderBottom: "1px solid #f3f4f6",
};

const btn: React.CSSProperties = {
  padding: "0.4rem 0.75rem",
  borderRadius: "0.5rem",
  border: "none",
  background: "#111827",
  color: "#fff",
  cursor: "pointer",
  fontSize: "0.85rem",
};

const statusBadge = (status: string): React.CSSProperties => {
  let bg = "#e5e7eb";
  let color = "#111827";

  if (status === "PENDING") {
    bg = "#fef3c7";
    color = "#92400e";
  } else if (status === "PAID") {
    bg = "#d1fae5";
    color = "#065f46";
  } else if (status === "SHIPPED") {
    bg = "#dbeafe";
    color = "#1d4ed8";
  } else if (status === "COMPLETED") {
    bg = "#ecfdf5";
    color = "#065f46";
  } else if (status === "CANCELLED") {
    bg = "#fee2e2";
    color = "#991b1b";
  }

  return {
    display: "inline-block",
    padding: "0.25rem 0.5rem",
    borderRadius: "999px",
    fontSize: "0.75rem",
    background: bg,
    color,
    fontWeight: 600,
  };
};

export default AdminOrdersPage;
