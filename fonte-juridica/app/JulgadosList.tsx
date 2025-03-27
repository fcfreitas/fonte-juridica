"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useFilter } from "./components/FilterContext";
import { Julgado } from "./julgados-data";
import { useSession } from "next-auth/react";
import { IntegerType } from "mongodb";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { BookOpen, BookIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    <div className="grid grid-cols-1 gap-8">
      <Tabs defaultValue="all" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="unread">Não Lidos</TabsTrigger>
            <TabsTrigger value="read">Lidos</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="all" className="space-y-6 mt-0">
          {julgados.map((j) => (
            <Card
              key={j._id}
              className={`overflow-hidden transition-all duration-200 ${!!temasLidos[Number(j.tema)] ? "border-l-4 border-l-green-500" : "border-l-4 border-l-blue-500"}`}
            >

              <CardHeader className="bg-slate-50 pb-2">
                <div className="flex justify-between items-start">
                  <Link
                  href={"/stf-rep-geral/" + j._id}
                  className="block"
                  target="_blank"
                  >
                    <CardTitle className="text-lg font-bold text-slate-800 text-justify">{j.tema.toString()} - {j.titulo}</CardTitle>
                  </Link>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-slate-600 mt-1">Ramo do Direito: {j.ramoDireito}</p>
                  <Button
                    variant={!!temasLidos[Number(j.tema)] ? "outline" : "secondary"}
                    size="sm"
                    className="h-9 gap-2"
                    onClick={() => toggleLido(Number(j.tema))}
                  >
                    {!!temasLidos[Number(j.tema)] ? (
                      <>
                        <BookIcon size={16} />
                        <span>Lido</span>
                      </>
                    ) : (
                      <>
                        <BookOpen size={16} />
                        <span>Marcar como Lido</span>
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-700 text-justify mb-2 font-semibold text-sm">Tese:<span className="font-normal text-slate-600 text-justify">{j.tese ? j.tese.slice(0, 250) + (j.tese.length > 250 ? ' (...)' : '') : ''}</span></p>
                    <p className="text-slate-600 font-medium text-sm">Data de julgamento: {formatDate(j.dataJulgamento)}</p>
                  </div>
                  <div>
                    <div className="space-y-1">
                      <p className="text-slate-600 font-medium text-sm">Situação de Repercussão Geral: <span className="font-normal">{j.situacaoRepGeral}</span></p>
                      <p className="text-slate-600 font-medium text-sm">Situação do Tema: <span className="font-normal">{j.situacaoTema}</span></p>
                      <p className="text-slate-600 font-medium text-sm">Recurso Paradigma: <span className="font-normal">{j.leadingCase}</span></p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50 flex flex-wrap gap-2 pt-3 pb-3">
              <p className="text-sm font-medium text-slate-700 mr-2">Assuntos:</p>
                {j.assunto_array && j.assunto_array.length > 0 && (
                    j.assunto_array.slice(1).map((assunto, index) => (
                      <Badge key={Number(index)} variant="secondary" className="text-sm bg-gray-100 p-2 rounded-lg">
                        <span>{assunto}</span>
                      </Badge>
                    ))
                )}
              </CardFooter>
            </Card>
          ))}
        </TabsContent>


        <TabsContent value="unread" className="space-y-6 mt-0">
          {julgados.filter((j) => !temasLidos[Number(j.tema)]).map((j) => (
            <Card
              key={j._id}
              className={`overflow-hidden transition-all duration-200 ${!!temasLidos[Number(j.tema)] ? "border-l-4 border-l-green-500" : "border-l-4 border-l-blue-500"}`}
            >

              <CardHeader className="bg-slate-50 pb-2">
                <div className="flex justify-between items-start">
                  <Link
                  href={"/stf-rep-geral/" + j._id}
                  className="block"
                  target="_blank"
                  >
                    <CardTitle className="text-lg font-bold text-slate-800 text-justify">{j.tema.toString()} - {j.titulo}</CardTitle>
                  </Link>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-slate-600 mt-1">Ramo do Direito: {j.ramoDireito}</p>
                  <Button
                    variant={!!temasLidos[Number(j.tema)] ? "outline" : "secondary"}
                    size="sm"
                    className="h-9 gap-2"
                    onClick={() => toggleLido(Number(j.tema))}
                  >
                    {!!temasLidos[Number(j.tema)] ? (
                      <>
                        <BookIcon size={16} />
                        <span>Lido</span>
                      </>
                    ) : (
                      <>
                        <BookOpen size={16} />
                        <span>Marcar como Lido</span>
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-700 text-justify mb-2 font-semibold text-sm">Tese:<span className="font-normal text-slate-600 text-justify">{j.tese ? j.tese.slice(0, 250) + (j.tese.length > 250 ? ' (...)' : '') : ''}</span></p>
                    <p className="text-slate-600 font-medium text-sm">Data de julgamento: {formatDate(j.dataJulgamento)}</p>
                  </div>
                  <div>
                    <div className="space-y-1">
                      <p className="text-slate-600 font-medium text-sm">Situação de Repercussão Geral: <span className="font-normal">{j.situacaoRepGeral}</span></p>
                      <p className="text-slate-600 font-medium text-sm">Situação do Tema: <span className="font-normal">{j.situacaoTema}</span></p>
                      <p className="text-slate-600 font-medium text-sm">Recurso Paradigma: <span className="font-normal">{j.leadingCase}</span></p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50 flex flex-wrap gap-2 pt-3 pb-3">
              <p className="text-sm font-medium text-slate-700 mr-2">Assuntos:</p>
                {j.assunto_array && j.assunto_array.length > 0 && (
                    j.assunto_array.slice(1).map((assunto, index) => (
                      <Badge key={Number(index)} variant="secondary" className="text-sm bg-gray-100 p-2 rounded-lg">
                        <span>{assunto}</span>
                      </Badge>
                    ))
                )}
              </CardFooter>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="read" className="space-y-6 mt-0">
          {julgados.filter((j) => !!temasLidos[Number(j.tema)]).map((j) => (
            <Card
              key={j._id}
              className={`overflow-hidden transition-all duration-200 ${!!temasLidos[Number(j.tema)] ? "border-l-4 border-l-green-500" : "border-l-4 border-l-blue-500"}`}
            >

              <CardHeader className="bg-slate-50 pb-2">
                <div className="flex justify-between items-start">
                  <Link
                  href={"/stf-rep-geral/" + j._id}
                  className="block"
                  target="_blank"
                  >
                    <CardTitle className="text-lg font-bold text-slate-800 text-justify">{j.tema.toString()} - {j.titulo}</CardTitle>
                  </Link>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-slate-600 mt-1">Ramo do Direito: {j.ramoDireito}</p>
                  <Button
                    variant={!!temasLidos[Number(j.tema)] ? "outline" : "secondary"}
                    size="sm"
                    className="h-9 gap-2"
                    onClick={() => toggleLido(Number(j.tema))}
                  >
                    {!!temasLidos[Number(j.tema)] ? (
                      <>
                        <BookIcon size={16} />
                        <span>Lido</span>
                      </>
                    ) : (
                      <>
                        <BookOpen size={16} />
                        <span>Marcar como Lido</span>
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-700 text-justify mb-2 font-semibold text-sm">Tese:<span className="font-normal text-slate-600 text-justify">{j.tese ? j.tese.slice(0, 250) + (j.tese.length > 250 ? ' (...)' : '') : ''}</span></p>
                    <p className="text-slate-600 font-medium text-sm">Data de julgamento: {formatDate(j.dataJulgamento)}</p>
                  </div>
                  <div>
                    <div className="space-y-1">
                      <p className="text-slate-600 font-medium text-sm">Situação de Repercussão Geral: <span className="font-normal">{j.situacaoRepGeral}</span></p>
                      <p className="text-slate-600 font-medium text-sm">Situação do Tema: <span className="font-normal">{j.situacaoTema}</span></p>
                      <p className="text-slate-600 font-medium text-sm">Recurso Paradigma: <span className="font-normal">{j.leadingCase}</span></p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50 flex flex-wrap gap-2 pt-3 pb-3">
              <p className="text-sm font-medium text-slate-700 mr-2">Assuntos:</p>
                {j.assunto_array && j.assunto_array.length > 0 && (
                    j.assunto_array.slice(1).map((assunto, index) => (
                      <Badge key={Number(index)} variant="secondary" className="text-sm bg-gray-100 p-2 rounded-lg">
                        <span>{assunto}</span>
                      </Badge>
                    ))
                )}
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
