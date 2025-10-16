'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAppSelector } from '../lip/hook.js';

export default function Home() {
	const token = useAppSelector((s) => s.auth.token);
	const router = useRouter();
	useEffect(() => {
		router.replace(token ? '/products' : '/login');
	}, [token, router]);
	return null;
}
