"use client";

import { useEffect, useState } from "react";

export function FiltersDynamic({
  onFilterSelect,
}: {
  onFilterSelect: (field: string, value: string) => void;
}) {
  const [values, setValues] = useState<string[]>([]);
  const [assunto, setAssunto] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchValues() {
      try {
        const response = await fetch("/api/filtros");
        const data = await response.json();

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
  }, []);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setAssunto(value);  // Atualiza o estado com o valor selecionado
    onFilterSelect("assunto", value);  // Passa o filtro e o valor para o filtro
  };

  return (
    <div className="mb-4">
      <label className="block text-lg font-semibold mb-2">Filtrar por Assunto:</label>
      <select
        value={assunto}
        onChange={handleSelectChange} // Usa a função handleSelectChange
        className="border p-2 rounded w-full"
        disabled={loading} // Desativa o select enquanto carrega
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
