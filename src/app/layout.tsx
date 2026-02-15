import React from "react"
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Saubh.Tech \u2013 Phygital Gig-Work Marketplace | Verified People, Secured Income',
  description: 'Connect with verified individuals and businesses worldwide for secure gig work payments. Phygital Gig-Work Marketplace \u2013 work locally, scale globally.',
  keywords: 'gig work, phygital marketplace, freelance, escrow payment, verified providers, UGC, branding, India gig economy, SaubhOS',
  authors: [{ name: 'Saubh.Tech' }],
  openGraph: {
    title: 'Saubh.Tech \u2013 Phygital Gig-Work Marketplace',
    description: 'Connect with verified individuals and businesses worldwide for secure gig work payments.',
    type: 'website',
    url: 'https://saubh.tech/',
    siteName: 'Saubh.Tech',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Saubh.Tech \u2013 Phygital Gig-Work Marketplace',
    description: 'Connect with verified individuals and businesses worldwide for secure gig work payments.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <meta name="theme-color" content="#6DB33F" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
