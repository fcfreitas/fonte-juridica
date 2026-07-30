// "use client"

import React from "react";
import type { Metadata } from "next";
import { Source_Serif_4, Inter } from "next/font/google";
import "./globals.css";
import NavBar from "./components/NavBar";
import HeaderBar from "./components/Header";
import { FilterProvider } from "./components/FilterContext";
import { FilterProviderRepet } from "./components/FilterContextRepet";
import AuthProvider from "./components/SessionProvider";
import Footer from "./components/Footer";

const fontSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-serif",
});

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Jusdex — Jurisprudência do STF, STJ e Corte IDH organizada",
  description: "Jusdex organiza e atualiza automaticamente temas e julgados do STF, STJ e da Corte Interamericana de Direitos Humanos, com filtros inteligentes, controle de leitura e anotações pessoais — para concurseiros, procuradores e advogados.",
  keywords: "jurisprudência stj, jurisprudência stf, temas de repercussão geral stf, repetitivos stj, temas de repercussão geral comentados, repetitivos comentados, concurso público, concurso direito, procuradoria, corte interamericana de direitos humanos"
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${fontSerif.variable} ${fontSans.variable}`}>
      <body className="bg-background text-foreground font-sans overflow-x-hidden">
        <AuthProvider>
            <FilterProvider>  
            <FilterProviderRepet> 
              <div className="fixed top-0 left-0 w-full bg-background z-40 shadow-md flex flex-col">
                <HeaderBar />
                <NavBar />
              </div>
              <div className="pt-40">
                {children}
              </div>
              <Footer />  
            </FilterProviderRepet>
            </FilterProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
