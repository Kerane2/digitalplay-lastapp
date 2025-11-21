import { apiClient, Order as APIOrder } from './api-client';

export interface Order extends APIOrder {}

const ORDERS_KEY = 'digitalplay_orders';

export async function getOrders(): Promise<Order[]> {
  return apiClient.getOrders();
}

export async function getOrderById(id: string): Promise<Order | null> {
  try {
    return await apiClient.getOrder(id);
  } catch (error) {
    return null;
  }
}

export async function createOrder(orderData: {
  userId: string;
  items: Array<{ productId: string; quantity: number; price: number }>;
  total: number;
  paymentMethod: string;
}): Promise<Order> {
  return apiClient.createOrder(orderData);
}

export async function updateOrder(id: string, updates: { status?: string }): Promise<Order | null> {
  try {
    if (updates.status) {
      return await apiClient.updateOrder(id, updates.status);
    }
    return null;
  } catch (error) {
    return null;
  }
}

export async function deleteOrder(id: string): Promise<boolean> {
  try {
    await apiClient.deleteOrder(id);
    return true;
  } catch (error) {
    return false;
  }
}
