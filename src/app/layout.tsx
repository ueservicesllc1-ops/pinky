import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pinky Flame - Velas Personalizadas",
  description: "Velas artesanales personalizadas que iluminan y aromatizan tus momentos especiales. Descubre nuestra colección única de velas de alta calidad.",
  keywords: "velas, personalizadas, artesanales, aromáticas, decoración, hogar",
  authors: [{ name: "Pinky Flame" }],
  openGraph: {
    title: "Pinky Flame - Velas Personalizadas",
    description: "Velas artesanales personalizadas que iluminan y aromatizan tus momentos especiales.",
    type: "website",
    locale: "es_ES",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}