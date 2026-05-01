import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tô Me Mexendo - Programa de Saúde e Bem-estar",
  description: "Acesse seu programa de treinos, dietas, desafios e ranking. Transforme seu corpo e sua saúde com o Tô Me Mexendo!",
  openGraph: {
    title: "Tô Me Mexendo",
    description: "Programa de saúde e bem-estar com treinos, dietas e desafios",
    type: "website",
    url: "https://3000-i4zax7f3boch1sbcapmpb-40ab5cb9.us2.manus.computer",
    images: [{
      url: "https://3000-i4zax7f3boch1sbcapmpb-40ab5cb9.us2.manus.computer/og-image.png",
      width: 1200,
      height: 630,
      alt: "Tô Me Mexendo"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Tô Me Mexendo",
    description: "Programa de saúde e bem-estar com treinos, dietas e desafios",
    images: ["https://3000-i4zax7f3boch1sbcapmpb-40ab5cb9.us2.manus.computer/og-image.png"]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
