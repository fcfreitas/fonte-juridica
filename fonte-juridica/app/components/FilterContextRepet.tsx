"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface FilterContextProps {
  ramoDireito: string;
  setRamoDireito: (val: string) => void;
  assunto: string;
  setAssunto: (val: string) => void;
  situacaoTema: string;
  setSituacaoTema: (val: string) => void;
  searchText: string;
  setSearchText: (val: string) => void;
  searchTema: string;
  setSearchTema: (val: string) => void;
}

const FilterContextRepet = createContext<FilterContextProps | null>(null);

export function FilterProviderRepet({ children }: { children: ReactNode }) {
  const [ramoDireito, setRamoDireito] = useState("");
  const [assunto, setAssunto] = useState("");
  const [situacaoTema, setSituacaoTema] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchTema, setSearchTema] = useState("");

  return (
    <FilterContextRepet.Provider
      value={{
        ramoDireito,
        setRamoDireito,
        assunto,
        setAssunto,
        situacaoTema,
        setSituacaoTema,
        searchText,
        setSearchText,
        searchTema,
        setSearchTema,
      }}
    >
      {children}
    </FilterContextRepet.Provider>
  );
}

export function useFilter() {
  const ctx = useContext(FilterContextRepet);
  if (!ctx) throw new Error("useFilter must be used within FilterProviderRepet");
  return ctx;
}