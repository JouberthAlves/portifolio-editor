import type { Metadata } from "next";
import { Anton, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const display = Anton({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const body = Geist({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const hud = Geist_Mono({
  variable: "--font-hud",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Caio Vidal — Editor de Vídeo",
  description:
    "Portfólio de Caio Vidal, editor de vídeo e colorista. Filmes de marca, videoclipes, documentários e publicidade.",
  openGraph: {
    title: "Caio Vidal — Editor de Vídeo",
    description: "Cada corte conta uma história.",
    images: ["/video/hero-poster.webp"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${display.variable} ${body.variable} ${hud.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
