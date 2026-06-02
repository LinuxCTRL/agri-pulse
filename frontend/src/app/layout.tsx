import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Agri-Pulse',
  description: 'High-performance agricultural intelligence platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
