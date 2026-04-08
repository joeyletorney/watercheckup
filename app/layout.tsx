import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Script from 'next/script'
import { WaterCanvas } from './components/WaterCanvas'

const inter = Inter({ subsets: ['latin'], display: 'swap', weight: ['400','500','600','700','800','900'] })

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-34ZFC3J521'

export const metadata: Metadata = {
  metadataBase: new URL('https://watercheckup.com'),
  title: {
    default: "WaterCheckup — See What's in Your Tap Water",
    template: '%s | WaterCheckup',
  },
  description: 'Free water quality reports for any US ZIP code. Real EPA contaminant data, NSF-certified filter recommendations, and local installer referrals. Powered by live EPA SDWIS data.',
  keywords: ['water quality', 'tap water', 'EPA water data', 'water filter', 'water contaminants', 'PFAS', 'lead in water', 'water quality report', 'NSF certified filter', 'water safety', 'tap water safety', 'drinking water quality', 'water quality by zip code'],
  authors: [{ name: 'J. Letorney', url: 'https://watercheckup.com' }],
  creator: 'J. Letorney',
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
    google: '5fMlEv2aPnPmH01F9bVS3EbJvZvXQym1t1RUr-GHvYE',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://watercheckup.com/#website',
      url: 'https://watercheckup.com',
      name: 'WaterCheckup',
      description: 'Free EPA water quality reports for any US ZIP code.',
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: 'https://watercheckup.com/?zip={search_term_string}' },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      '@id': 'https://watercheckup.com/#organization',
      name: 'WaterCheckup',
      url: 'https://watercheckup.com',
      logo: { '@type': 'ImageObject', url: 'https://watercheckup.com/logo.svg' },
      sameAs: ['https://twitter.com/watercheckup'],
      founder: { '@type': 'Person', name: 'J. Letorney' },
      description: 'Water quality reporting service powered by live EPA data, curated by J. Letorney — 40+ years in water treatment.',
    },
    {
      '@type': 'WebPage',
      '@id': 'https://watercheckup.com/#webpage',
      url: 'https://watercheckup.com',
      name: "WaterCheckup — See What's in Your Tap Water",
      isPartOf: { '@id': 'https://watercheckup.com/#website' },
      about: { '@id': 'https://watercheckup.com/#organization' },
      description: 'Enter your ZIP code to get a free EPA water quality report with contaminant data and NSF-certified filter recommendations.',
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <meta name="impact-site-verification" content="96edb948-ce64-4f63-83fd-3c1cef2c9453" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
      <body className="wc-ocean-bg">
        <WaterCanvas />
        {children}
      </body>
    </html>
  )
}
