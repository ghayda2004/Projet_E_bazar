import { API_BASE_URL, getAuthHeaders } from './config';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  sellerId?: string;
}

export interface Order {
  id: string;
  userId: string;
  sellerId?: string;
  sellerName?: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt?: string;
}

// Create order
export const createOrder = async (items: OrderItem[]): Promise<{ message: string; order: Order }> => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ items }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create order');
  }

  return response.json();
};

// Get user's orders
export const getUserOrders = async (): Promise<Order[]> => {
  const response = await fetch(`${API_BASE_URL}/orders/user`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }

  return response.json();
};

// Get seller's orders
export const getSellerOrders = async (): Promise<Order[]> => {
  const response = await fetch(`${API_BASE_URL}/orders/seller`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch seller orders');
  }

  return response.json();
};

// Update order status (seller only)
export const updateOrderStatus = async (
  id: string,
  status: Order['status']
): Promise<{ message: string; order: Order }> => {
  const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update order status');
  }

  return response.json();
};
