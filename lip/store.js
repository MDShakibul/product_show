import { configureStore } from '@reduxjs/toolkit';
import { api } from './service/api';
import { authApi } from './service/authApi';
import auth from './slices/authSlice';

export const store = configureStore({
	reducer: {
		auth,
		[api.reducerPath]: api.reducer,
		[authApi.reducerPath]: authApi.reducer,
	},
	middleware: (getDefault) =>
		getDefault().concat(api.middleware, authApi.middleware),
});

export const selectState = (state) => state;
export const selectAppDispatch = () => store.dispatch;

export const selectRootState = () => store.getState();
export const selectAppDispatchType = typeof store.dispatch;
