import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  JetBrains_Mono,
  Plus_Jakarta_Sans,
} from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TERRA / BLUMENAU · Gleba de 10.361 m² na Rua 1º de Janeiro, 2.650",
  description:
    "Ativo territorial de 10.361,46 m² em Blumenau/SC (Bairro Fidélis), esquina com Rua Frieda Beck, a 220 m da Rodovia Federal BR-470. Zoneamento ZI-1 e ZOC, cotas 30m a 60m (livre de enchente). Comercialização exclusiva: Robert Wolff (CRECI 2758).",
  openGraph: {
    title: "TERRA / BLUMENAU · 10.361,46 m² · Investidores & Incorporadoras",
    description:
      "Gleba estratégica na Rua 1º de Janeiro, nº 2.650 esq. Rua Frieda Beck, Blumenau/SC. Conexão imediata com a BR-470, zoneamento ZI-1 & ZOC, livre de enchente.",
    images: ["/media/vista-aerea-br470.jpg"],
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${cormorant.variable} ${jakarta.variable} ${jetbrains.variable}`}
    >
      <body
        className="antialiased selection:bg-[#C59B6D] selection:text-[#11221B]"
        style={{ fontFamily: "var(--font-sans), sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
