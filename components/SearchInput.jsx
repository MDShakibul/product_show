'use client';
import { useEffect, useState } from 'react';

export default function SearchInput({ value, onChange, placeholder, loading }) {
	const [term, setTerm] = useState(value);
	useEffect(() => setTerm(value), [value]);
	useEffect(() => {
		const t = setTimeout(() => onChange(term), 300);
		return () => clearTimeout(t);
	}, [term, onChange]);

	return (
		<div className="relative w-full sm:w-80">
			<input
				className="input pr-9"
				placeholder={placeholder}
				value={term}
				onChange={(e) => setTerm(e.target.value)}
			/>
			{loading && (
				<div className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full border-2 border-foreground border-t-transparent animate-spin" />
			)}
		</div>
	);
}
