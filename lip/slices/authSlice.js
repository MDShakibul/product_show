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

/* import { createSlice } from '@reduxjs/toolkit';

const readAuth = () => {
  if (typeof window === 'undefined') return { token: '', email: '' };
  const raw = localStorage.getItem('auth');
  if (!raw) return { token: '', email: '' };
  try {
    const parsed = JSON.parse(raw);
    return {
      token: parsed?.token ?? '',
      email: parsed?.email ?? parsed?.email ?? '',
    };
  } catch {
    return { token: '', email: '' };
  }
};

const initialState = readAuth();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token = '', email = '' } = action.payload || {};
      state.token = token;
      state.email = email;

      // Persist (simple/practical)
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth', JSON.stringify({ token, email }));
      }
    },
    logout: (state) => {
      state.token = '';
      state.email = '';
      if (typeof window !== 'undefined') localStorage.removeItem('auth');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer; */



