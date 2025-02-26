'use client'

import { useEffect, useState } from "react";

interface FilterDynamicProps {
  onFilterSelect: (field: string, value: string) => void;
  ramoDireito: string; // Recebe o ramoDireito como prop
}

export function FiltersDynamic({ onFilterSelect, ramoDireito }: FilterDynamicProps) {
  const [values, setValues] = useState<string[]>([]);
  const [assunto, setAssunto] = useState(""); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchValues() {
      try {
        const url = new URL("/api/filtros", window.location.href);
        if (ramoDireito) {
          url.searchParams.set("ramoDireito", ramoDireito);
        }

        const response = await fetch(url.toString());
        const data = await response.json();

        console.log("📥 Valores recebidos da API:", data); // 🔹 Log dos dados recebidos

        if (Array.isArray(data.values)) {
          setValues(data.values);
        } else {
          console.error("Formato inválido recebido:", data);
        }
      } catch (error) {
        console.error("Erro ao buscar valores:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchValues();
  }, [ramoDireito]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value.trim(); // 🔹 Remover espaços extras
    console.log("🎯 Assunto selecionado para filtragem:", value);
    setAssunto(value); // Atualiza o estado do assunto
    onFilterSelect("assunto", value); // Passa o valor atualizado para o filtro
    console.log("Variável assunto é:", assunto);
  };

  return (
    <div className="mb-4">
      <label className="block text-lg font-semibold mb-2">Assunto:</label>
      <select
        value={assunto}
        onChange={handleSelectChange}
        className="w-full mb-2 px-4 py-2 bg-slate-100 border border-slate-300 rounded focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
        disabled={loading || values.length === 0}
      >
        {loading ? (
          <option>Carregando...</option>
        ) : (
          <>
            <option value="">Todos</option>
            {values.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </>
        )}
      </select>
    </div>
  );
}
