'use client';
import { Provider } from 'react-redux';
import { store } from '../lip/store.js';
import ClientGuard from '@/components/Guard.jsx';

export default function Providers({ children }) {
	return <ClientGuard><Provider store={store}>{children}</Provider></ClientGuard>;
}
