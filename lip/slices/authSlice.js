import { createSlice } from '@reduxjs/toolkit';

const initialState = { token: null, email: null };



const slice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setCredentials: (state, action) => {
			state.token = action.payload.token;
			state.email = action.payload.email;
		},
		logout: (state) => {
			state.token = null;
			state.email = null;
			if (typeof window !== 'undefined') localStorage.removeItem('auth');
		},
	},
});

export const { setCredentials, logout } = slice.actions;
export default slice.reducer;


