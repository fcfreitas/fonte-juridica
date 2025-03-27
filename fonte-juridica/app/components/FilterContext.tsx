'use client'

import { createContext, useContext, useState, ReactNode } from "react";

interface FilterContextProps {
  // court: string;
  // setCourt: (court: string) => void;
  ramoDireito: string;
  setRamoDireito: (ramoDireito: string) => void;
  assunto: string;
  setAssunto: (assunto: string) => void;
  situacaoRepGeral: string;
  setSituacaoRepGeral: (situacaoRepGeral: string) => void;
  situacaoTema: string;
  setSituacaoTema: (situacaoTema: string) => void;
  searchText: string;
  setSearchText : (searchText: string) => void;
}

const FilterContext = createContext<FilterContextProps | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  // Estados para armazenar os valores dos filtros
  // const [court, setCourt] = useState(""); // Tribunal selecionado
  const [ramoDireito, setRamoDireito] = useState(""); // Ramo do Direito selecionado
  const [assunto, setAssunto] = useState(""); // Assunto selecionado
  const [situacaoRepGeral, setSituacaoRepGeral] = useState(""); // Situação Rep Geral
  const [situacaoTema, setSituacaoTema] = useState(""); // Situação do Tema
  const [searchText, setSearchText] = useState(""); //Campo livre para pesquisa

  return (
    <FilterContext.Provider
      value={{
        // court,
        // setCourt,
        ramoDireito,
        setRamoDireito,
        assunto,
        setAssunto,
        situacaoRepGeral,
        setSituacaoRepGeral,
        situacaoTema,
        setSituacaoTema,
        searchText,
        setSearchText
      }}
    >
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
