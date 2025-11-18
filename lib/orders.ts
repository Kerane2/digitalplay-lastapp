export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  items: Array<{
    product_id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  payment_method: string;
  created_at: Date;
  updated_at: Date;
}

const ORDERS_KEY = 'digitalplay_orders';

export function getOrders(): Order[] {
  if (typeof window === 'undefined') return [];
  const orders = localStorage.getItem(ORDERS_KEY);
  if (!orders) return [];
  return JSON.parse(orders).map((o: any) => ({
    ...o,
    created_at: new Date(o.created_at),
    updated_at: new Date(o.updated_at),
  }));
}

export function getOrderById(id: string): Order | null {
  const orders = getOrders();
  return orders.find((o) => o.id === id) || null;
}

export function createOrder(orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Order {
  const orders = getOrders();
  const newOrder: Order = {
    ...orderData,
    id: Math.random().toString(36).substring(2, 11),
    created_at: new Date(),
    updated_at: new Date(),
  };
  orders.push(newOrder);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  return newOrder;
}

export function updateOrder(id: string, updates: Partial<Order>): Order | null {
  const orders = getOrders();
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return null;
  
  orders[index] = {
    ...orders[index],
    ...updates,
    updated_at: new Date(),
  };
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  return orders[index];
}

export function deleteOrder(id: string): boolean {
  const orders = getOrders();
  const filtered = orders.filter((o) => o.id !== id);
  if (filtered.length === orders.length) return false;
  localStorage.setItem(ORDERS_KEY, JSON.stringify(filtered));
  return true;
}
