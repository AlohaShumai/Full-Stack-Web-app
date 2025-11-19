import React, { useEffect, useState, FormEvent } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  fetchAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  type Product,
} from "../../api/admin";

const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // CREATE fields
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");

  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // EDIT modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editProductId, setEditProductId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState({
    name: "",
    price: "",
    stock: "",
    categoryId: "",
    description: "",
  });

  // DELETE confirm
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // LOAD all products
  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // CREATE PRODUCT
  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!name.trim() || !price || !stock || !categoryId.trim()) {
      setFormError("Please fill all required fields.");
      return;
    }

    try {
      await createProduct({
        name,
        price: Number(price),
        stock: Number(stock),
        categoryId: Number(categoryId),
        description: description || undefined,
      });

      setFormSuccess("Product created!");
      setName("");
      setPrice("");
      setStock("");
      setCategoryId("");
      setDescription("");

      loadProducts();
    } catch {
      setFormError("Failed to create product.");
    }
  };

  // OPEN EDIT MODAL
  const openEdit = (p: Product) => {
    setEditProductId(p.id);
    setEditValues({
      name: p.name,
      price: String(p.price),
      stock: String(p.stock),
      categoryId: p.categoryId ? String(p.categoryId) : "",
      description: p.description ?? "",
    });
    setEditModalOpen(true);
  };

  // SUBMIT EDIT
  const submitEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editProductId) return;

    await updateProduct(editProductId, {
      name: editValues.name,
      price: Number(editValues.price),
      stock: Number(editValues.stock),
      categoryId: editValues.categoryId
        ? Number(editValues.categoryId)
        : undefined,
      description: editValues.description,
    });

    setEditModalOpen(false);
    loadProducts();
  };

  // DELETE PRODUCT
  const confirmDelete = async () => {
    if (deleteId == null) return;
    await deleteProduct(deleteId);
    setDeleteId(null);
    loadProducts();
  };

  return (
    <AdminLayout>
      <h1 style={{ marginBottom: "1rem" }}>Products</h1>

      {/* CREATE FORM */}
      <div style={card}>
        <h2>Create Product</h2>

        {formError && <p style={{ color: "red" }}>{formError}</p>}
        {formSuccess && <p style={{ color: "green" }}>{formSuccess}</p>}

        <form
          onSubmit={handleCreate}
          style={{ display: "grid", gap: "0.75rem", maxWidth: "500px" }}
        >
          <input
            style={input}
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            style={input}
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <input
            style={input}
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />

          <input
            style={input}
            type="number"
            placeholder="Category ID"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          />

          <textarea
            style={{ ...input, minHeight: "60px" }}
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button style={button}>Create</button>
        </form>
      </div>

      {/* PRODUCT TABLE */}
      <div style={card}>
        <h2>Product List</h2>

        {loading && <p>Loading…</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>ID</th>
              <th style={th}>Name</th>
              <th style={th}>Price</th>
              <th style={th}>Stock</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td style={td}>{p.id}</td>
                <td style={td}>{p.name}</td>
                <td style={td}>${p.price}</td>
                <td style={td}>{p.stock}</td>
                <td style={td}>
                  <button style={smallBtn} onClick={() => openEdit(p)}>
                    Edit
                  </button>
                  <button
                    style={smallDel}
                    onClick={() => setDeleteId(p.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}
      {editModalOpen && (
        <div style={modalBg}>
          <div style={modal}>
            <h2>Edit Product</h2>

            <form
              onSubmit={submitEdit}
              style={{ display: "grid", gap: "0.75rem" }}
            >
              <input
                style={input}
                value={editValues.name}
                onChange={(e) =>
                  setEditValues({ ...editValues, name: e.target.value })
                }
              />

              <input
                style={input}
                type="number"
                value={editValues.price}
                onChange={(e) =>
                  setEditValues({ ...editValues, price: e.target.value })
                }
              />

              <input
                style={input}
                type="number"
                value={editValues.stock}
                onChange={(e) =>
                  setEditValues({ ...editValues, stock: e.target.value })
                }
              />

              <input
                style={input}
                type="number"
                value={editValues.categoryId}
                onChange={(e) =>
                  setEditValues({ ...editValues, categoryId: e.target.value })
                }
              />

              <textarea
                style={{ ...input, minHeight: "60px" }}
                value={editValues.description}
                onChange={(e) =>
                  setEditValues({ ...editValues, description: e.target.value })
                }
              />

              <button style={button}>Save Changes</button>
              <button
                style={smallDel}
                onClick={() => setEditModalOpen(false)}
                type="button"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteId != null && (
        <div style={modalBg}>
          <div style={modal}>
            <h2>Delete Product?</h2>
            <p>This action cannot be undone.</p>

            <button style={smallDel} onClick={confirmDelete}>
              Delete
            </button>
            <button style={button} onClick={() => setDeleteId(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

// ===== Styles =====
const card: React.CSSProperties = {
  background: "#fff",
  padding: "1.5rem",
  borderRadius: "0.75rem",
  marginBottom: "2rem",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const input: React.CSSProperties = {
  padding: "0.5rem",
  borderRadius: "0.5rem",
  border: "1px solid #ccc",
  fontSize: "1rem",
};

const button: React.CSSProperties = {
  padding: "0.6rem 1rem",
  background: "#111827",
  color: "#fff",
  border: "none",
  borderRadius: "0.5rem",
  cursor: "pointer",
  fontWeight: 600,
};

const smallBtn: React.CSSProperties = {
  marginRight: "0.5rem",
  padding: "0.4rem 0.75rem",
  borderRadius: "0.5rem",
  border: "none",
  cursor: "pointer",
};

const smallDel: React.CSSProperties = {
  background: "#b91c1c",
  color: "white",
  padding: "0.4rem 0.75rem",
  border: "none",
  borderRadius: "0.5rem",
  cursor: "pointer",
};

const th: React.CSSProperties = {
  textAlign: "left",
  padding: "0.5rem",
  borderBottom: "1px solid #ddd",
};

const td: React.CSSProperties = {
  padding: "0.5rem",
  borderBottom: "1px solid #eee",
};

const modalBg: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 99,
};

const modal: React.CSSProperties = {
  background: "white",
  padding: "2rem",
  borderRadius: "0.75rem",
  width: "400px",
  boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
};

export default AdminProductsPage;
