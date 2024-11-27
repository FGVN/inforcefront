// productSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../models/product';
import { createCommentApi, deleteCommentApi } from '../../api/commentsApi';

interface ProductState {
  productDetails: Product | null;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: ProductState = {
  productDetails: null,
  status: 'idle',
};

// Thunk to create a comment
export const createComment = createAsyncThunk(
  'products/createComment',
  async (payload: { productId: number; description: string }, { rejectWithValue }) => {
    try {
      const data = await createCommentApi(payload.productId, payload.description);
      return data;
    } catch (error) {
      return rejectWithValue('Failed to add new comment');
    }
  }
);

// Thunk to delete a comment
export const deleteComment = createAsyncThunk(
  'products/deleteComment',
  async (commentId: number, { rejectWithValue }) => {
    try {
      const deletedCommentId = await deleteCommentApi(commentId);
      return deletedCommentId;
    } catch (error) {
      return rejectWithValue('Failed to delete comment');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteComment.fulfilled, (state, action: PayloadAction<number>) => {
        if (state.productDetails) {
          state.productDetails.comments = state.productDetails.comments?.filter(
            (comment) => comment.id !== action.payload
          );
        }
      })
      // Add additional cases for loading and failed states if needed
  },
});

export default productSlice.reducer;
