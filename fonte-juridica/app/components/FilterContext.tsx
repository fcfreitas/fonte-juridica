'use client'

import { createContext, useContext, useState, ReactNode } from "react";

interface FilterContextProps {
  ramoDireito: string;
  setRamoDireito: (category: string) => void;
  assunto: string;
  setAssunto: (category: string) => void;
}

const FilterContext = createContext<FilterContextProps | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [court, setCourt] = useState(""); // Tribunal selecionado
  const [ramoDireito, setRamoDireito] = useState(""); // Ramo do Direito selecionado
  const [assunto, setAssunto] = useState("")

  return (
    <FilterContext.Provider value={{ ramoDireito, setRamoDireito, assunto, setAssunto }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
}