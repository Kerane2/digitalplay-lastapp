import { Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { AuthRequest } from '../middleware/auth';

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { items, total, customer_info } = req.body;

    // Créer la commande
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert([
        {
          user_id: req.user!.id,
          total,
          status: 'pending',
          customer_name: customer_info.name,
          customer_email: customer_info.email,
          customer_phone: customer_info.phone,
        },
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    // Créer les items de la commande
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // Mettre à jour le stock des produits
    for (const item of items) {
      await supabaseAdmin.rpc('decrement_stock', {
        product_id: item.product_id,
        quantity: item.quantity,
      });
    }

    res.status(201).json({
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

export const getUserOrders = async (req: AuthRequest, res: Response) => {
  try {
    const { data: orders, error } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (*)
        )
      `)
      .eq('user_id', req.user!.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ orders });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (*)
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    // Vérifier que l'utilisateur a le droit de voir cette commande
    if (order.user_id !== req.user!.id && req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to get order' });
  }
};

export const getAllOrders = async (req: AuthRequest, res: Response) => {
  try {
    const { data: orders, error } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        users (email, full_name),
        order_items (
          *,
          products (*)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ orders });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      message: 'Order status updated successfully',
      order,
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};
