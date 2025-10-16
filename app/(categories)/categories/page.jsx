'use client';
import SearchInput from '@/components/SearchInput';
import Spinner from '@/components/Spinner';
import {
	useGetCategoriesQuery,
	useSearchCategoriesQuery,
} from '../../../lip/service/categoriesApi.js';
import { useEffect, useMemo, useState } from 'react';
import Navbar from '@/components/Navbar.jsx';
import Pagination from '@/components/Pagination.jsx';

export default function CategoriesPage() {
	const [page, setPage] = useState(1);
	const limit = 12;
	const offset = (page - 1) * limit;
	const [search, setSearch] = useState('');

	const listingEnabled = !search;
	const {
		data: listData,
		isLoading,
		isFetching,
		isError,
		refetch,
	} = useGetCategoriesQuery({ offset, limit }, { skip: !listingEnabled });
	const { data: searchData, isFetching: searching } = useSearchCategoriesQuery(
		search,
		{ skip: !search }
	);

	const items = search ? searchData || [] : listData || [];
	useEffect(() => {
		setPage(1);
	}, [search]);
	const hasNext = useMemo(
		() => items && items.length === limit && !search,
		[items, limit, search]
	);

	return (
		<div>
			<Navbar />
			<div className="container py-6">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
					<h1 className="text-xl font-semibold">Categories</h1>
					<SearchInput
						value={search}
						onChange={setSearch}
						placeholder="Search categories…"
						loading={searching || (isFetching && !isLoading)}
					/>
				</div>

				{isLoading && !search ? (
					<div className="py-20 grid place-items-center">
						<Spinner label="Loading categories" />
					</div>
				) : isError ? (
					<div className="card p-6">
						Failed to load categories.{' '}
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
							<div className="card p-6">No categories found.</div>
						) : (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
								{items.map((c) => (
									<div key={c.id} className="card p-5 flex flex-col gap-3">
										<div className="flex items-start gap-3">
											{c.image && (
												<img
													src={c.image}
													alt={c.name}
													className="h-16 w-16 rounded-xl border border-ring/30 object-cover"
												/>
											)}
											<div className="flex-1 min-w-0">
												<div className="font-semibold truncate">{c.name}</div>
												<div className="text-xs text-muted truncate">
													{c.id}
												</div>
											</div>
										</div>
										{c.description && (
											<p className="text-sm text-muted line-clamp-3">
												{c.description}
											</p>
										)}
										<div className="flex items-center gap-2 mt-auto">
											<button
												className="btn btn-secondary"
												onClick={() => navigator.clipboard?.writeText(c.id)}
											>
												Copy ID
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
		</div>
	);
}
