// src/pages/CartPage.tsx
import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

type CartProduct = {
  id: number;
  name: string;
  price: string;
  imageUrl?: string | null;
};

type CartItem = {
  id: number;
  quantity: number;
  product: CartProduct;
};

type CartResponse = {
  items: CartItem[];
  total: number;
};

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchCart = async () => {
    setIsLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await api.get('/cart');
      setCart(res.data);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to load cart');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = async (itemId: number, quantity: number) => {
    setError(null);
    setMessage(null);
    setUpdatingId(itemId);

    try {
      if (quantity <= 0) {
        await api.delete(`/cart/${itemId}`);
      } else {
        await api.patch(`/cart/${itemId}`, { quantity });
      }
      await fetchCart();
      setMessage('Cart updated');
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to update cart');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleClearCart = async () => {
    setError(null);
    setMessage(null);
    try {
      await api.delete('/cart');
      await fetchCart();
      setMessage('Cart cleared');
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to clear cart');
    }
  };

  const handleCheckout = async () => {
    setError(null);
    setMessage(null);

    if (!cart || cart.items.length === 0) {
      setError('Cart is empty');
      return;
    }

    try {
      await api.post('/orders/checkout', {});
      setMessage('Order placed successfully!');
      await fetchCart();
      navigate('/orders');
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to checkout');
    }
  };

  return (
    <div style={{ padding: '1.5rem' }}>
      <h1>Your Cart</h1>

      {isLoading && <p>Loading cart...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}

      {cart && cart.items.length === 0 && !isLoading && (
        <p>Your cart is empty.</p>
      )}

      {cart && cart.items.length > 0 && (
        <>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginBottom: '1rem',
            }}
          >
            <thead>
              <tr>
                <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left' }}>Product</th>
                <th style={{ borderBottom: '1px solid #ddd' }}>Price</th>
                <th style={{ borderBottom: '1px solid #ddd' }}>Quantity</th>
                <th style={{ borderBottom: '1px solid #ddd' }}>Subtotal</th>
                <th style={{ borderBottom: '1px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map((item) => {
                const priceNum = Number(item.product.price);
                const subtotal = priceNum * item.quantity;

                return (
                  <tr key={item.id}>
                    <td style={{ padding: '0.5rem 0' }}>
                      <strong>{item.product.name}</strong>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      ${priceNum.toFixed(2)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="number"
                        min={0}
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.id,
                            Number(e.target.value),
                          )
                        }
                        style={{ width: '60px' }}
                        disabled={updatingId === item.id}
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      ${subtotal.toFixed(2)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => handleQuantityChange(item.id, 0)}
                        disabled={updatingId === item.id}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <p>
            <strong>Total: </strong>${cart.total.toFixed(2)}
          </p>

          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
            <button onClick={handleCheckout}>Checkout</button>
            <button onClick={handleClearCart}>Clear Cart</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
