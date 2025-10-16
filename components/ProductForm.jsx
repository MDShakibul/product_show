'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import CategoryPicker from './CategoryPicker';

const productSchema = z.object({
	name: z.string().min(1, 'Name is required').max(80, 'Max 80 characters'),
	price: z.coerce.number().gt(0, 'Price must be > 0'),
	categoryId: z.string().min(1, 'Category ID is required'),
	description: z
		.string()
		.max(1000, 'Max 1000 characters')
		.optional()
		.or(z.literal('')),
	images: z
		.array(z.string().url('Must be a valid URL'))
		.min(1, 'At least one image URL is required'),
});

export default function ProductForm({ defaultValues, submitting, onSubmit }) {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
		watch,
	} = useForm({
		resolver: zodResolver(productSchema),
		defaultValues: {
			name: '',
			price: 1,
			categoryId: '',
			description: '',
			images: [],
			...(defaultValues || {}),
		},
	});

	const images = watch('images');

	// Helper to manage images as newline-separated text
	const imagesText = (images || []).join('');

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			<div>
				<label className="label" htmlFor="name">
					Name
				</label>
				<input id="name" className="input" {...register('name')} />
				{errors.name && (
					<p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
				)}
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div>
					<label className="label" htmlFor="price">
						Price
					</label>
					<input
						id="price"
						type="number"
						step="0.01"
						className="input"
						{...register('price', { valueAsNumber: true })}
					/>
					{errors.price && (
						<p className="text-red-400 text-sm mt-1">{errors.price.message}</p>
					)}
				</div>
				<div>
					<label className="label">Category</label>
					<CategoryPicker
						value={null}
						onChange={(c) =>
							setValue('categoryId', c?.id || '', { shouldValidate: true })
						}
						placeholder="Search & select a category"
					/>
					{errors.categoryId && (
						<p className="text-red-400 text-sm mt-1">
							{errors.categoryId.message}
						</p>
					)}
				</div>
			</div>
			<div>
				<label className="label" htmlFor="description">
					Description
				</label>
				<textarea
					id="description"
					rows={5}
					className="input"
					{...register('description')}
				/>
				{errors.description && (
					<p className="text-red-400 text-sm mt-1">
						{errors.description.message}
					</p>
				)}
			</div>
			<div>
				<label className="label" htmlFor="images">
					Image URLs (one per line)
				</label>
				<textarea
					id="images"
					rows={4}
					className="input"
					defaultValue={imagesText}
					onChange={(e) => {
						const arr = e.target.value
							.split(/\r?\n+/) // split on newlines (Windows/Mac/Linux)
							.map((s) => s.trim())
							.filter(Boolean);
						setValue('images', arr, { shouldValidate: true });
					}}
				/>
				{errors.images && (
					<p className="text-red-400 text-sm mt-1">{errors.images.message}</p>
				)}
			</div>
			<div className="flex items-center justify-end gap-3">
				<button type="submit" className="btn btn-primary" disabled={submitting}>
					{submitting ? 'Saving…' : 'Save'}
				</button>
			</div>
		</form>
	);
}
