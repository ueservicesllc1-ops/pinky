import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import ThemeProviderWrapper from "@/components/ThemeProviderWrapper";
import CartNotificationProvider from "@/components/CartNotificationProvider";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: "Pinky Flame - Velas Personalizadas",
  description: "Velas artesanales personalizadas que iluminan y aromatizan tus momentos especiales. Descubre nuestra colección única de velas de alta calidad.",
  keywords: "velas, personalizadas, artesanales, aromáticas, decoración, hogar",
  authors: [{ name: "Pinky Flame" }],
  icons: {
    icon: '/images/favicon.ico',
    shortcut: '/images/favicon.ico',
    apple: '/images/favicon.ico',
  },
  openGraph: {
    title: "Pinky Flame - Velas Personalizadas",
    description: "Velas artesanales personalizadas que iluminan y aromatizan tus momentos especiales.",
    type: "website",
    locale: "es_ES",
    images: [
      {
        url: '/images/logo2.png',
        width: 1200,
        height: 630,
        alt: 'Pinky Flame - Velas Personalizadas',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <body className={inter.className}>
        <ThemeProviderWrapper>
          <CartProvider>
            <main>
              {children}
            </main>
            <Footer />
            <CartNotificationProvider />
          </CartProvider>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}