"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useFilter } from "./components/FilterContext";
import { Julgado } from "./julgados-data";
import { useSession } from "next-auth/react";
import { IntegerType } from "mongodb";

const formatDate = (date: string | null | undefined): string => {
  if (!date) {
    return "";
  }
  return date.substring(0, 10); // Pega apenas a parte da data (YYYY-MM-DD)
};

export default function JulgadosList() {
  const { data: session } = useSession();
  const { ramoDireito, assunto, situacaoRepGeral, situacaoTema } = useFilter();
  const [julgados, setJulgados] = useState<Julgado[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [temasLidos, setTemasLidos] = useState<Record<number, boolean>>({}); // Armazena quais temas foram marcados como lidos

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

    async function fetchTemasLidos() {
      if (!session) return;
      try {
        console.log("🟢 Sessão atual:", session);
        const res = await fetch(`/api/temas-lidos?userId=${session.user.id}`);
        if (!res.ok) throw new Error("Erro ao buscar temas lidos");
        const data = await res.json();
        const lidos = data.reduce((acc: Record<number, boolean>, item: { tema: number; lido: boolean }) => {
          acc[item.tema] = item.lido;
          return acc;
        }, {});
        setTemasLidos(lidos);
      } catch (error) {
        console.error(error);
      }
    }

    fetchJulgados();
    if (session) fetchTemasLidos();
  }, [ramoDireito, assunto, situacaoRepGeral, situacaoTema, session]); // Atualiza sempre que os filtros mudarem

  const toggleLido = async (tema: number) => {
    if (!session) return alert("Você precisa estar logado para marcar como lido.");

    const novoEstado = !temasLidos[tema]; // Alterna entre true/false

    try {
      const response = await fetch("/api/temas-lidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id, tema, lido: novoEstado }),
      });

      if (!response.ok) throw new Error("Erro ao atualizar tema lido");

      setTemasLidos((prev) => ({
        ...prev,
        [tema]: novoEstado,
      }));
    } catch (error) {
      console.error(error);
    }
  };

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
                      {/* Botão de Marcar como Lido */}
          <button
            className={`mt-3 px-4 py-2 text-white rounded-lg ${
              temasLidos[parseInt(j.tema.toString(),10)] ? "bg-green-600 hover:bg-green-700" : "bg-gray-500 hover:bg-gray-600"
            }`}
            onClick={() => toggleLido(parseInt(j.tema.toString(),10))}
          >
            {temasLidos[parseInt(j.tema.toString(),10)] ? "Lido ✔" : "Marcar como Lido"}
          </button>
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
