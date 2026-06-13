import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'V-Realty | Propiedades Premium',
  description: 'Encuentra tu propiedad ideal. Casas, departamentos y terrenos de lujo en México.',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'V-Realty' },
  openGraph: {
    title: 'V-Realty | Propiedades Premium',
    description: 'Encuentra tu propiedad ideal en México.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
