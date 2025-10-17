// components/ClientGuard.jsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ClientGuard({ children }) {
  const router = useRouter();

  useEffect(() => {
    try {
      const raw = localStorage.getItem('auth');
      const token = raw ? JSON.parse(raw)?.token : null;

      if (!token) {
        const redirect = encodeURIComponent(
          window.location.pathname + window.location.search
        );
        router.replace(`/login?redirect=${redirect}`);
      }
    } catch {
      router.replace('/login');
    }
  }, [router]);

  return <>{children}</>;
}
