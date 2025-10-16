import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl =
	process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.bitechx.com';
const authBaseUrl = process.env.NEXT_PUBLIC_AUTH_BASE_URL || baseUrl;


export const api = createApi({
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({
		baseUrl,
		prepareHeaders: (headers, { getState }) => {
			const token = typeof window !== 'undefined' ? localStorage.getItem('auth') || '' : '';
			if (token) headers.set('Authorization', `Bearer ${JSON.parse(token).token}`);
			headers.set('Content-Type', 'application/json');
			return headers;
		},
	}),
	tagTypes: ['Products', 'Product'],
	endpoints: () => ({}),
});

// Separate baseQuery for auth if needed
export const authBaseQuery = fetchBaseQuery({
	baseUrl: authBaseUrl,
	prepareHeaders: (headers) => {
		headers.set('Content-Type', 'application/json');
		return headers;
	},
});
