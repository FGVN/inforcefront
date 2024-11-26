export const fetchProductsAPI = async (page: number, limit: number): Promise<any[]> => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  if (!apiUrl) {
    throw new Error('API URL is not defined');
  }
  if (!apiBaseUrl) {
    throw new Error('API BASE URL is not defined');
  }
  if (!apiUrl) {
    throw new Error('API URL is not defined');
  }

  const response = await fetch(`${apiUrl}/Products?pageNumber=${page}&pageSize=${limit}`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  const products = await response.json();

  // Update each product to include the full image URL
  const updatedProducts = products.map((product: any) => ({
    ...product,
    imageUrl: `${apiBaseUrl}${product.imageUrl}`,  // Dynamically prepend the base API URL to image URL
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

  const response = await fetch(`${apiUrl}/Products/ProductById?Id=${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch product with ID: ${id}`);
  }

  const product = await response.json();

  // Update the image URL with the full path
  return {
    ...product,
    imageUrl: `${apiBaseUrl}${product.imageUrl}`,  // Dynamically prepend the base API URL to image URL
  };
};
