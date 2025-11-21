'use client';

import { getCart as fetchCart, addToCart as addToCartAPI, updateCartItem as updateCartItemAPI, removeFromCart as removeFromCartAPI, clearCart as clearCartAPI, CartItem as APICartItem } from './api-client';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string | null;
  slug: string;
}

// Cart event for real-time updates
const dispatchCartUpdate = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('cart-updated'));
  }
};

export async function getCart(): Promise<CartItem[]> {
  try {
    const cartItems = await fetchCart();
    return cartItems.map(item => ({
      id: item.id,
      name: item.products?.name || 'Unknown Product',
      price: item.products?.price || 0,
      quantity: item.quantity,
      image_url: item.products?.image_url || null,
      slug: item.products?.slug || '',
    }));
  } catch (error) {
    console.error('Error fetching cart:', error);
    return [];
  }
}

export async function addToCart(productId: string, quantity: number = 1): Promise<void> {
  try {
    await addToCartAPI(productId, quantity);
    dispatchCartUpdate();
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
}

export async function removeFromCart(cartItemId: string): Promise<void> {
  try {
    await removeFromCartAPI(cartItemId);
    dispatchCartUpdate();
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
}

export async function updateCartQuantity(cartItemId: string, quantity: number): Promise<void> {
  try {
    if (quantity <= 0) {
      await removeFromCart(cartItemId);
    } else {
      await updateCartItemAPI(cartItemId, quantity);
      dispatchCartUpdate();
    }
  } catch (error) {
    console.error('Error updating cart quantity:', error);
    throw error;
  }
}

export async function clearCart(): Promise<void> {
  try {
    await clearCartAPI();
    dispatchCartUpdate();
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
}

export async function getCartTotal(): Promise<number> {
  const cart = await getCart();
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

export async function getCartCount(): Promise<number> {
  const cart = await getCart();
  return cart.reduce((count, item) => count + item.quantity, 0);
}
