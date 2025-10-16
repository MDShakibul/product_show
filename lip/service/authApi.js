import { createApi } from '@reduxjs/toolkit/query/react';
import { authBaseQuery } from './api';

/* export const authApi = createApi({
	reducerPath: 'authApi',
	baseQuery: authBaseQuery,
	endpoints: (build) => ({
		login: build.mutation({
			query: (body) => ({ url: '/auth', method: 'POST', body }),
		}),
	}),
}); */

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: authBaseQuery,
  endpoints: (build) => ({
    login: build.mutation({
      query: (body) => ({ url: '/auth', method: 'POST', body }),
      async onQueryStarted(arg, { queryFulfilled }) {
        console.log('[AUTH START]', arg)
        try {
          const { data } = await queryFulfilled
          console.log('[AUTH OK]', data)
        } catch (err) {
          console.error('[AUTH ERR]', err)
        }
      },
    }),
  }),
})

export const { useLoginMutation } = authApi;
