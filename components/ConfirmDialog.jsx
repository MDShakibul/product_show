'use client';
import { useEffect } from 'react';

export default function ConfirmDialog({
	open,
	title,
	description,
	confirmLabel = 'Confirm',
	cancelLabel = 'Cancel',
	onConfirm,
	onCancel,
}) {
	useEffect(() => {
		const onKey = (e) => {
			if (e.key === 'Escape' && open) onCancel();
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [open, onCancel]);

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
			<div className="card p-6 w-full max-w-md">
				<h2 className="text-lg font-semibold mb-2">{title}</h2>
				{description && (
					<p className="text-sm text-muted mb-6">{description}</p>
				)}
				<div className="flex items-center justify-end gap-3">
					<button className="btn btn-secondary" onClick={onCancel}>
						{cancelLabel}
					</button>
					<button className="btn btn-danger" onClick={onConfirm}>
						{confirmLabel}
					</button>
				</div>
			</div>
		</div>
	);
}
