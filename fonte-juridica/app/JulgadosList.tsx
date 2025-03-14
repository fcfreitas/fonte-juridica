"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useFilter } from "./components/FilterContext";
import { Julgado } from "./julgados-data";

const formatDate = (date: string | null | undefined): string => {
  if (!date) {
    return "";
  }
  return date.substring(0, 10); // Pega apenas a parte da data (YYYY-MM-DD)
};

export default function JulgadosList() {
  const { ramoDireito, assunto, situacaoRepGeral, situacaoTema } = useFilter();
  const [julgados, setJulgados] = useState<Julgado[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchJulgados() {
      let url = process.env.NEXT_PUBLIC_SITE_URL + "/api/julgados"; // Ajuste para o endpoint correto
      const params = new URLSearchParams();

      console.log("🎯 Filtros do Context API:", { ramoDireito, assunto, situacaoRepGeral, situacaoTema });

      // Adiciona os parâmetros de filtro
      if (ramoDireito) params.append("ramoDireito", ramoDireito);
      if (assunto) params.append("assunto", assunto.trim());
      if (situacaoRepGeral) params.append("situacaoRepGeral", situacaoRepGeral.trim());
      if (situacaoTema) params.append("situacaoTema", situacaoTema.trim());

      // if (params.toString()) {
      //   url += `?${params.toString()}`;
      // }
      const finalUrl = params.toString() ? `${url}?${params.toString()}` : url;

      console.log("🚀 Buscando julgados com URL:", finalUrl); // 🔥 Veja a URL final gerada!

      try {
        const response = await fetch(finalUrl);
        if (!response.ok) {
          throw new Error("Erro ao buscar julgados");
        }
        const data = await response.json();
        setJulgados(data);
      } catch (error) {
        setError("Falha ao carregar julgados");
      } finally {
        setLoading(false);
      }
    }

    fetchJulgados();
  }, [ramoDireito, assunto, situacaoRepGeral, situacaoTema]); // Atualiza sempre que os filtros mudarem

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <div className="grid grid-cols-1 gap-8">
        {julgados.map((j) => (
          <div
            key={j._id}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition duration-300"
          >
            <Link
              href={"/stf-rep-geral/" + j._id}
              className="block"
              target="_blank"
            >
              <h2 className="text-xl font-semibold text-slate-800 text-justify">
                Tema {j.tema.toString()} - {j.titulo}
              </h2>
            </Link>
            <p className="text-gray-600">Ramo do Direito: {j.ramoDireito}</p>
            <p className="text-gray-600 text-justify mt-2 mb-2 font-semibold">Tese: {j.tese}</p>
            <p className="text-gray-600">Data de julgamento: {formatDate(j.dataJulgamento)}</p>
            <p className="text-gray-600">Situação de Repercussão Geral: {j.situacaoRepGeral}</p>
            <p className="text-gray-600">Situação do Tema: {j.situacaoTema}</p>
            <p className="text-gray-600">Recurso Paradigma: {j.leadingCase}</p>
            {j.assunto_array && j.assunto_array.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                <p>Assuntos:</p>
                {j.assunto_array.slice(1).map((assunto_array, index) => (
                  <span key={index} className="text-sm bg-gray-100 p-2 rounded-lg">
                    {assunto_array}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
