import type { Metadata } from "next";
import Providers from "./providers";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Location costumes app",
  description: "appliction de gestion de location des costumes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={`${inter.variable}  antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
