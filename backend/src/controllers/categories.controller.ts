import { Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { AuthRequest } from '../middleware/auth';

export const getAllCategories = async (req: AuthRequest, res: Response) => {
  try {
    const { data: categories, error } = await supabaseAdmin
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;

    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to get categories' });
  }
};

export const getCategoryById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const { data: category, error } = await supabaseAdmin
      .from('categories')
      .select(`
        *,
        products (*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ category });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ error: 'Failed to get category' });
  }
};

export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    const categoryData = req.body;

    const { data: category, error } = await supabaseAdmin
      .from('categories')
      .insert([categoryData])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: 'Category created successfully',
      category,
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
};

export const updateCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const categoryData = req.body;

    const { data: category, error } = await supabaseAdmin
      .from('categories')
      .update(categoryData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      message: 'Category updated successfully',
      category,
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
};
