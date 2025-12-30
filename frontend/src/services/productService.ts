import { API_BASE_URL, getAuthHeaders } from './config';

export interface Product {
  id: string;
  name: string;
  price: number;
  rating?: number;
  category: string;
  categoryId: string;
  seller: string;
  sellerId?: string;
  emoji?: string;
  image?: string;
  stock?: number;
  description?: string;
  discount?: number;
  createdAt?: string;
}

// Get all products
export const getProducts = async (category?: string): Promise<Product[]> => {
  const url = category && category !== 'all' 
    ? `${API_BASE_URL}/products?category=${category}`
    : `${API_BASE_URL}/products`;
    
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  return response.json();
};

// Get single product
export const getProduct = async (id: string): Promise<Product> => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }

  return response.json();
};

// Get seller's products
export const getSellerProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_BASE_URL}/products/seller`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch seller products');
  }

  return response.json();
};

// Create product (seller only)
export const createProduct = async (data: {
  name: string;
  price: number;
  category: string;
  categoryId: string;
  emoji?: string;
  stock?: number;
  description?: string;
  discount?: number;
}): Promise<{ message: string; product: Product }> => {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create product');
  }

  return response.json();
};

// Update product (seller only)
export const updateProduct = async (
  id: string,
  data: Partial<Product>
): Promise<{ message: string; product: Product }> => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update product');
  }

  return response.json();
};

// Delete product (seller only)
export const deleteProduct = async (id: string): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete product');
  }

  return response.json();
};
