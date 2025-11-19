// src/pages/ProductsPage.tsx
import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

type Product = {
  id: number;
  name: string;
  description?: string | null;
  price: string; // Prisma Decimal as string
  imageUrl?: string | null;
  stock: number;
  category?: {
    id: number;
    name: string;
  } | null;
};

type ProductsResponse = {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

const ProductsPage: React.FC = () => {
  const [data, setData] = useState<ProductsResponse | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const pageSize = 8;
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await api.get('/catalog', {
        params: {
          page,
          pageSize,
          search: search || undefined,
        },
      });
      setData(res.data);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleAddToCart = async (productId: number) => {
    setMessage(null);
    setError(null);

    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await api.post('/cart', {
        productId,
        quantity: 1,
      });
      setMessage('Added to cart!');
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to add to cart');
    }
  };

  const canPrev = data && data.page > 1;
  const canNext = data && data.page < data.totalPages;

  return (
    <div style={{ padding: '1.5rem' }}>
      <h1>Catalog</h1>

      {/* Search */}
      <form onSubmit={handleSearchSubmit} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '0.5rem', minWidth: '250px' }}
        />
        <button type="submit" style={{ marginLeft: '0.5rem' }}>
          Search
        </button>
      </form>

      {message && <p style={{ color: 'green' }}>{message}</p>}
      {isLoading && <p>Loading products...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Product grid */}
      {data && data.items.length > 0 && (
        <>
          <p>
            Showing {data.items.length} of {data.total} products
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '1rem',
              marginTop: '1rem',
            }}
          >
            {data.items.map((product) => (
              <div
                key={product.id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    style={{
                      width: '100%',
                      height: '150px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                    }}
                  />
                )}
                <h3>{product.name}</h3>
                {product.category && (
                  <span style={{ fontSize: '0.85rem', color: '#555' }}>
                    {product.category.name}
                  </span>
                )}
                <p style={{ fontWeight: 'bold' }}>
                  ${Number(product.price).toFixed(2)}
                </p>
                {product.description && (
                  <p style={{ fontSize: '0.9rem', color: '#555' }}>
                    {product.description.length > 80
                      ? product.description.slice(0, 77) + '...'
                      : product.description}
                  </p>
                )}
                <p style={{ fontSize: '0.85rem' }}>
                  Stock: {product.stock > 0 ? product.stock : 'Out of stock'}
                </p>
                <button
                  disabled={product.stock <= 0}
                  onClick={() => handleAddToCart(product.id)}
                >
                  {product.stock > 0 ? 'Add to Cart' : 'Out of stock'}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {data && data.items.length === 0 && !isLoading && !error && (
        <p>No products found.</p>
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div
          style={{
            marginTop: '1rem',
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center',
          }}
        >
          <button onClick={() => setPage((p) => p - 1)} disabled={!canPrev}>
            Previous
          </button>
          <span>
            Page {data.page} of {data.totalPages}
          </span>
          <button onClick={() => setPage((p) => p + 1)} disabled={!canNext}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
