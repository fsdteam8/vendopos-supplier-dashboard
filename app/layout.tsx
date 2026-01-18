import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
// import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import TanstackProvider from '@/lib/provider/TanStack-Provider';
import AuthProvider from '@/lib/provider/auth-provider';



export const metadata: Metadata = {
  title: 'Supplier Dashboard',
  description: 'Supplier Dashboard',
  icons: {
    icon: [
      {
        url: '/logo.svg',
        media: '(prefers-color-scheme: light)',
      },
     
    ],
    apple: '/logo.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <TanstackProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </TanstackProvider>
        {/* <Analytics /> */}
      </body>
    </html>
  )
}
