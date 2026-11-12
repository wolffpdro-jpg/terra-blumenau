import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TERRA / BLUMENAU · Terreno de 10.361 m² na Rua 1º de Janeiro, 2.650",
  description:
    "Terreno de 10.361,46 m² em Blumenau/SC (Bairro Fidélis), esquina com Rua Frieda Beck, a 220 m da Rodovia Federal BR-470. Zoneamento ZI-1 e ZOC, 100% livre de enchente. Atendimento exclusivo: Robert Wolff (CRECI 2758).",
  openGraph: {
    title: "TERRA / BLUMENAU · 10.361,46 m² · Investidores & Incorporadoras",
    description:
      "Terreno estratégico na Rua 1º de Janeiro, nº 2.650 esq. Rua Frieda Beck, Blumenau/SC. Conexão imediata com a BR-470, zoneamento ZI-1 & ZOC, livre de enchente.",
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
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="antialiased selection:bg-[#C59B6D] selection:text-[#11221B]"
        style={{ fontFamily: "var(--font-jakarta), sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
