import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchQuizzes = createAsyncThunk('quizzes/fetchAll', async (_, thunkAPI) => {
  try {
    const { data } = await api.get('/quizzes');
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to load quizzes');
  }
});

export const fetchQuizById = createAsyncThunk('quizzes/fetchById', async (id, thunkAPI) => {
  try {
    const { data } = await api.get(`/quizzes/${id}`);
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to load quiz');
  }
});

export const createQuiz = createAsyncThunk('quizzes/create', async (payload, thunkAPI) => {
  try {
    const { data } = await api.post('/quizzes', payload);
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Create quiz failed');
  }
});

export const updateQuiz = createAsyncThunk(
  'quizzes/update',
  async ({ id, ...payload }, thunkAPI) => {
    try {
      const { data } = await api.put(`/quizzes/${id}`, payload);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Update quiz failed');
    }
  }
);

export const deleteQuiz = createAsyncThunk('quizzes/delete', async (id, thunkAPI) => {
  try {
    await api.delete(`/quizzes/${id}`);
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Delete quiz failed');
  }
});

export const createQuestion = createAsyncThunk(
  'quizzes/createQuestion',
  async ({ quizId, ...payload }, thunkAPI) => {
    try {
      const { data } = await api.post(`/questions/${quizId}`, payload);
      return { quizId, question: data };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Create question failed');
    }
  }
);

export const updateQuestion = createAsyncThunk(
  'quizzes/updateQuestion',
  async ({ id, ...payload }, thunkAPI) => {
    try {
      const { data } = await api.put(`/questions/${id}`, payload);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Update question failed');
    }
  }
);

export const deleteQuestion = createAsyncThunk('quizzes/deleteQuestion', async (id, thunkAPI) => {
  try {
    await api.delete(`/questions/${id}`);
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Delete question failed');
  }
});

const quizSlice = createSlice({
  name: 'quizzes',
  initialState: {
    list: [],
    current: null,
    status: 'idle',
    error: null
  },
  reducers: {
    clearCurrent(state) {
      state.current = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchQuizById.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(createQuiz.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateQuiz.fulfilled, (state, action) => {
        state.list = state.list.map((q) => (q._id === action.payload._id ? action.payload : q));
      })
      .addCase(deleteQuiz.fulfilled, (state, action) => {
        state.list = state.list.filter((q) => q._id !== action.payload);
      })
      .addCase(createQuestion.fulfilled, (state, action) => {
        if (state.current && state.current._id === action.payload.quizId) {
          state.current.questions = [...state.current.questions, action.payload.question];
        }
      })
      .addCase(updateQuestion.fulfilled, (state, action) => {
        if (state.current) {
          state.current.questions = state.current.questions.map((q) =>
            q._id === action.payload._id ? action.payload : q
          );
        }
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        if (state.current) {
          state.current.questions = state.current.questions.filter((q) => q._id !== action.payload);
        }
      });
  }
});

export const { clearCurrent } = quizSlice.actions;
export default quizSlice.reducer;

