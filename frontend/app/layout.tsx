import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tagore',
  description: 'A modern writing application',
  generator: 'Tagore.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
