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

// TODO: Remplacez cette URL par votre API backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Mock data initialization
const initMockData = () => {
  if (typeof window === 'undefined') return;
  
  const mockCategories: Category[] = [
    {
      id: 'cat-1',
      name: 'Abonnements',
      slug: 'abonnements',
      description: 'Abonnements streaming et services en ligne',
      image_url: '/streaming-subscriptions.jpg',
      created_at: new Date().toISOString(),
    },
    {
      id: 'cat-2',
      name: 'Cartes Cadeaux',
      slug: 'cartes-cadeaux',
      description: 'Cartes cadeaux pour plateformes gaming',
      image_url: '/gift-cards-elegant.jpg',
      created_at: new Date().toISOString(),
    },
    {
      id: 'cat-3',
      name: 'Recharges Jeux Mobile',
      slug: 'recharges-jeux-mobile',
      description: 'Recharges pour vos jeux mobiles préférés',
      image_url: '/mobile-game-topups.jpg',
      created_at: new Date().toISOString(),
    },
    {
      id: 'cat-4',
      name: 'Accessoires Gaming',
      slug: 'accessoires-gaming',
      description: 'Accessoires pour améliorer votre expérience gaming',
      image_url: '/placeholder.svg?height=300&width=400',
      created_at: new Date().toISOString(),
    },
  ];

  const mockProducts: Product[] = [
    {
      id: 'prod-1',
      category_id: 'cat-1',
      name: 'Netflix Premium 1 Mois',
      slug: 'netflix-premium-1-mois',
      description: 'Profitez de Netflix Premium pendant 1 mois avec un accès illimité à tout le catalogue en Ultra HD',
      price: 8000,
      stock: 50,
      platform: 'Web',
      region: 'Global',
      type: 'digital',
      image_url: '/streaming-service-interface.png',
      gallery: null,
      is_featured: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'prod-2',
      category_id: 'cat-2',
      name: 'PlayStation Store 10€',
      slug: 'playstation-10',
      description: 'Carte cadeau PlayStation Store de 10€',
      price: 7000,
      stock: 200,
      platform: 'PlayStation',
      region: 'Europe',
      type: 'digital',
      image_url: '/gaming-console-setup.png',
      gallery: null,
      is_featured: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'prod-3',
      category_id: 'cat-3',
      name: 'Free Fire 1080 Diamants',
      slug: 'free-fire-1080',
      description: 'Rechargez votre compte Free Fire avec 1080 diamants',
      price: 15000,
      stock: 500,
      platform: 'Mobile',
      region: 'Global',
      type: 'digital',
      image_url: '/free-fire.jpg',
      gallery: null,
      is_featured: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'prod-4',
      category_id: 'cat-4',
      name: 'Manette PS5 DualSense',
      slug: 'ps5-dualsense',
      description: 'Manette sans fil officielle PlayStation 5',
      price: 45000,
      stock: 20,
      platform: 'PlayStation 5',
      region: 'Global',
      type: 'physical',
      image_url: '/dualsense-controller.png',
      gallery: null,
      is_featured: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  if (!localStorage.getItem('categories')) {
    localStorage.setItem('categories', JSON.stringify(mockCategories));
  }
  if (!localStorage.getItem('products')) {
    localStorage.setItem('products', JSON.stringify(mockProducts));
  }
};

// Products API
export async function getProducts(params?: { category?: string; search?: string; featured?: boolean }): Promise<Product[]> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.featured) queryParams.append('featured', 'true');
    
    const response = await fetch(`${API_BASE_URL}/products?${queryParams}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  } catch (error) {
    // Fallback to localStorage
    initMockData();
    await delay(300);
    const products: Product[] = JSON.parse(localStorage.getItem('products') || '[]');
    
    let filtered = products;
    if (params?.category) {
      filtered = filtered.filter(p => p.category_id === params.category);
    }
    if (params?.search) {
      const search = params.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(search) || 
        p.description?.toLowerCase().includes(search)
      );
    }
    if (params?.featured) {
      filtered = filtered.filter(p => p.is_featured);
    }
    
    return filtered;
  }
}

export async function getProduct(id: string): Promise<Product> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) throw new Error('Product not found');
    return response.json();
  } catch (error) {
    await delay(200);
    const products: Product[] = JSON.parse(localStorage.getItem('products') || '[]');
    const product = products.find(p => p.id === id || p.slug === id);
    if (!product) throw new Error('Product not found');
    return product;
  }
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
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  } catch (error) {
    // Fallback to localStorage
    initMockData();
    await delay(300);
    return JSON.parse(localStorage.getItem('categories') || '[]');
  }
}

export async function getCategory(id: string): Promise<Category> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) throw new Error('Category not found');
    return response.json();
  } catch (error) {
    await delay(200);
    const categories: Category[] = JSON.parse(localStorage.getItem('categories') || '[]');
    const category = categories.find(c => c.id === id || c.slug === id);
    if (!category) throw new Error('Category not found');
    return category;
  }
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
