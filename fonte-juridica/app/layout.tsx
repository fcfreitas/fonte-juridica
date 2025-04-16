import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import NavBar from "./components/NavBar";
import HeaderBar from "./components/Header";
import { FilterProvider } from "./components/FilterContext";
// import { AuthProvider } from "../context/AuthContext";
import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AuthProvider from "./components/SessionProvider";
import Footer from "./components/Footer";


export const metadata: Metadata = {
  title: "Fonte Jurídica",
  description: "O applicativo para você ficar por dentro dos temas, julgados, julgamentos do STF, STJ e corte interamericana de direitos humanos. Temas e julgados comentados, organizados e prontos para serem usados",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-gray-700 overflow-x-hidden">
        <AuthProvider>
            <FilterProvider>  
              <div className="fixed top-0 left-0 w-full bg-slate-50 z-40 shadow-md flex flex-col">
                <HeaderBar />
                <NavBar />
              </div>
              <div className="pt-40">
                {children}
              </div>
              <Footer />  
            </FilterProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
