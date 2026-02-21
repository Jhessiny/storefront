import type { Metadata } from 'next'
import {
  Playfair_Display,
  Crimson_Pro,
  Jost,
  Geist_Mono
} from 'next/font/google'
import './globals.css'
import { AppProvider } from '@/main/providers'
import { Header } from '@/presentation/components/layout/header'
import { Footer } from '@/presentation/components/layout/footer'

const crimsonPro = Crimson_Pro({
  variable: '--font-crimson',
  subsets: ['latin'],
  display: 'swap'
})

const playfairDisplay = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap'
})

const jost = Jost({
  variable: '--font-jost',
  subsets: ['latin'],
  display: 'swap'
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Storefront',
  description: 'A modern e-commerce storefront built with Next.js'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${crimsonPro.variable} ${playfairDisplay.variable} ${jost.variable} ${geistMono.variable} antialiased`}
      >
        <AppProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </AppProvider>
      </body>
    </html>
  )
}
