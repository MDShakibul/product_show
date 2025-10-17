'use client';
import Navbar from '@/components/Navbar';
import ProductForm from '@/components/ProductForm';
import { useRouter } from 'next/navigation';
import { useCreateProductMutation } from '../../../../lip/service/productApi.js';
import { FaChevronLeft } from "react-icons/fa6";
import Link from 'next/link.js';
import BackButton from '@/components/BackButton.jsx';

export default function NewProductPage() {
	const [createProduct, { isLoading }] = useCreateProductMutation();
	const router = useRouter();

	return (
		<div>
			<Navbar />
			<div className="container py-6">
				<BackButton />
				<div className="max-w-2xl mx-auto card p-6">
					<h1 className="text-xl font-semibold mb-4">Create product</h1>
					<ProductForm
						onSubmit={async (values) => {
							const payload = {
								name: values.name,
								price: Number(values.price),
								categoryId: values.categoryId,
								description: values.description || null,
								images: values.images,
							};
							const p = await createProduct(payload).unwrap();
							router.replace(`/products/${p.slug}`);
						}}
						submitting={isLoading}
					/>
				</div>
			</div>
		</div>
	);
}
