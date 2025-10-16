'use client';
export default function Spinner({ label }) {
	return (
		<div className="flex items-center gap-3">
			<div className="h-5 w-5 rounded-full border-2 border-foreground border-t-transparent animate-spin" />
			{label && <span className="text-sm text-muted">{label}</span>}
		</div>
	);
}
