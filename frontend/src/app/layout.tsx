import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import QueryProvider from '@/providers/query-provider'
import { Navbar } from '@/components/navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Agri-Pulse',
  description: 'Agricultural Intelligence Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 bg-slate-50/50">{children}</main>
          </div>
        </QueryProvider>
      </body>
    </html>
  )
}
