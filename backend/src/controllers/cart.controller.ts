import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

// Get user cart
export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    const { data: cartItems, error } = await supabase
      .from('cart')
      .select(`
        *,
        products (*)
      `)
      .eq('user_id', userId);

    if (error) throw error;

    res.json({ cart: cartItems || [] });
  } catch (error: any) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: error.message });
  }
};

// Add item to cart
export const addToCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { product_id, quantity = 1 } = req.body;

    if (!product_id) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Check if item already exists in cart
    const { data: existing } = await supabase
      .from('cart')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', product_id)
      .single();

    if (existing) {
      // Update quantity
      const { data, error } = await supabase
        .from('cart')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      return res.json({ cartItem: data });
    }

    // Add new item
    const { data, error } = await supabase
      .from('cart')
      .insert([{ user_id: userId, product_id, quantity }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ cartItem: data });
  } catch (error: any) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update cart item quantity
export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be greater than 0' });
    }

    const { data, error } = await supabase
      .from('cart')
      .update({ quantity })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    res.json({ cartItem: data });
  } catch (error: any) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ error: error.message });
  }
};

// Remove item from cart
export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;

    res.json({ message: 'Item removed from cart' });
  } catch (error: any) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: error.message });
  }
};

// Clear cart
export const clearCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;

    res.json({ message: 'Cart cleared' });
  } catch (error: any) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: error.message });
  }
};
