import type { Metadata } from 'next'
import { Outfit, Space_Grotesk } from 'next/font/google'
import { AuthProvider } from '@/components/auth-provider'
import './globals.css'

const outfit = Outfit({ subsets: ["latin"], variable: '--font-sans' });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Digital Play - Votre boutique de produits numériques',
  description: 'Achetez des jeux vidéo, cartes cadeaux, recharges mobiles et accessoires gaming en ligne au Gabon',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className={`${outfit.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
