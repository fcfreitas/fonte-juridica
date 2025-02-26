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
      <label className="block text-lg font-semibold mb-2">Filtrar por Assunto:</label>
      <select
        value={assunto}
        onChange={handleSelectChange}
        className="border p-2 rounded w-full"
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
