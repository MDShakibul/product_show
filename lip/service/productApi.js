import { api } from './api';

export const productsApi = api.injectEndpoints({
	endpoints: (build) => ({
		getProducts: build.query({
			query: ({ offset = 0, limit = 12, categoryId }) => ({
				url: '/products',
				params: { offset, limit, ...(categoryId ? { categoryId } : {}) },
			}),
			providesTags: (res) => [
				{ type: 'Products', id: 'LIST' },
				...(res || []).map((p) => ({ type: 'Product', id: p.id })),
			],
		}),

		// Search by name via dedicated endpoint;
		searchProducts: build.query({
			query: (searchedText) => ({
				url: '/products/search',
				params: { searchedText },
			}),
			providesTags: (res) => [
				{ type: 'Products', id: 'LIST' },
				...(res || []).map((p) => ({ type: 'Product', id: p.id })),
			],
		}),

		// Single by slug
		getProductBySlug: build.query({
			query: (slug) => `/products/${slug}`,
			providesTags: (res) => (res ? [{ type: 'Product', id: res.id }] : []),
		}),

		//Create Product
		createProduct: build.mutation({
			query: (body) => ({ url: '/products', method: 'POST', body }),
			invalidatesTags: [{ type: 'Products', id: 'LIST' }],
		}),

		// Update Product
		updateProduct: build.mutation({
			query: ({ id, body }) => ({
				url: `/products/${id}`,
				method: 'PUT',
				body,
			}),
			invalidatesTags: (res, err, { id }) => [
				{ type: 'Products', id: 'LIST' },
				{ type: 'Product', id },
			],
		}),

		// Delete Product 
		deleteProduct: build.mutation({
			query: (id) => ({ url: `/products/${id}`, method: 'DELETE' }),
			invalidatesTags: (res, err, id) => [
				{ type: 'Products', id: 'LIST' },
				{ type: 'Product', id },
			],
		}),
	}),
});

export const {
	useGetProductsQuery,
	useSearchProductsQuery,
	useGetProductBySlugQuery,
	useCreateProductMutation,
	useUpdateProductMutation,
	useDeleteProductMutation,
} = productsApi;
