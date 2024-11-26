import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchProductsAPI, fetchProductByIdAPI } from '../../api/productsApi';

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
  comments: string[];
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
  async ({ page, limit }: { page: number; limit: number }) => {
    return await fetchProductsAPI(page, limit);
  }
);

// Async thunk to fetch a product by id
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id: number) => {
    return await fetchProductByIdAPI(id);
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
