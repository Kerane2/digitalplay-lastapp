import { mockProducts, mockCategories, Product, Category } from './mock-data';
import { apiClient } from './api-client';

const PRODUCTS_KEY = 'digitalplay_products';
const CATEGORIES_KEY = 'digitalplay_categories';

// Initialize localStorage with mock data if empty
export function initializeData() {
  // Data is now managed by Supabase, no initialization needed
}

// Deprecated: Use apiClient.getProducts() instead
export const getAllProducts = apiClient.getProducts;
export const getProducts = apiClient.getProducts;

// Deprecated: Use apiClient.getCategories() instead
export const getAllCategories = apiClient.getCategories;

// Deprecated: Use apiClient.createProduct() instead
export const addProduct = apiClient.createProduct;

// Deprecated: Use apiClient.updateProduct() instead
export const updateProduct = apiClient.updateProduct;

// Deprecated: Use apiClient.deleteProduct() instead
export const deleteProduct = apiClient.deleteProduct;

// Deprecated: Use apiClient.createCategory() instead
export const addCategory = apiClient.createCategory;

// Deprecated: Use apiClient.updateCategory() instead
export const updateCategory = apiClient.updateCategory;

// Deprecated: Use apiClient.deleteCategory() instead
export const deleteCategory = apiClient.deleteCategory;

export type { Product, Category };
