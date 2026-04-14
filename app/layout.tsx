import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { branding } from "@/lib/config/branding";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap"
});

const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(branding.siteUrl),
  title: `${branding.companyName} | Accès document`,
  description: "Accédez au document après validation de votre email.",
  openGraph: {
    title: `${branding.companyName} | Accès document`,
    description: "Accédez au document après validation de votre email.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${manrope.variable} ${fraunces.variable} bg-ink-50 text-ink-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}
