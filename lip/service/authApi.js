import { createApi } from '@reduxjs/toolkit/query/react';
import { authBaseQuery } from './api';

export const authApi = createApi({
	reducerPath: 'authApi',
	baseQuery: authBaseQuery,
	endpoints: (build) => ({
		login: build.mutation({
			query: (body) => ({ url: '/auth', method: 'POST', body }),
		}),
	}),
});



export const { useLoginMutation } = authApi;
