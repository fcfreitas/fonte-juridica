"use client";
import { useState, useEffect } from "react";
// import Link from "next/link";
import { useFilter } from "./components/FilterContext";
import { Julgado } from "./julgados-data";
import { useSession } from "next-auth/react";
// import { IntegerType } from "mongodb";
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button";
// import { BookOpen, BookIcon } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JulgadoCard } from "./components/JulgadoCard";

const formatDate = (date: string | null | undefined): string => {
  if (!date) {
    return "";
  }
  return date.substring(0, 10); // Pega apenas a parte da data (YYYY-MM-DD)
};

export default function JulgadosList() {
  const { data: session } = useSession();
  const { ramoDireito, assunto, situacaoRepGeral, situacaoTema, searchText, searchTema } = useFilter();
  const [julgados, setJulgados] = useState<Julgado[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [temasLidos, setTemasLidos] = useState<Record<number, boolean>>({}); // Armazena quais temas foram marcados como lidos
    type SortOption = "temasRecentes" | "temasAntigos" | "tesesRecentes" | "tesesAntigas";
  const [sortOption, setSortOption] = useState<SortOption>("temasRecentes");

  const sortMap: Record<SortOption, { sortField: string; sortOrder: string }> = {
    temasRecentes: { sortField: "tema", sortOrder: "desc" },
    temasAntigos: { sortField: "tema", sortOrder: "asc" },
    tesesRecentes: { sortField: "dataTese", sortOrder: "desc" },
    tesesAntigas: { sortField: "dataTese", sortOrder: "asc" },
  };  

  useEffect(() => {
    async function fetchJulgados() {
      let url = process.env.NEXT_PUBLIC_SITE_URL + "/api/julgados"; // Ajuste para o endpoint correto
      const params = new URLSearchParams();

      console.log("🎯 Filtros do Context API:", { ramoDireito, assunto, situacaoRepGeral, situacaoTema, searchText });

      // Adiciona os parâmetros de filtro
      if (ramoDireito) params.append("ramoDireito", ramoDireito);
      if (assunto) params.append("assunto", assunto.trim());
      if (situacaoRepGeral) params.append("situacaoRepGeral", situacaoRepGeral.trim());
      if (situacaoTema) params.append("situacaoTema", situacaoTema.trim());
      if (searchText) params.append("searchText", searchText.trim());
      if (searchTema) params.append("searchTema", searchTema.trim());
      const { sortField, sortOrder } = sortMap[sortOption];
      params.append("sortField", sortField);
      params.append("sortOrder", sortOrder);

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
  }, [ramoDireito, assunto, situacaoRepGeral, situacaoTema, searchText || "", searchTema || "", session, sortOption]); // Atualiza sempre que os filtros mudarem

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
    <div className="grid grid-cols-1 gap-8">
      <Tabs defaultValue="all" className="w-full">
        <div className="flex justify-between items-center mb-4 gap-4">
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="unread">Não Lidos</TabsTrigger>
            <TabsTrigger value="read">Lidos</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <label htmlFor="sortSelect" className="text-sm font-medium">
              Ordenar por:
            </label>
            <select
              id="sortSelect"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="text-sm px-2 py-1 border rounded-md"
            >
              <option value="temasRecentes">Temas recentes</option>
              <option value="temasAntigos">Temas antigos</option>
              <option value="tesesRecentes">Teses recentes</option>
              <option value="tesesAntigas">Teses antigas</option>
            </select>
          </div>
        </div>


        <TabsContent value="all" className="space-y-6 mt-0">
          {julgados.map((j) => (
            <JulgadoCard
              key={j._id}
              j={j}
              temasLidos={temasLidos}
              toggleLido={toggleLido}
              formatDate={formatDate}
            />
          ))}
        </TabsContent>

        <TabsContent value="unread" className="space-y-6 mt-0">
          {julgados
            .filter((j) => !temasLidos[Number(j.tema)])
            .map((j) => (
              <JulgadoCard
              key={j._id}
              j={j}
              temasLidos={temasLidos}
              toggleLido={toggleLido}
              formatDate={formatDate}
            />
            ))}
        </TabsContent>

        <TabsContent value="read" className="space-y-6 mt-0">
          {julgados
            .filter((j) => !!temasLidos[Number(j.tema)])
            .map((j) => (
              <JulgadoCard
              key={j._id}
              j={j}
              temasLidos={temasLidos}
              toggleLido={toggleLido}
              formatDate={formatDate}
            />
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
