export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  platform: string | null;
  region: string | null;
  type: string | null;
  image_url: string | null;
  gallery: any | null;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  total: number;
  status: string;
  payment_method: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  email?: string;
  full_name?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  name?: string;
  image_url?: string;
}

// Helper to simulate async operations
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper for authenticated requests
const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Products API
export async function getProducts(params?: { category?: string; search?: string; featured?: boolean }): Promise<Product[]> {
  const queryParams = new URLSearchParams();
  if (params?.category) queryParams.append('category', params.category);
  if (params?.search) queryParams.append('search', params.search);
  if (params?.featured) queryParams.append('featured', 'true');
  
  const response = await fetch(`${API_BASE_URL}/products?${queryParams}`, {
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) throw new Error('Failed to fetch products');
  const data = await response.json();
  return Array.isArray(data) ? data : (data.products || []);
}

export async function getProduct(id: string): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) throw new Error('Product not found');
  const data = await response.json();
  return data.product || data;
}

export async function createProduct(product: Partial<Product>): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(product),
  });
  
  if (!response.ok) throw new Error('Failed to create product');
  return response.json();
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(product),
  });
  
  if (!response.ok) throw new Error('Failed to update product');
  return response.json();
}

export async function deleteProduct(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) throw new Error('Failed to delete product');
}

// Categories API
export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) throw new Error('Failed to fetch categories');
  const data = await response.json();
  return Array.isArray(data) ? data : (data.categories || []);
}

export async function getCategory(id: string): Promise<Category> {
  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) throw new Error('Category not found');
  const data = await response.json();
  return data.category || data;
}

export async function createCategory(category: Partial<Category>): Promise<Category> {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(category),
  });
  
  if (!response.ok) throw new Error('Failed to create category');
  return response.json();
}

export async function updateCategory(id: string, category: Partial<Category>): Promise<Category> {
  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(category),
  });
  
  if (!response.ok) throw new Error('Failed to update category');
  return response.json();
}

export async function deleteCategory(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) throw new Error('Failed to delete category');
}

// Orders API
export async function getOrders(): Promise<Order[]> {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) throw new Error('Failed to fetch orders');
  return response.json();
}

export async function getOrder(id: string): Promise<Order> {
  const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) throw new Error('Order not found');
  return response.json();
}

export async function createOrder(order: {
  userId: string;
  items: Array<{ productId: string; quantity: number; price: number }>;
  total: number;
  paymentMethod: string;
}): Promise<Order> {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(order),
  });
  
  if (!response.ok) throw new Error('Failed to create order');
  return response.json();
}

export async function updateOrder(id: string, status: string): Promise<Order> {
  const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  
  if (!response.ok) throw new Error('Failed to update order');
  return response.json();
}

export async function deleteOrder(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) throw new Error('Failed to delete order');
}

// Cart API
export async function getCart(): Promise<CartItem[]> {
  const response = await fetch(`${API_BASE_URL}/cart`, {
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) throw new Error('Failed to fetch cart');
  const data = await response.json();
  return Array.isArray(data) ? data : (data.cart || []);
}

export async function addToCart(productId: string, quantity: number = 1): Promise<CartItem> {
  const response = await fetch(`${API_BASE_URL}/cart`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ product_id: productId, quantity }),
  });
  
  if (!response.ok) throw new Error('Failed to add to cart');
  const data = await response.json();
  return data.cartItem || data;
}

export async function updateCartItem(id: string, quantity: number): Promise<CartItem> {
  const response = await fetch(`${API_BASE_URL}/cart/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ quantity }),
  });
  
  if (!response.ok) throw new Error('Failed to update cart item');
  const data = await response.json();
  return data.cartItem || data;
}

export async function removeFromCart(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/cart/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) throw new Error('Failed to remove from cart');
}

export async function clearCart(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/cart`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) throw new Error('Failed to clear cart');
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  products?: Product;
}

export const apiClient = {
  // Products
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  
  // Categories
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  
  // Orders
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  
  // Cart
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
