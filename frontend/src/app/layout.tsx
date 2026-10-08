import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Suspense } from "react";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "ThaLú By Andrea Chizabas | Belleza colombiana",
  description:
    "Boutique colombiana de maquillaje, skincare y cuidado capilar para rituales de autocuidado.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "ThaLú By Andrea Chizabas",
    description: "Tu belleza, tu esencia, tu momento.",
    locale: "es_CO",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-CO"
      className={`${inter.variable} ${cormorant.variable} scroll-smooth antialiased`}
    >
      <body>
        <Suspense fallback={null}>
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  );
}
