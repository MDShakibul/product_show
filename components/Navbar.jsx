'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaUser } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../lip/hook.js';
import { logout } from '../lip/slices/authSlice.js';
import { useEffect, useState } from 'react';

export default function Navbar() {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const path = usePathname();

	const [email, setEmail] = useState('');

useEffect(() => {
    // Effects don't return values; only do side effects here.
    if (typeof window === "undefined") return; // SSR guard

    const raw = localStorage.getItem("auth");
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      if (parsed?.email) setEmail(String(parsed.email));
    } catch (err) {
      console.error("Invalid auth in localStorage:", err);
    }
  }, []);

	return (
		<header className="bg-[#4e6e5d] text-white sticky top-0 border-ring/30 z-50">
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
							All Products
						</Link>
						<Link
							href="/categories"
							className={path === '/categories' ? 'underline' : ''}
						>
							Categories
						</Link>
						{/* <Link
							href="/products/new"
							className={path?.endsWith('/new') ? 'underline' : ''}
						>
							Create
						</Link> */}
					</nav>
				</div>
				<div className="flex items-center gap-1">
					<FaUser className="hidden sm:inline" />
					<span className="hidden sm:inline text-muted text-sm mr-2">
						{' '}
						{email && email}
					</span>
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
