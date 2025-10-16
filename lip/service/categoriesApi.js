import { api } from './api';

export const categoriesApi = api.injectEndpoints({
	endpoints: (build) => ({
		getCategories: build.query({
			query: ({ offset = 0, limit = 12 }) => ({
				url: '/categories',
				params: { offset, limit },
			}),
			providesTags: (res) => [
				{ type: 'Categories', id: 'LIST' },
				...(res || []).map((c) => ({ type: 'Category', id: c.id })),
			],
		}),

		searchCategories: build.query({
			query: (searchedText) => ({
				url: '/categories/search',
				params: { searchedText },
			}),
			providesTags: (res) => [
				{ type: 'Categories', id: 'LIST' },
				...(res || []).map((c) => ({ type: 'Category', id: c.id })),
			],
		}),
	}),
});

export const { useGetCategoriesQuery, useSearchCategoriesQuery } =
	categoriesApi;
