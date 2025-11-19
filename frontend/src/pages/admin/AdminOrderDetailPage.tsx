// src/pages/admin/AdminOrderDetailPage.tsx
import React, { useEffect, useState, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  fetchAdminOrderById,
  updateOrderStatus,
  type OrderDetail,
  type OrderStatus,
} from "../../api/admin";

const statuses: OrderStatus[] = [
  "PENDING",
  "PAID",
  "SHIPPED",
  "COMPLETED",
  "CANCELLED",
];

const AdminOrderDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [status, setStatus] = useState<OrderStatus>("PENDING");
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const orderId = id ? Number(id) : NaN;

  useEffect(() => {
    const load = async () => {
      if (!orderId || Number.isNaN(orderId)) {
        setError("Invalid order ID.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await fetchAdminOrderById(orderId);
        setOrder(data);
        setStatus(data.status);
        setError(null);
      } catch (err) {
        setError("Failed to load order.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [orderId]);

  const formatCurrency = (value: number | string) =>
    `$${Number(value).toFixed(2)}`;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString();

  const handleStatusSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!order) return;

    try {
      setSaving(true);
      const updated = await updateOrderStatus(order.id, status);
      setOrder(updated);
      setStatus(updated.status);
      setStatusMessage("Order status updated.");
    } catch (err) {
      setStatusMessage("Failed to update status.");
    } finally {
      setSaving(false);
      setTimeout(() => setStatusMessage(null), 2000);
    }
  };

  return (
    <AdminLayout>
      <button
        onClick={() => navigate("/admin/orders")}
        style={{
          marginBottom: "1rem",
          padding: "0.4rem 0.8rem",
          borderRadius: "0.5rem",
          border: "1px solid #d1d5db",
          background: "#f9fafb",
          cursor: "pointer",
          fontSize: "0.85rem",
        }}
      >
        ← Back to Orders
      </button>

      {loading && <p>Loading order…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {order && !loading && !error && (
        <>
          <h1 style={{ marginBottom: "0.5rem" }}>Order #{order.id}</h1>
          <p style={{ opacity: 0.7, marginBottom: "1.5rem" }}>
            Placed on {formatDate(order.createdAt)}
          </p>

          {/* Summary */}
          <div style={summaryGrid}>
            <div style={summaryCard}>
              <h3>Customer</h3>
              <p>
                {order.user.name && (
                  <>
                    {order.user.name}
                    <br />
                  </>
                )}
                {order.user.email}
              </p>
            </div>

            <div style={summaryCard}>
              <h3>Order Info</h3>
              <p>Status: {order.status}</p>
              <p>Total: {formatCurrency(order.total)}</p>
              <p>Items: {order.items.length}</p>
            </div>

            <div style={summaryCard}>
              <h3>Update Status</h3>
              <form onSubmit={handleStatusSubmit}>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as OrderStatus)}
                  style={{
                    padding: "0.4rem 0.6rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #d1d5db",
                    marginBottom: "0.5rem",
                    width: "100%",
                  }}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    padding: "0.4rem 0.8rem",
                    borderRadius: "0.5rem",
                    border: "none",
                    background: saving ? "#9ca3af" : "#111827",
                    color: "#fff",
                    cursor: saving ? "default" : "pointer",
                    fontSize: "0.85rem",
                  }}
                >
                  {saving ? "Saving..." : "Update Status"}
                </button>
              </form>
              {statusMessage && (
                <p style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}>
                  {statusMessage}
                </p>
              )}
            </div>
          </div>

          {/* Items */}
          <div style={itemsCard}>
            <h2 style={{ marginTop: 0, marginBottom: "1rem" }}>Items</h2>
            <div style={{ overflowX: "auto" }}>
              <table style={table}>
                <thead>
                  <tr>
                    <th style={th}>Product</th>
                    <th style={th}>Quantity</th>
                    <th style={th}>Unit Price</th>
                    <th style={th}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => {
                    const unit = item.unitPrice;
                    const subtotal = Number(unit) * item.quantity;
                    return (
                      <tr key={item.id}>
                        <td style={td}>
                          {item.product?.name || `#${item.productId}`}
                        </td>
                        <td style={td}>{item.quantity}</td>
                        <td style={td}>{formatCurrency(unit)}</td>
                        <td style={td}>{formatCurrency(subtotal)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

// Styles
const summaryGrid: React.CSSProperties = {
  display: "grid",
  gap: "1rem",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  marginBottom: "2rem",
};

const summaryCard: React.CSSProperties = {
  background: "#fff",
  padding: "1rem",
  borderRadius: "0.75rem",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const itemsCard: React.CSSProperties = {
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

export default AdminOrderDetailPage;
