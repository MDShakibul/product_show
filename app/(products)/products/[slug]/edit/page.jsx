'use client';
import Navbar from '@/components/Navbar';
import ProductForm from '@/components/ProductForm';
import Spinner from '@/components/Spinner';
import {
	useGetProductBySlugQuery,
	useUpdateProductMutation,
} from '../../../../../lip/service/productApi.js';
import { useParams, useRouter } from 'next/navigation';

export default function EditProductPage() {
	const { slug } = useParams();
	const { data, isLoading, isError, refetch } = useGetProductBySlugQuery(slug);
	const [updateProduct, { isLoading: saving }] = useUpdateProductMutation();
	const router = useRouter();

	if (isLoading)
		return (
			<div>
				<Navbar />
				<div className="py-20 grid place-items-center">
					<Spinner label="Loading" />
				</div>
			</div>
		);

	if (isError || !data)
		return (
			<div>
				<Navbar />
				<div className="container py-6">
					<div className="card p-6">
						Failed to load.{' '}
						<button
							className="btn btn-secondary ml-2"
							onClick={() => refetch()}
						>
							Retry
						</button>
					</div>
				</div>
			</div>
		);

	return (
		<div>
			<Navbar />
			<div className="container py-6">
				<div className="max-w-2xl mx-auto card p-6">
					<h1 className="text-xl font-semibold mb-4">Edit product</h1>
					<ProductForm
						defaultValues={{
							name: data.name,
							price: data.price,
							categoryId: data.category?.id || '',
							description: data.description || '',
							images: data.images || [],
						}}
						onSubmit={async (values) => {
							await updateProduct({
								id: data.id,
								body: {
									name: values.name,
									description: values.description,
									price: Number(values.price),
									categoryId: values.categoryId,
									images: values.images,
								},
							}).unwrap();
							router.replace(`/products/${slug}`);
						}}
						submitting={saving}
					/>
				</div>
			</div>
		</div>
	);
}
