'use client';
import ConfirmDialog from '@/components/ConfirmDialog';
import Navbar from '@/components/Navbar';
import Pagination from '@/components/Pagination';
import SearchInput from '@/components/SearchInput';
import Spinner from '@/components/Spinner';
import CategoryPicker from '@/components/CategoryPicker.jsx';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { GrView } from 'react-icons/gr';
import { MdDelete } from 'react-icons/md';
import {
  useDeleteProductMutation,
  useGetProductsQuery,
  useSearchProductsQuery,
} from '../../../lip/service/productApi.js'; // ⚠️ if this is a typo, change to '@/lib/services/productsApi'

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const limit = 12;
  const offset = (page - 1) * limit;

  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null); // keep the object for label display

  // When not searching, use list endpoint (supports categoryId server-side)
  const listingEnabled = !search;
  const {
    data: listData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetProductsQuery(
    { offset, limit, categoryId },
    { skip: !listingEnabled }
  );

  // When searching, use search endpoint (no category param), then filter client-side
  const { data: searchData, isFetching: searching } = useSearchProductsQuery(
    search,
    { skip: !search }
  );

  // Combine data sources and apply client-side category filter when searching
  const items = useMemo(() => {
    const base = search ? (searchData || []) : (listData || []);
    if (search && categoryId) {
      return base.filter((p) => p?.category?.id === categoryId);
    }
    return base;
  }, [search, searchData, listData, categoryId]);

  // Delete state
  const [toDelete, setToDelete] = useState(null);
  const [del, { isLoading: deleting }] = useDeleteProductMutation();
  const [deleteError, setDeleteError] = useState(null);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [search, categoryId]);

  // With offset/limit API and no total, we show Prev/Next; Next is disabled when fewer than limit are returned
  const hasNext = useMemo(
    () => items && items.length === limit && !search,
    [items, limit, search]
  );

  const openDelete = (p) => setToDelete({ id: p.id, slug: p.slug, name: p.name });

  const handleDelete = async () => {
    if (!toDelete?.id) return;
    setDeleteError(null);
    try {
      await del(toDelete.id).unwrap();
      setToDelete(null);
      // If needed: if (!search) refetch();
    } catch (err) {
      setDeleteError('Failed to delete. Please try again.');
    }
  };

  const clearCategory = () => {
    setSelectedCategory(null);
    setCategoryId('');
  };

  return (
    <div>
      <Navbar />
      <div className="container py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
          <h1 className="text-xl font-semibold">Products</h1>

          {/* Controls: full width on small screens */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[auto_auto_auto] gap-3">
            {/* Search (already responsive internally) */}
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search by name…"
              loading={searching || (isFetching && !isLoading)}
            />

            {/* CategoryPicker: full width on small, fixed width on larger */}
            <div className="w-full sm:w-full md:w-64">
              <CategoryPicker
                value={selectedCategory}
                onChange={(c) => {
                  setSelectedCategory(c || null);
                  setCategoryId(c?.id || '');
                }}
                placeholder="Filter by category…"
              />
             
            </div>

            {/* Add Product button: full width on small */}
            <Link
              href="/products/new"
              className="btn btn-primary w-full sm:w-full md:w-auto text-sm md:text-base"
            >
              Add Product
            </Link>
          </div>
        </div>

        {isLoading && !search ? (
          <div className="py-20 grid place-items-center">
            <Spinner label="Loading products" />
          </div>
        ) : isError ? (
          <div className="card p-6">
            Failed to load products.{` `}
            <button
              className="btn btn-secondary ml-2 cursor-pointer"
              onClick={() => refetch()}
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {(items?.length ?? 0) === 0 ? (
              <div className="card p-6">No products found.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((p) => (
                  <div key={p.id} className="card p-5 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${p.slug}`}
                          className="font-semibold hover:underline truncate block"
                        >
                          {p.name}
                        </Link>
                        <div className="text-sm text-muted truncate">
                          {p.category?.name}
                        </div>
                      </div>
                      <span className="badge">TK {Number(p.price).toFixed(2)}</span>
                    </div>

                    <div className="relative group rounded-2xl overflow-hidden">
                      <img
                        src={p.images?.[0] ? p.images[0] : `https://placehold.co/600x400`}
                        alt={p.name}
                        className="rounded-xl border-ring/30 aspect-[4/3] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 group-hover:rotate-[0.5deg]"
                      />
                    </div>

                    <div className="flex items-center gap-2 mt-auto">
                      <Link href={`/products/${p.slug}`} className="btn btn-secondary">
                        <GrView />
                      </Link>
                      <Link href={`/products/${p.slug}/edit`} className="btn btn-secondary">
                        <FaEdit />
                      </Link>
                      <button className="btn btn-danger ml-auto" onClick={() => openDelete(p)}>
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!search && (
              <div className="mt-6 flex justify-center">
                <Pagination page={page} hasNext={hasNext} onPageChange={setPage} />
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmDialog
        open={!!toDelete}
        title="Delete product?"
        description={deleteError || 'This action cannot be undone.'}
        confirmLabel={deleting ? 'Deleting…' : 'Delete'}
        onCancel={() => {
          setToDelete(null);
          setDeleteError(null);
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
}
