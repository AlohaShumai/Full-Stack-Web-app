// src/api/admin.ts

// ===== Dashboard =====
export interface DashboardStats {
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    totalUsers: number;
  }
  
  // ===== Products =====
  export interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    categoryId?: number | null;
    description?: string;
  }
  
  export interface CreateProductPayload {
    name: string;
    price: number;
    stock: number;
    categoryId?: number;
    description?: string;
  }
  
  // ===== Orders =====
  export type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "COMPLETED" | "CANCELLED";
  
  export interface OrderUser {
    id: number;
    email: string;
    name?: string | null;
  }
  
  export interface OrderItem {
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    unitPrice: number | string;
    product?: {
      id: number;
      name: string;
      price: number | string;
    };
  }
  
  export interface OrderSummary {
    id: number;
    total: number | string;
    status: OrderStatus;
    createdAt: string;
    user: OrderUser;
    items: OrderItem[];
  }
  
  // For now, the detail shape is the same as summary but with product included
  export type OrderDetail = OrderSummary;
  
  const API_BASE_URL = "http://localhost:3000";
  
  async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(
        text || `Request failed with status ${response.status} (${response.statusText})`
      );
    }
    return response.json() as Promise<T>;
  }
  
  // ===== Dashboard =====
  export async function fetchDashboardStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      credentials: "include",
    });
    return handleResponse<DashboardStats>(res);
  }
  
  // ===== Products =====
  export async function fetchAdminProducts(): Promise<Product[]> {
    const res = await fetch(`${API_BASE_URL}/admin/products`, {
      credentials: "include",
    });
    return handleResponse<Product[]>(res);
  }
  
  export async function createProduct(
    payload: CreateProductPayload
  ): Promise<Product> {
    const res = await fetch(`${API_BASE_URL}/admin/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    return handleResponse<Product>(res);
  }
  
  export async function updateProduct(
    id: number,
    payload: Partial<CreateProductPayload>
  ): Promise<Product> {
    const res = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    return handleResponse<Product>(res);
  }
  
  export async function deleteProduct(id: number): Promise<Product> {
    const res = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    return handleResponse<Product>(res);
  }
  
  // ===== Orders =====
  export async function fetchAdminOrders(): Promise<OrderSummary[]> {
    const res = await fetch(`${API_BASE_URL}/admin/orders`, {
      credentials: "include",
    });
    return handleResponse<OrderSummary[]>(res);
  }
  
  export async function fetchAdminOrderById(id: number): Promise<OrderDetail> {
    const res = await fetch(`${API_BASE_URL}/admin/orders/${id}`, {
      credentials: "include",
    });
    return handleResponse<OrderDetail>(res);
  }
  
  export async function updateOrderStatus(
    id: number,
    status: OrderStatus
  ): Promise<OrderDetail> {
    const res = await fetch(`${API_BASE_URL}/admin/orders/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ status }),
    });
    return handleResponse<OrderDetail>(res);
  }
  