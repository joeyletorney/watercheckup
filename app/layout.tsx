import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'], display: 'swap', weight: ['400','500','600','700','800','900'] })

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || ''

export const metadata: Metadata = {
  metadataBase: new URL('https://watercheckup.com'),
  title: {
    default: "WaterCheckup -- See What's in Your Tap Water",
    template: '%s | WaterCheckup',
  },
  description: 'Free water quality reports for any US ZIP code. Real EPA contaminant data, NSF-certified filter recommendations, and local installer referrals. Powered by live EPA SDWIS data.',
  keywords: ['water quality', 'tap water', 'EPA water data', 'water filter', 'water contaminants', 'PFAS', 'lead in water', 'water quality report', 'NSF certified filter', 'water safety'],
  authors: [{ name: 'WaterCheckup' }],
  creator: 'WaterCheckup',
  publisher: 'WaterCheckup',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://watercheckup.com',
    siteName: 'WaterCheckup',
    title: "WaterCheckup -- See What's Really in Your Tap Water",
    description: 'Free EPA water quality reports for any US ZIP code. Real contaminant data, expert filter picks, and local installers. Covers all 50 states.',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'WaterCheckup -- Real EPA Water Quality Data',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "WaterCheckup -- See What's in Your Tap Water",
    description: 'Free EPA water quality reports for any US ZIP code. Real contaminant data, expert filter picks.',
    images: ['/api/og'],
    creator: '@watercheckup',
  },
  alternates: {
    canonical: 'https://watercheckup.com',
  },
  verification: {
    google: '',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <meta name="impact-site-verification" content="96edb948-ce64-4f63-83fd-3c1cef2c9453" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </head>
      <body>{children}</body>
    </html>
  )
}
