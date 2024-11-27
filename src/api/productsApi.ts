import axios from 'axios';

export const fetchProductsAPI = async (page: number, limit: number, sortBy?: string): Promise<any[]> => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  if (!apiUrl) {
    throw new Error('API URL is not defined');
  }
  if (!apiBaseUrl) {
    throw new Error('API BASE URL is not defined');
  }

  const response = await fetch(`${apiUrl}/Products?pageNumber=${page}&pageSize=${limit}&sortBy=${sortBy}`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  const products = await response.json();

  // Update each product to include the full image URL
  const updatedProducts = products.map((product: any) => ({
    ...product,
    imageUrl: `${apiBaseUrl}${product.imageUrl}`, // Dynamically prepend the base API URL to image URL
  }));

  return updatedProducts;
};

export const fetchProductByIdAPI = async (id: number): Promise<any> => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  if (!apiUrl) {
    throw new Error('API URL is not defined');
  }
  if (!apiBaseUrl) {
    throw new Error('API BASE URL is not defined');
  }

  const response = await fetch(`${apiUrl}/Products/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch product with ID: ${id}`);
  }

  const product = await response.json();

  // Update the image URL with the full path
  return {
    ...product,
    imageUrl: `${apiBaseUrl}${product.imageUrl}`, // Dynamically prepend the base API URL to image URL
  };
};

export const addProductAPI = async (productData: any) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const formData = new FormData();
  formData.append('Name', productData.name);
  formData.append('Width', productData.size.width);
  formData.append('Height', productData.size.height);
  formData.append('Weight', productData.weight);
  formData.append('Image', productData.image);
  formData.append('Count', productData.count);

  try {
    let requestUrl = `${apiUrl}/Products`; 
    await axios.post(requestUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error) {
    console.error('Error adding product:', error);
  }
};

export const updateProductAPI = async (productId: number, productData: any): Promise<any> => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const formData = new FormData();

  // Append only non-null fields
  if (productData.name) formData.append('Name', productData.name);
  if (productData.size.width) formData.append('Width', productData.size.width);
  if (productData.size.height) formData.append('Height', productData.size.height);
  if (productData.weight) formData.append('Weight', productData.weight);
  if (productData.image) formData.append('Image', productData.image);
  if (productData.count) formData.append('Count', productData.count);

  try {
    let requestUrl = `${apiUrl}/Products/${productId}`;
    const response = await axios.put(requestUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Return the response data
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};


export const deleteProduct = async (productId: number): Promise<void> => {
  const apiUrl = process.env.REACT_APP_API_URL;

  if (!apiUrl) {
    throw new Error('API URL is not defined');
  }

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
