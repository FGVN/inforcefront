import { getApiUrl, getApiBaseUrl } from './utils/apiconfig';
import { apiClient, apiClientWithFormData, fetchJson } from './utils/httpclient';
import { Product } from '../models/product';

export const fetchProductsAPI = async (page: number, limit: number, sortBy?: string): Promise<Product[]> => {
  const apiUrl = getApiUrl();
  const apiBaseUrl = getApiBaseUrl();
  const response = await fetchJson(`${apiUrl}/Products?pageNumber=${page}&pageSize=${limit}&sortBy=${sortBy}`);

  return response.map((product: Product) => ({
    ...product,
    imageUrl: `${apiBaseUrl}${product.imageUrl}`, // Prepend base URL to the image URL
  }));
};

export const fetchProductByIdAPI = async (id: number): Promise<Product> => {
  const apiUrl = getApiUrl();
  const apiBaseUrl = getApiBaseUrl();
  const product = await fetchJson(`${apiUrl}/Products/${id}`);
  
  return {
    ...product,
    imageUrl: `${apiBaseUrl}${product.imageUrl}`,
  };
};

export const addProductAPI = async (productData: Product): Promise<void> => {
  const apiUrl = getApiUrl();
  const formData = new FormData();
  formData.append('Name', productData.name);
  formData.append('Width', productData.size.width.toString());
  formData.append('Height', productData.size.height.toString());
  formData.append('Weight', productData.weight.toString());
  if (productData.image) formData.append('Image', productData.image);
  formData.append('Count', productData.count.toString());

  try {
    await apiClientWithFormData.post(`${apiUrl}/Products`, formData);
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const updateProductAPI = async (productId: number, productData: Product): Promise<Product> => {
  const apiUrl = getApiUrl();
  const formData = new FormData();

  if (productData.name) formData.append('Name', productData.name);
  if (productData.size.width) formData.append('Width', productData.size.width.toString());
  if (productData.size.height) formData.append('Height', productData.size.height.toString());
  if (productData.weight) formData.append('Weight', productData.weight.toString());
  if (productData.image) formData.append('Image', productData.image);
  if (productData.count) formData.append('Count', productData.count.toString());

  try {
    const response = await apiClientWithFormData.put(`${apiUrl}/Products/${productId}`, formData);
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProductAPI = async (productId: number): Promise<void> => {
  const apiUrl = getApiUrl();

  try {
    const response = await fetch(`${apiUrl}/Products/${productId}`, {
      method: 'DELETE',
      headers: {
        Accept: '*/*',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to delete product');
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};
