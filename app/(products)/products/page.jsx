'use client';
import CategoryPicker from '@/components/CategoryPicker.jsx';
import ConfirmDialog from '@/components/ConfirmDialog';
import Navbar from '@/components/Navbar';
import Pagination from '@/components/Pagination';
import SearchInput from '@/components/SearchInput';
import Spinner from '@/components/Spinner';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
	useDeleteProductMutation,
	useGetProductsQuery,
	useSearchProductsQuery,
} from '../../../lip/service/productApi.js';

export default function ProductsPage() {
	const [page, setPage] = useState(1);
	const limit = 12;
	const offset = (page - 1) * limit;
	const [search, setSearch] = useState('');
	const [categoryId, setCategoryId] = useState('');
	const [value, setValue] = useState('');

	const listingEnabled = !search;
	const {
		data: listData,
		isLoading,
		isFetching,
		isError,
		refetch,
	} = useGetProductsQuery(
		{ offset, limit, categoryId },
		{ skip: !listingEnabled }
	);
	const { data: searchData, isFetching: searching } = useSearchProductsQuery(
		search,
		{ skip: !search }
	);

	const items = search ? searchData || [] : listData || [];

	const [toDelete, setToDelete] = useState(null);
	const [del, { isLoading: deleting }] = useDeleteProductMutation();

	// Reset to page 1 when filters change
	useEffect(() => {
		setPage(1);
	}, [search, categoryId]);

	// With offset/limit API and no total, we show Prev/Next; Next is disabled when fewer than limit are returned
	const hasNext = useMemo(
		() => items && items.length === limit && !search,
		[items, limit, search]
	);

	return (
		<div>
			<Navbar />
			<div className="container py-6">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
					<h1 className="text-xl font-semibold">Products</h1>
					<div className="flex items-center gap-3 w-full sm:w-auto">
						<SearchInput
							value={search}
							onChange={setSearch}
							placeholder="Search by name…"
							loading={searching || (isFetching && !isLoading)}
						/>
						{/* <div className="w-64">
							<CategoryPicker
								value={null}
								onChange={(c) =>
									setValue('categoryId', c?.id || '', { shouldValidate: true })
								}
								placeholder="Search & select a category"
							/>
						</div> */}
						<Link href="/products/new" className="btn btn-primary">
							Add Product
						</Link>
					</div>
				</div>

				{isLoading && !search ? (
					<div className="py-20 grid place-items-center">
						<Spinner label="Loading products" />
					</div>
				) : isError ? (
					<div className="card p-6">
						Failed to load products.{' '}
						<button
							className="btn btn-secondary ml-2"
							onClick={() => refetch()}
						>
							Retry
						</button>
					</div>
				) : (
					<>
						{(items?.length ?? 0) === 0 ? (
							<div className="card p-6">No products found.</div>
						) : (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
								{items.map((p) => (
									<div key={p.id} className="card p-5 flex flex-col gap-3">
										<div className="flex items-start justify-between gap-3">
											<div className="flex-1 min-w-0">
												<Link
													href={`/products/${p.slug}`}
													className="font-semibold hover:underline truncate block"
												>
													{p.name}
												</Link>
												<div className="text-sm text-muted truncate">
													{p.category?.name}
												</div>
											</div>
											<span className="badge">
												${Number(p.price).toFixed(2)}
											</span>
										</div>
										{p.images?.[0] && (
											<img
												src={p.images[0]}
												alt={p.name}
												className="rounded-xl border border-ring/30 aspect-[4/3] object-cover"
											/>
										)}
										<div className="flex items-center gap-2 mt-auto">
											<Link
												href={`/products/${p.slug}`}
												className="btn btn-secondary"
											>
												View
											</Link>
											<Link
												href={`/products/${p.slug}/edit`}
												className="btn btn-secondary"
											>
												Edit
											</Link>
											<button
												className="btn btn-danger ml-auto"
												onClick={() => setToDelete({ id: p.id, slug: p.slug })}
											>
												Delete
											</button>
										</div>
									</div>
								))}
							</div>
						)}

						{!search && (
							<div className="mt-6">
								<Pagination
									page={page}
									hasNext={hasNext}
									onPageChange={setPage}
								/>
							</div>
						)}
					</>
				)}
			</div>

			<ConfirmDialog
				open={!!toDelete}
				title="Delete product?"
				description="This action cannot be undone."
				confirmLabel={deleting ? 'Deleting…' : 'Delete'}
				onCancel={() => setToDelete(null)}
				onConfirm={async () => {
					if (!toDelete) return;
					await del(toDelete.id);
					setToDelete(null);
				}}
			/>
		</div>
	);
}
