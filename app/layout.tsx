import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: 'WaterCheckup — Real EPA Water Quality Data',
  description: 'Look up your local water quality using live EPA SDWIS data.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body style={{ margin: 0, padding: 0, background: '#050e17' }}>{children}</body>
    </html>
  )
}
