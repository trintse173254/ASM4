import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import quizReducer from './slices/quizSlice';
import articleReducer from './slices/articleSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    quizzes: quizReducer,
    articles: articleReducer
  }
});

export default store;

