import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], display: 'swap', weight: ['400','500','600','700','800','900'] })

export const metadata: Metadata = {
  title: 'WaterCheckup — Real EPA Water Quality Data',
  description: 'See what\'s in your tap water. Get expert-recommended water filters for drinking, whole house & shower. Powered by live EPA data.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
