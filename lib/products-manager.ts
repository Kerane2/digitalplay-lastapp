import { mockProducts, mockCategories, Product, Category } from './mock-data';

const PRODUCTS_KEY = 'digitalplay_products';
const CATEGORIES_KEY = 'digitalplay_categories';

// Initialize localStorage with mock data if empty
export function initializeData() {
  if (typeof window === 'undefined') return;
  
  if (!localStorage.getItem(PRODUCTS_KEY)) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(mockProducts));
  }
  if (!localStorage.getItem(CATEGORIES_KEY)) {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(mockCategories));
  }
}

export function getAllProducts(): Product[] {
  if (typeof window === 'undefined') return mockProducts;
  const stored = localStorage.getItem(PRODUCTS_KEY);
  return stored ? JSON.parse(stored) : mockProducts;
}

export const getProducts = getAllProducts;

export function getAllCategories(): Category[] {
  if (typeof window === 'undefined') return mockCategories;
  const stored = localStorage.getItem(CATEGORIES_KEY);
  return stored ? JSON.parse(stored) : mockCategories;
}

export function addProduct(product: Product) {
  const products = getAllProducts();
  products.push(product);
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

export function updateProduct(id: string, updates: Partial<Product>) {
  const products = getAllProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updates };
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }
}

export function deleteProduct(id: string) {
  const products = getAllProducts();
  const filtered = products.filter((p) => p.id !== id);
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(filtered));
}

export function addCategory(category: Category) {
  const categories = getAllCategories();
  categories.push(category);
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
}

export function updateCategory(id: string, updates: Partial<Category>) {
  const categories = getAllCategories();
  const index = categories.findIndex((c) => c.id === id);
  if (index !== -1) {
    categories[index] = { ...categories[index], ...updates };
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  }
}

export function deleteCategory(id: string) {
  const categories = getAllCategories();
  const filtered = categories.filter((c) => c.id !== id);
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(filtered));
}
