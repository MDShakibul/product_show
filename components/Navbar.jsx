'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaUser, FaBars, FaTimes, FaBox, FaThList } from 'react-icons/fa';
import { useAppDispatch } from '../lip/hook.js';
import { logout } from '../lip/slices/authSlice.js';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const path = usePathname();

  const [email, setEmail] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem('auth');
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.email) setEmail(String(parsed.email));
    } catch (err) {
      console.error('Invalid auth in localStorage:', err);
    }
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/login');
  };

  return (
    <header className="bg-[#4e6e5d] text-white sticky top-0 border-ring/30 z-50">
      <div className="container h-16 flex items-center justify-between px-4">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          {/* Mobile: Hamburger */}
          <button
            className="sm:hidden text-2xl"
            onClick={() => setDrawerOpen(true)}
          >
            <FaBars />
          </button>

          <Link href="/products" className="font-semibold tracking-tight">
            🛍️ Products Admin
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden sm:flex items-center gap-3 text-sm ml-4">
            <Link
              href="/products"
              className={`flex items-center gap-1 ${
                path === '/products' ? 'underline' : ''
              }`}
            >
              <FaBox /> All Products
            </Link>
            <Link
              href="/categories"
              className={`flex items-center gap-1 ${
                path === '/categories' ? 'underline' : ''
              }`}
            >
              <FaThList /> Categories
            </Link>
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1">
          <FaUser className="hidden sm:inline" />
          <span className="hidden sm:inline text-muted text-sm mr-2">
            {email}
          </span>
          <button
            className="btn btn-secondary"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity ${
          drawerOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setDrawerOpen(false)}
      />
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-[#4e6e5d] text-white z-50 transform transition-transform duration-300 ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <h2 className="font-semibold text-lg">Menu</h2>
          <button onClick={() => setDrawerOpen(false)} className="text-2xl">
            <FaTimes />
          </button>
        </div>
        <nav className="flex flex-col gap-2 p-4 text-base">
          <Link
            href="/products"
            onClick={() => setDrawerOpen(false)}
            className={`flex items-center gap-2 p-2 rounded hover:bg-white/10 ${
              path === '/products' ? 'bg-white/10' : ''
            }`}
          >
            <FaBox /> All Products
          </Link>
          <Link
            href="/categories"
            onClick={() => setDrawerOpen(false)}
            className={`flex items-center gap-2 p-2 rounded hover:bg-white/10 ${
              path === '/categories' ? 'bg-white/10' : ''
            }`}
          >
            <FaThList /> Categories
          </Link>
          <div className="mt-4 border-t border-white/20 pt-3">
            <button
              onClick={() => {
                handleLogout();
                setDrawerOpen(false);
              }}
              className="flex items-center gap-2 p-2 rounded hover:bg-red-500/30 w-full"
            >
              <FaUser /> Logout
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
