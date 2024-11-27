import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Product } from '../../models/product';

// Define the state type
interface ProductsState {
  products: Product[];
  productDetails: Product | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

// Initial state
const initialState: ProductsState = {
  products: [],
  productDetails: null,
  status: 'idle',
};

// API call functions
const fetchProductsAPI = async (page: number, limit: number, sortBy?: string): Promise<Product[]> => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  if (!apiUrl) throw new Error('API URL is not defined');
  if (!apiBaseUrl) throw new Error('API BASE URL is not defined');

  const response = await fetch(`${apiUrl}/Products?pageNumber=${page}&pageSize=${limit}&sortBy=${sortBy}`);
  if (!response.ok) throw new Error('Failed to fetch products');

  const products = await response.json();
  return products.map((product: any) => ({
    ...product,
    imageUrl: `${apiBaseUrl}${product.imageUrl}`,
  }));
};

const fetchProductByIdAPI = async (id: number): Promise<Product> => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  if (!apiUrl) throw new Error('API URL is not defined');
  if (!apiBaseUrl) throw new Error('API BASE URL is not defined');

  const response = await fetch(`${apiUrl}/Products/${id}`);
  if (!response.ok) throw new Error(`Failed to fetch product with ID: ${id}`);

  const product = await response.json();
  return {
    ...product,
    imageUrl: `${apiBaseUrl}${product.imageUrl}`,
  };
};

const addProductAPI = async (productData: Product): Promise<void> => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const formData = new FormData();

  formData.append('Name', productData.name);
  formData.append('Width', productData.size.width.toString());
  formData.append('Height', productData.size.height.toString());
  formData.append('Weight', productData.weight.toString()); // Convert to string if needed
  if (productData.image && productData.image instanceof File) {
    formData.append('Image', productData.image); // Append as a File
  }
  formData.append('Count', productData.count.toString());

  try {
    await axios.post(`${apiUrl}/Products`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};


const updateProductAPI = async (productId: number, productData: Product): Promise<Product> => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const formData = new FormData();

  if (productData.name) formData.append('Name', productData.name);
  if (productData.size.width) formData.append('Width', productData.size.width.toString()); // Convert to string
  if (productData.size.height) formData.append('Height', productData.size.height.toString()); // Convert to string
  if (productData.weight) formData.append('Weight', productData.weight.toString()); // Convert to string
  if (productData.image) formData.append('Image', productData.image);
  if (productData.count) formData.append('Count', productData.count.toString()); // Convert to string

  try {
    const response = await axios.put(`${apiUrl}/Products/${productId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};


const deleteProductAPI = async (productId: number): Promise<void> => {
  const apiUrl = process.env.REACT_APP_API_URL;
  if (!apiUrl) throw new Error('API URL is not defined');

  try {
    const response = await fetch(`${apiUrl}/Products/${productId}`, {
      method: 'DELETE',
      headers: { Accept: '*/*' },
    });

    if (!response.ok) throw new Error('Failed to delete product');
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ page, limit, sortBy }: { page: number; limit: number; sortBy?: string }) => {
    return await fetchProductsAPI(page, limit, sortBy);
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id: number) => {
    return await fetchProductByIdAPI(id);
  }
);

export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (product: Product) => {
    return await addProductAPI(product);
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async (product: Product, { rejectWithValue }) => {
    try {
      const updatedProduct = await updateProductAPI(product.id, product);
      return updatedProduct;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || 'Failed to update product');
      } else {
        return rejectWithValue('Failed to update product');
      }
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (productId: number) => {
    await deleteProductAPI(productId);
  }
);

// Create the slice
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(fetchProductById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.productDetails = action.payload;
      })
      .addCase(fetchProductById.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export default productsSlice.reducer;
