'use client';
import ConfirmDialog from '@/components/ConfirmDialog';
import Navbar from '@/components/Navbar';
import Spinner from '@/components/Spinner';
import {
	useDeleteProductMutation,
	useGetProductBySlugQuery,
} from '../../../../lip/service/productApi.js';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

export default function ProductDetailsPage() {
	const { slug } = useParams();
	const { data, isLoading, isError, refetch } = useGetProductBySlugQuery(slug);
	const [del, { isLoading: deleting }] = useDeleteProductMutation();
	const [open, setOpen] = useState(false);
	const router = useRouter();
	console.log(slug)

	return (
		<div>
			<Navbar />
			<div className="container py-6">
				{isLoading ? (
					<div className="py-20 grid place-items-center">
						<Spinner label="Loading" />
					</div>
				) : isError || !data ? (
					<div className="card p-6">
						Failed to load.{' '}
						<button
							className="btn btn-secondary ml-2 cursor-pointer"
							onClick={() => refetch()}
						>
							Retry
						</button>
					</div>
				) : (
					<div className="grid gap-6 md:grid-cols-3">
						<div className="card p-6 md:col-span-2">
							<h1 className="text-2xl font-semibold mb-2">{data.name}</h1>
							<div className="text-muted mb-4">{data.category?.name}</div>
							{data.images?.[0] && (
								<img
									src={
													data.images?.[0]
														? data.images[0]
														: `https://placehold.co/600x400`
												}
									alt={data.name}
									className="rounded-xl border-ring/30 mb-4 aspect-[4/3] object-cover"
								/>
							)}
							<p className="leading-7 whitespace-pre-wrap">
								{data.description || 'No description'}
							</p>
						</div>
						<div className="card p-6 flex flex-col gap-3 h-fit">
							<div className="text-sm">Price</div>
							<div className="text-3xl font-semibold">
								${Number(data.price).toFixed(2)}
							</div>
							<div className="flex items-center gap-2 mt-2">
								<Link
									href={`/products/${data.slug}/edit`}
									className="btn btn-secondary"
								>
									<FaEdit className='mr-1'/> Edit
								</Link>
								<button
									className="btn btn-danger ml-auto"
									onClick={() => setOpen(true)}
								>
									<MdDelete className='mr-1'/> Delete
								</button>
							</div>
						</div>
					</div>
				)}
			</div>

			<ConfirmDialog
				open={open}
				title="Delete product?"
				description="This action cannot be undone."
				confirmLabel={deleting ? 'Deleting…' : 'Delete'}
				onCancel={() => setOpen(false)}
				onConfirm={async () => {
					await del(data.id);
					router.replace('/products');
				}}
			/>
		</div>
	);
}
