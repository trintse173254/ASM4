import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchArticles = createAsyncThunk('articles/fetch', async (_, thunkAPI) => {
  try {
    const { data } = await api.get('/articles');
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to load articles');
  }
});

export const createArticle = createAsyncThunk('articles/create', async (payload, thunkAPI) => {
  try {
    const { data } = await api.post('/articles', payload);
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Create article failed');
  }
});

export const updateArticle = createAsyncThunk(
  'articles/update',
  async ({ id, ...payload }, thunkAPI) => {
    try {
      const { data } = await api.put(`/articles/${id}`, payload);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Update article failed');
    }
  }
);

export const deleteArticle = createAsyncThunk('articles/delete', async (id, thunkAPI) => {
  try {
    await api.delete(`/articles/${id}`);
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Delete article failed');
  }
});

const articleSlice = createSlice({
  name: 'articles',
  initialState: {
    list: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createArticle.fulfilled, (state, action) => {
        state.list = [action.payload, ...state.list];
      })
      .addCase(updateArticle.fulfilled, (state, action) => {
        state.list = state.list.map((a) => (a._id === action.payload._id ? action.payload : a));
      })
      .addCase(deleteArticle.fulfilled, (state, action) => {
        state.list = state.list.filter((a) => a._id !== action.payload);
      });
  }
});

export default articleSlice.reducer;

