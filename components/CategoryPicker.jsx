'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
	useGetCategoriesQuery,
	useSearchCategoriesQuery,
} from '../lip/service/categoriesApi.js';

export default function CategoryPicker({
	value,
	onChange,
	placeholder = 'Search category…',
}) {
	const [open, setOpen] = useState(false);
	const [term, setTerm] = useState(value?.name || '');
	const [highlight, setHighlight] = useState(0);
	const containerRef = useRef(null);

	// Only fetch when the dropdown is open
	const searchingEnabled = open && term.trim().length >= 1;
	const listingEnabled = open && term.trim().length < 1;

	const { data: suggestions, isFetching: searching } = useSearchCategoriesQuery(
		term,
		{ skip: !searchingEnabled }
	);
	const { data: firstPage } = useGetCategoriesQuery(
		{ offset: 0, limit: 10 },
		{ skip: !listingEnabled }
	);

	const items = useMemo(
		() => (term.trim().length >= 1 ? suggestions || [] : firstPage || []),
		[term, suggestions, firstPage]
	);

	// Close on outside click
	useEffect(() => {
		const onDocClick = (e) => {
			if (!containerRef.current?.contains(e.target)) setOpen(false);
		};
		document.addEventListener('mousedown', onDocClick);
		return () => document.removeEventListener('mousedown', onDocClick);
	}, []);

	const select = (c) => {
		onChange?.(c);
		setTerm(c?.name || '');
		setOpen(false);
	};

	const onKeyDown = (e) => {
		if (!open) return;
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			setHighlight((h) => Math.min(h + 1, (items?.length || 1) - 1));
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			setHighlight((h) => Math.max(h - 1, 0));
		} else if (e.key === 'Enter') {
			e.preventDefault();
			if (items?.[highlight]) select(items[highlight]);
		} else if (e.key === 'Escape') {
			setOpen(false);
		}
	};

	useEffect(() => {
		setHighlight(0);
	}, [term, open]);

	return (
		<div className="relative" ref={containerRef} onKeyDown={onKeyDown}>
			<button
				type="button"
				className="input w-full text-left flex items-center justify-between"
				aria-haspopup="listbox"
				aria-expanded={open}
				onClick={() => setOpen((o) => !o)}
			>
				<span className={term ? '' : 'text-muted'}>{term || placeholder}</span>
				<svg
					aria-hidden="true"
					className="h-4 w-4 ml-2 shrink-0"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z" />
				</svg>
			</button>

			{/* Popover */}
			{open && (
				<div
					role="listbox"
					tabIndex={-1}
					className="absolute z-10 mt-2 w-full rounded-2xl border border-ring/40 shadow-soft bg-white p-2 max-h-64 overflow-auto"
				>
					<div className="p-2">
						<input
							autoFocus
							className="input w-full !bg-white"
							placeholder="Type to search…"
							value={term}
							onChange={(e) => setTerm(e.target.value)}
						/>
					</div>

					{searching && (
						<div className="px-3 py-2 text-sm text-muted">Searching…</div>
					)}

					{items?.length
						? items.map((c, idx) => (
								<button
									key={c.id}
									type="button"
									role="option"
									aria-selected={idx === highlight}
									className={`w-full text-left px-3 py-2 rounded-lg hover:bg-black/5 ${
										idx === highlight ? 'bg-black/5' : ''
									}`}
									onMouseEnter={() => setHighlight(idx)}
									onClick={() => select(c)}
								>
									<div className="font-medium text-black">{c.name}</div>
								</button>
						  ))
						: !searching && (
								<div className="px-3 py-2 text-sm text-muted">No results</div>
						  )}
				</div>
			)}
		</div>
	);
}
