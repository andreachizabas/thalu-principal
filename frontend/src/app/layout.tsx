import type { Metadata } from "next";
import { Montserrat, Playfair_Display, Sacramento } from "next/font/google";
import { Suspense } from "react";
import { Providers } from "./providers";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const sacramento = Sacramento({
  variable: "--font-sacramento",
  subsets: ["latin"],
  weight: "400",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "ThaLú By Andrea Chizabas | Belleza colombiana",
  description:
    "Tienda colombiana de maquillaje, skincare y cuidado capilar para rituales de autocuidado.",
  icons: {
    icon: "/logo-favicon.png",
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
      suppressHydrationWarning
      className={`${montserrat.variable} ${playfair.variable} ${sacramento.variable} scroll-smooth antialiased`}
    >
      <body>
        <Suspense fallback={null}>
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  );
}
