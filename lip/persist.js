'use client';
import { useEffect } from 'react';
import { useAppDispatch } from './hook';
import { setCredentials } from '../lip/slices/authSlice.js';

export function useHydrateAuthFromStorage() {
	const dispatch = useAppDispatch();
	useEffect(() => {
		try {
			const raw = localStorage.getItem('auth');
			if (raw) {
				const { token, email } = JSON.parse(raw);
				if (token && email) dispatch(setCredentials({ token, email }));
			}
		} catch {}
	}, [dispatch]);
}


/* 'use client'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../lip/slices/authSlice.js'

export default function AuthHydrator() {
  const dispatch = useDispatch()

  useEffect(() => {
    try {
      const raw = localStorage.getItem('auth')
      if (raw) {
        const { token, email } = JSON.parse(raw)
        if (token && email) dispatch(setCredentials({ token, email }))
      }
    } catch {}
  }, [dispatch])

  return null
}
 */
