// app/layout.jsx  (no "use client" here)
import './globals.css'
import Providers from './providers'

export const metadata = { title: 'Products Admin', description: 'Next.js + Redux Toolkit CRUD demo' }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body cz-shortcut-listen="true" data-new-gr-c-s-check-loaded="14.1258.0" data-gr-ext-installed="">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
