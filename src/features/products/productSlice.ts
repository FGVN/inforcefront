import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchProductsAPI, fetchProductByIdAPI, updateProductAPI, addProductAPI } from '../../api/productsApi';

// Define the types for product and state
interface Product {
  id: number;
  imageUrl: string;
  name: string;
  count: number;
  size: {
    width: number;
    height: number;
  };
  weight: string;
  comments?: string[];
  image?: File;
}

interface ProductsState {
  products: Product[]; // Explicitly type this as an array of Product
  productDetails: Product | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

// Define initialState with types
const initialState: ProductsState = {
  products: [],
  productDetails: null,
  status: 'idle',
};

// Async thunk to fetch products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ page, limit, sortBy }: { page: number; limit: number, sortBy?: string }) => {
    return await fetchProductsAPI(page, limit, sortBy);
  }
);

// Async thunk to fetch a product by id
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


// Async thunk to update a product
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async (product: Product, { rejectWithValue }) => {
    try {
      // Call the API and get the response
      const updatedProduct = await updateProductAPI(product.id, product);
      return updatedProduct;
    } catch (error: unknown) {
      if (error instanceof Error) {
        // If the error is an instance of the Error class, use its message property
        return rejectWithValue(error.message || 'Failed to update product');
      } else {
        // Handle other cases (e.g., non-Error objects)
        return rejectWithValue('Failed to update product');
      }
    }
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
        state.products = action.payload; // This is now strongly typed
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
