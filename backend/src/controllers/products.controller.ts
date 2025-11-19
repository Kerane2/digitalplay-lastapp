import { Response } from 'express';
import { validationResult } from 'express-validator';
import { supabaseAdmin } from '../config/supabase';
import { AuthRequest } from '../middleware/auth';

export const getAllProducts = async (req: AuthRequest, res: Response) => {
  try {
    const { category_id, is_featured, search } = req.query;

    let query = supabaseAdmin
      .from('products')
      .select(`
        *,
        categories (
          id,
          name,
          slug
        )
      `);

    if (category_id) {
      query = query.eq('category_id', category_id);
    }

    if (is_featured === 'true') {
      query = query.eq('is_featured', true);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data: products, error } = await query.order('created_at', {
      ascending: false,
    });

    if (error) throw error;

    res.json({ products });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to get products' });
  }
};

export const getProductById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const { data: product, error } = await supabaseAdmin
      .from('products')
      .select(`
        *,
        categories (
          id,
          name,
          slug
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to get product' });
  }
};

export const createProduct = async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const productData = req.body;

    const { data: product, error } = await supabaseAdmin
      .from('products')
      .insert([productData])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const productData = req.body;

    const { data: product, error } = await supabaseAdmin
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin.from('products').delete().eq('id', id);

    if (error) throw error;

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};
