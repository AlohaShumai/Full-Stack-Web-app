// src/pages/OrdersPage.tsx
import React, { useEffect, useState } from 'react';
import api from '../api';

type OrderItem = {
  id: number;
  quantity: number;
  unitPrice: string;
  product: {
    id: number;
    name: string;
  };
};

type Order = {
  id: number;
  total: string;
  status: string;
  createdAt: string;
  items: OrderItem[];
};

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div style={{ padding: '1.5rem' }}>
      <h1>Your Orders</h1>

      {isLoading && <p>Loading orders...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!isLoading && orders.length === 0 && !error && (
        <p>You have no orders yet.</p>
      )}

      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem',
          }}
        >
          <p>
            <strong>Order #{order.id}</strong>
          </p>
          <p>
            Placed:{' '}
            {new Date(order.createdAt).toLocaleString(undefined, {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </p>
          <p>Status: {order.status}</p>
          <p>
            Total: <strong>${Number(order.total).toFixed(2)}</strong>
          </p>

          <ul style={{ marginTop: '0.5rem' }}>
            {order.items.map((item) => (
              <li key={item.id}>
                {item.quantity} × {item.product.name} @ $
                {Number(item.unitPrice).toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default OrdersPage;
