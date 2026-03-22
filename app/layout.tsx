import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'WaterCheckup — Real EPA Water Quality Data',
  description: 'Look up your local water quality using live EPA SDWIS data.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: '#050e17' }}>{children}</body>
    </html>
  )
}
