'use client'
import { Provider } from 'react-redux'
import { store } from '../lip/store.js'
//import { useHydrateAuthFromStorage } from '../lip/persist.js'


export default function Providers({ children }) {
//useHydrateAuthFromStorage()
return <Provider store={store}>{children}</Provider>
}


/* 'use client';
import { Provider } from 'react-redux';
import { store } from '../lip/store.js';
import AuthHydrator from '../lip/persist.js';

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <AuthHydrator />
      {children}
    </Provider>
  )
} */
