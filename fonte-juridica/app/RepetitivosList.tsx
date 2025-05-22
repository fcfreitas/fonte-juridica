"use client";
import { useState, useEffect } from "react";
// import Link from "next/link";
import { useFilter } from "./components/FilterContextRepet";
import { Processo, Repetitivo } from "./julgados-data";
import { useSession } from "next-auth/react";
// import { IntegerType } from "mongodb";
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button";
import { BookOpen, BookIcon, SortDesc, Star, MenuSquare} from "lucide-react";
// import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RepetitivoCard } from "./components/RepetitivoCard";
import { Select, SelectTrigger, SelectItem, SelectValue, SelectContent } from "@/components/ui/select";

const formatDate = (date: string | null | undefined): string => {
  if (!date) {
    return "";
  }
  return date.substring(0, 10); // Pega apenas a parte da data (YYYY-MM-DD)
};

export default function RepetitivosList() {
  const { data: session } = useSession();
  const { ramoDireito, assunto, situacaoTema, searchText, searchTema } = useFilter();
  const [repetitivos, setRepetitivos] = useState<Repetitivo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [repetitivosLidos, setRepetitivosLidos] = useState<Record<number, boolean>>({}); // Armazena quais temas foram marcados como lidos
  const [repetitivosDestacados, setRepetitivosDestacados] = useState<Record<number, boolean>>({}); // Armazena quais temas foram destacados
    type SortOption = "temasRecentes" | "temasAntigos" | "tesesRecentes" | "tesesAntigas";
  const [sortOption, setSortOption] = useState<SortOption>("temasRecentes");

  const sortMap: Record<SortOption, { sortField: string; sortOrder: string }> = {
    temasRecentes: { sortField: "tema", sortOrder: "desc" },
    temasAntigos: { sortField: "tema", sortOrder: "asc" },
    tesesRecentes: { sortField: "dataTese", sortOrder: "desc" },
    tesesAntigas: { sortField: "dataTese", sortOrder: "asc" },
  };  

  useEffect(() => {
    async function fetchRepetitivos() {
      let url = process.env.NEXT_PUBLIC_SITE_URL + "/api/repetitivos"; // Ajuste para o endpoint correto
      const params = new URLSearchParams();

      console.log("🎯 Filtros do Context API:", { ramoDireito, assunto, situacaoTema, searchText });

      // Adiciona os parâmetros de filtro
      if (ramoDireito) params.append("ramoDireito", ramoDireito);
      if (assunto) params.append("assunto", assunto.trim());
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

      console.log("🚀 Buscando repetitivos com URL:", finalUrl); // 🔥 Veja a URL final gerada!

      try {
        const response = await fetch(finalUrl);
        if (!response.ok) {
          throw new Error("Erro ao buscar repetitivos");
        }
        const data = await response.json();
        setRepetitivos(data);
      } catch (error) {
        setError("Falha ao carregar repetitivos");
      } finally {
        setLoading(false);
      }
    }

    async function fetchRepetitivosLidos() {
      if (!session) return;
      try {
        console.log("🟢 Sessão atual:", session);
        const res = await fetch(`/api/repetitivos-lidos?userId=${session.user.id}`);
        if (!res.ok) throw new Error("Erro ao buscar repetitivos lidos");
        const data = await res.json();
        const lidos = data.reduce((acc: Record<number, boolean>, item: { tema: number; lido: boolean }) => {
          acc[item.tema] = item.lido;
          return acc;
        }, {});
        setRepetitivosLidos(lidos);
      } catch (error) {
        console.error(error);
      }
    }

    async function fetchRepetitivosDestacados() {
      if (!session) return;
      try {
        console.log("🟢 Sessão atual:", session);
        const res = await fetch(`/api/repetitivos-destaque?userId=${session.user.id}`);
        if (!res.ok) throw new Error("Erro ao buscar repetitivos destacados");
        const data = await res.json();
        const destacados = data.reduce((acc: Record<number, boolean>, item: { tema: number; destacado: boolean }) => {
          acc[item.tema] = item.destacado;
          return acc;
        }, {});
        setRepetitivosDestacados(destacados);
      } catch (error) {
        console.error(error);
      }
    }

    fetchRepetitivos();
    if (session) fetchRepetitivosLidos();
    if (session) fetchRepetitivosDestacados();
  }, [ramoDireito, assunto, situacaoTema, searchText || "", searchTema || "", session, sortOption]); // Atualiza sempre que os filtros mudarem

  const toggleLido = async (tema: number) => {
    if (!session) return alert("Você precisa estar logado para marcar como lido.");

    const novoEstado = !repetitivosLidos[tema]; // Alterna entre true/false

    try {
      const response = await fetch("/api/repetitivos-lidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id, tema, lido: novoEstado }),
      });

      if (!response.ok) throw new Error("Erro ao atualizar tema lido");

      setRepetitivosLidos((prev) => ({
        ...prev,
        [tema]: novoEstado,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const toggleDestacado = async (tema: number) => {
    if (!session) return alert("Você precisa estar logado para destacar.");

    const novoEstado = !repetitivosDestacados[tema]; // Alterna entre true/false

    try {
      const response = await fetch("/api/repetitivos-destaque", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id, tema, destacado: novoEstado }),
      });

      if (!response.ok) throw new Error("Erro ao atualizar tema destacado");

      setRepetitivosDestacados((prev) => ({
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
              <TabsTrigger className="text-sm gap-1" value="all"><MenuSquare size={16}/>Todos</TabsTrigger>
              <TabsTrigger className="text-sm gap-1" value="unread"><BookOpen size={16}/>  Não Lidos</TabsTrigger>
              <TabsTrigger className="text-sm gap-1" value="read"><BookIcon size={16} fill="oklch(90.1% 0.058 230.902)" />  Lidos</TabsTrigger>
              <TabsTrigger className="text-sm gap-1" value="destaque"><Star size={16} fill="oklch(82.8% 0.189 84.429)" />  Destaques</TabsTrigger>
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
            {repetitivos.map((j) => (
              <RepetitivoCard
                key={j._id}
                j={j}
                repetitivosLidos={repetitivosLidos}
                toggleLido={toggleLido}
                repetitivosDestacados={repetitivosDestacados}
                toggleDestacado={toggleDestacado}
                formatDate={formatDate}
              />
            ))}
          </div>
        </TabsContent>
  
        <TabsContent value="unread" className="space-y-6 pr-0.5">
        <div className="h-[calc(100vh-70px)] overflow-y-auto space-y-6 pr-0.5 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
          {repetitivos
            .filter((j) => !repetitivosLidos[Number(j.tema)])
            .map((j) => (
              <RepetitivoCard
                key={j._id}
                j={j}
                repetitivosLidos={repetitivosLidos}
                toggleLido={toggleLido}
                repetitivosDestacados={repetitivosDestacados}
                toggleDestacado={toggleDestacado}
                formatDate={formatDate}
              />
            ))}
        </div>
        </TabsContent>
  
        <TabsContent value="read" className="space-y-6 pr-0.5">
        <div className="h-[calc(100vh-70px)] overflow-y-auto space-y-6 pr-0.5 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
          {repetitivos
            .filter((j) => !!repetitivosLidos[Number(j.tema)])
            .map((j) => (
              <RepetitivoCard
                key={j._id}
                j={j}
                repetitivosLidos={repetitivosLidos}
                toggleLido={toggleLido}
                repetitivosDestacados={repetitivosDestacados}
                toggleDestacado={toggleDestacado}
                formatDate={formatDate}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="destaque" className="space-y-6 pr-0.5">
        <div className="h-[calc(100vh-70px)] overflow-y-auto space-y-6 pr-0.5 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
          {repetitivos
            .filter((j) => !!repetitivosDestacados[Number(j.tema)])
            .map((j) => (
              <RepetitivoCard
                key={j._id}
                j={j}
                repetitivosLidos={repetitivosLidos}
                toggleLido={toggleLido}
                repetitivosDestacados={repetitivosDestacados}
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
