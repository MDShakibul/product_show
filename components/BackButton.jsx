import Link from 'next/link';
import { FaChevronLeft } from 'react-icons/fa';

const BackButton = () => {
	return (
		<Link
			href="/products"
			className="btn btn-primary hover:bg-[#4e6e5d]/30 gap-1 mb-4"
		>
			<FaChevronLeft /> Back
		</Link>
	);
};

export default BackButton;
