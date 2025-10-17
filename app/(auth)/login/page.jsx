'use client';
import Providers from '../../providers';
import { useAppDispatch } from '../../../lip/hook.js';
import { useLoginMutation } from '../../../lip/service/authApi.js';
import { setCredentials } from '../../../lip/slices/authSlice.js';
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({ email: z.string().email('Enter a valid email') });

export default function LoginPage() {
	const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })
	const [login, { isLoading, error }] = useLoginMutation();
	const dispatch = useAppDispatch();
	const router = useRouter();

	const onSubmit = async (data) => {
		try {
			console.log(data.email)
			const res = await login({ email: data.email }).unwrap();
			dispatch(setCredentials({ token: res.token, email: data.email }));
			localStorage.setItem(
				'auth',
				JSON.stringify({ token: res.token, email: data.email })
			);
			router.replace('/products');
		} catch (e) {
			console.log('login error', e);

		}
	};
	

	return (
		<Providers>
			<div className="min-h-screen grid place-items-center">
				<div className="container">
					<div className="max-w-md mx-auto card p-8">
						<h1 className="text-2xl font-semibold mb-6 text-center ">Welcome Back</h1>
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
							<div>
								<label className="label" htmlFor="email">
									Email
								</label>
								<input
									id="email"
									type="email"
									className="input"
									placeholder="you@example.com"
									{...register('email')}
								/>
								{errors.email && (
									<p className="text-red-400 text-sm mt-1">
										{errors.email.message}
									</p>
								)}
							</div>
							{error && (
								<p className="text-red-400 text-sm">
									Login failed. Check email and try again.
								</p>
							)}
							<button className="btn btn-primary w-full" disabled={isLoading}>
								{isLoading ? 'Signing in…' : 'Sign in'}
							</button>
						</form>
					</div>
				</div>
			</div>
		</Providers>
	);
}
