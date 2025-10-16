'use client';
import { useAppDispatch, useAppSelector } from '../lip/hook.js';
import { logout } from '../lip/slices/authSlice.js';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
	const { email } = useAppSelector((s) => s.auth);
	const dispatch = useAppDispatch();
	const router = useRouter();
	const path = usePathname();

	return (
		<header className="border-b border-ring/30">
			<div className="container h-16 flex items-center justify-between gap-4">
				<div className="flex items-center gap-6">
					<Link href="/products" className="font-semibold tracking-tight">
						🛍️ Products Admin
					</Link>
					<nav className="hidden sm:flex items-center gap-3 text-sm">
						<Link
							href="/products"
							className={path === '/products' ? 'underline' : ''}
						>
							All
						</Link>
						<Link
							href="/products/new"
							className={path?.endsWith('/new') ? 'underline' : ''}
						>
							Create
						</Link>
					</nav>
				</div>
				<div className="flex items-center gap-3">
					<span className="hidden sm:inline text-muted text-sm">{email}</span>
					<button
						className="btn btn-secondary"
						onClick={() => {
							dispatch(logout());
							router.replace('/login');
						}}
					>
						Logout
					</button>
				</div>
			</div>
		</header>
	);
}
