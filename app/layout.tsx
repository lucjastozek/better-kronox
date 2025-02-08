import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Lato } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin-ext"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "IxD Schedule",
  description: "Better than kronox :)",
};

export const viewport: Viewport = {
  initialScale: 0.1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${lato.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
