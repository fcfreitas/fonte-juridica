"use client";
import { useState, useEffect } from "react";
// import Link from "next/link";
import { useFilter } from "./components/FilterContext";
import { Julgado } from "./julgados-data";
import { useSession } from "next-auth/react";
// import { IntegerType } from "mongodb";
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button";
import { BookOpen, BookIcon, SortDesc} from "lucide-react";
// import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JulgadoCard } from "./components/JulgadoCard";
import { Select, SelectTrigger, SelectItem, SelectValue, SelectContent } from "@/components/ui/select";

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
  const [temasDestacados, setTemasDestacados] = useState<Record<number, boolean>>({}); // Armazena quais temas foram destacados
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

    async function fetchTemasDestacados() {
      if (!session) return;
      try {
        console.log("🟢 Sessão atual:", session);
        const res = await fetch(`/api/tema-destaque?userId=${session.user.id}`);
        if (!res.ok) throw new Error("Erro ao buscar temas destacados");
        const data = await res.json();
        const destacados = data.reduce((acc: Record<number, boolean>, item: { tema: number; destacado: boolean }) => {
          acc[item.tema] = item.destacado;
          return acc;
        }, {});
        setTemasDestacados(destacados);
      } catch (error) {
        console.error(error);
      }
    }

    fetchJulgados();
    if (session) fetchTemasLidos();
    if (session) fetchTemasDestacados();
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

  const toggleDestacado = async (tema: number) => {
    if (!session) return alert("Você precisa estar logado para destacar.");

    const novoEstado = !temasDestacados[tema]; // Alterna entre true/false

    try {
      const response = await fetch("/api/tema-destaque", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id, tema, destacado: novoEstado }),
      });

      if (!response.ok) throw new Error("Erro ao atualizar tema destacado");

      setTemasDestacados((prev) => ({
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
    <div className="flex flex-col gap-4">
      <Tabs defaultValue="all" className="w-full">
        {/* Cabeçalho fixo que os cards passam por baixo */}
        <div className="bg-slate-50 z-40 pb-6">
          <div className="flex justify-between items-center  gap-4 text-sm">
            <TabsList>
              <TabsTrigger className="text-sm" value="all">Todos</TabsTrigger>
              <TabsTrigger className="text-sm" value="unread">Não Lidos</TabsTrigger>
              <TabsTrigger className="text-sm" value="read">Lidos</TabsTrigger>
              <TabsTrigger className="text-sm" value="destaque">Destaques</TabsTrigger>
            </TabsList>
  
            <div className="flex items-center gap-2">
              <Select
                value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}
              >
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center gap-2">
                    <SortDesc size={16} />
                    <SelectValue placeholder="Ordenar por" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="temasRecentes">Temas recentes</SelectItem>
                <SelectItem value="temasAntigos">Temas antigos</SelectItem>
                <SelectItem value="tesesRecentes">Teses recentes</SelectItem>
                <SelectItem value="tesesAntigas">Teses antigas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
  
        {/* Cards normais, scroll da página padrão */}
        <TabsContent value="all" className="space-y-6 pr-0.5">
          <div className="h-[calc(100vh-70px)] overflow-y-auto space-y-6 pr-0.5 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
            {julgados.map((j) => (
              <JulgadoCard
                key={j._id}
                j={j}
                temasLidos={temasLidos}
                toggleLido={toggleLido}
                temasDestacados={temasDestacados}
                toggleDestacado={toggleDestacado}
                formatDate={formatDate}
              />
            ))}
          </div>
        </TabsContent>
  
        <TabsContent value="unread" className="space-y-6 pr-0.5">
        <div className="h-[calc(100vh-70px)] overflow-y-auto space-y-6 pr-0.5 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
          {julgados
            .filter((j) => !temasLidos[Number(j.tema)])
            .map((j) => (
              <JulgadoCard
                key={j._id}
                j={j}
                temasLidos={temasLidos}
                toggleLido={toggleLido}
                temasDestacados={temasDestacados}
                toggleDestacado={toggleDestacado}
                formatDate={formatDate}
              />
            ))}
        </div>
        </TabsContent>
  
        <TabsContent value="read" className="space-y-6 pr-0.5">
        <div className="h-[calc(100vh-70px)] overflow-y-auto space-y-6 pr-0.5 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
          {julgados
            .filter((j) => !!temasLidos[Number(j.tema)])
            .map((j) => (
              <JulgadoCard
                key={j._id}
                j={j}
                temasLidos={temasLidos}
                toggleLido={toggleLido}
                temasDestacados={temasDestacados}
                toggleDestacado={toggleDestacado}
                formatDate={formatDate}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="destaque" className="space-y-6 pr-0.5">
        <div className="h-[calc(100vh-70px)] overflow-y-auto space-y-6 pr-0.5 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
          {julgados
            .filter((j) => !!temasDestacados[Number(j.tema)])
            .map((j) => (
              <JulgadoCard
                key={j._id}
                j={j}
                temasLidos={temasLidos}
                toggleLido={toggleLido}
                temasDestacados={temasDestacados}
                toggleDestacado={toggleDestacado}
                formatDate={formatDate}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );  
}
