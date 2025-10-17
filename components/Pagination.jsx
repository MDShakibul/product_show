'use client';
import { FaRegArrowAltCircleLeft , FaRegArrowAltCircleRight} from "react-icons/fa";
export default function Pagination({ page, hasNext, onPageChange }) {
	return (
		<div className="flex items-center gap-2">
			<button
				className="btn btn-secondary"
				disabled={page === 1}
				onClick={() => onPageChange(page - 1)}
			>
				<FaRegArrowAltCircleLeft />
			</button>
			<div className="text-sm text-muted">Page {page}</div>
			<button
				className="btn btn-secondary"
				disabled={!hasNext}
				onClick={() => onPageChange(page + 1)}
			>
				<FaRegArrowAltCircleRight />
			</button>
		</div>
	);
}
