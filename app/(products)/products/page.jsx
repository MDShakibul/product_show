'use client';
import ConfirmDialog from '@/components/ConfirmDialog';
import Navbar from '@/components/Navbar';
import Pagination from '@/components/Pagination';
import SearchInput from '@/components/SearchInput';
import Spinner from '@/components/Spinner';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { GrView } from 'react-icons/gr';
import {
	useDeleteProductMutation,
	useGetProductsQuery,
	useSearchProductsQuery,
} from '../../../lip/service/productApi.js'; // ⚠️ if this path is a typo, change to '@/lib/services/productsApi'
export default function ProductsPage() {
	const [page, setPage] = useState(1);
	const limit = 12;
	const offset = (page - 1) * limit;

	const [search, setSearch] = useState('');
	const [categoryId, setCategoryId] = useState('');

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

	// Delete state
	const [toDelete, setToDelete] = useState(null);
	const [del, { isLoading: deleting }] = useDeleteProductMutation();
	const [deleteError, setDeleteError] = useState(null);

	// Reset to page 1 when filters change
	useEffect(() => {
		setPage(1);
	}, [search, categoryId]);

	const hasNext = useMemo(
		() => items && items.length === limit && !search,
		[items, limit, search]
	);

	const openDelete = (p) =>
		setToDelete({ id: p.id, slug: p.slug, name: p.name });

	const handleDelete = async () => {
		if (!toDelete?.id) return;
		setDeleteError(null);
		try {
			const result = await del(toDelete.id).unwrap(); 
			setToDelete(null); 
		} catch (err) {
			setDeleteError('Failed to delete. Please try again.');
		}
	};

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

						<Link href="/products/new" className="btn btn-primary text-sm md:text-base">
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
						Failed to load products.{` `}
						<button
							className="btn btn-secondary ml-2 cursor-pointer "
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


										<div className="relative group rounded-2xl overflow-hidden ">
											<img
												src={
													p.images?.[0]
														? p.images[0]
														: `https://placehold.co/600x400`
												}
												alt={p.name}
												className="rounded-xl border-ring/30 aspect-[4/3] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 group-hover:rotate-[0.5deg] "
											/>
										</div>

										<div className="flex items-center gap-2 mt-auto">
											<Link
												href={`/products/${p.slug}`}
												className="btn btn-secondary"
											>
												<GrView />
											</Link>
											<Link
												href={`/products/${p.slug}/edit`}
												className="btn btn-secondary"
											>
												<FaEdit />
											</Link>
											<button
												className="btn btn-danger ml-auto"
												onClick={() => openDelete(p)}
											>
												<MdDelete />
											</button>
										</div>
									</div>
								))}
							</div>
						)}

						{!search && (
							<div className="mt-6 flex justify-center">
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
				description={deleteError || 'This action cannot be undone.'}
				confirmLabel={deleting ? 'Deleting…' : 'Delete'}
				onCancel={() => {
					setToDelete(null);
					setDeleteError(null);
				}}
				onConfirm={handleDelete}
			/>
		</div>
	);
}
