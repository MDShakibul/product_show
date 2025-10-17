import { api } from './api';

export const categoriesApi = api.injectEndpoints({
	endpoints: (build) => ({

		//Get all categories with pagination
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

		// Search by name via dedicated endpoint;
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
