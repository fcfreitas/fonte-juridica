"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import NotFoundPage from "@/app/not-found";
import { Processo, Repetitivo } from "@/app/julgados-data";
import Link from "next/link";
import AdminTextEditor from "@/app/components/textEditor";
import UserTextEditor from "@/app/components/UserTextEditor";
import "@/styles/quill-styles.css";
import { Badge } from "@/components/ui/badge";
import { Bookmark, BookOpen, BookIcon, FileText, Info, Calendar, User, Flag, MessageSquare, ExternalLink, FileCheck, NotebookPen, Star, StarOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

const formatDate = (date: string | null | undefined): string => {
  return date ? date.substring(0, 10) : "";
};

export default function RepetitivoDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [repetitivo, setRepetitivo] = useState<Repetitivo | null>(null);
  const [comentarios, setComentarios] = useState<{ _id: string, text: string, createdAt: string }[]>([]);
  const [userNotes, setUserNotes] = useState<{ _id: string, text: string, createdAt: string }[]>([]);
  const [lido, setLido] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<{ [key: string]: boolean }>({});
  const [novoTexto, setNovoTexto] = useState<{ [key: string]: string }>({});
  const [temasLidos, setTemasLidos] = useState<Record<number, boolean>>({}); // Armazena quais temas foram marcados como lidos
  const [destacado, setDestacado] = useState<boolean | null>(null); // Armazena quais temas foram destacados

  // Redirecionar para login se não estiver autenticado
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
    }
  }, [session, status, router]);

  // Buscar os dados do julgado após a autenticação ser resolvida
  useEffect(() => {
    if (!params?.id) return;

    async function fetchRepetitivo() {
      setLoading(true);
      try {
        const response = await fetch(`/api/repetitivos/${params.id}`);
        if (!response.ok) throw new Error("Repetitivo não encontrado");

        const data: Repetitivo = await response.json();
        setRepetitivo(data);
      } catch (error) {
        console.error("Erro ao buscar repetitivo:", error);
        setRepetitivo(null);
      } finally {
        setLoading(false);
      }
    }

    fetchRepetitivo();
  }, [params?.id, ]);

  // Buscar os comentários relacionados ao julgado
  useEffect(() => {
    if (!params?.id) return;

    async function fetchComentariosInicial() {
      try {
        const response = await fetch(`/api/publish-text-repet?tema=${repetitivo?.tema}`);
        if (!response.ok) throw new Error("Erro ao buscar comentários");

        const data = await response.json();
        setComentarios(data);
      } catch (error) {
        console.error("Erro ao buscar comentários:", error);
      }
    }

    fetchComentariosInicial();
  }, [repetitivo?.tema]);

  const fetchComentarios = async () => {
    try {
      const response = await fetch(`/api/publish-text-repet?tema=${repetitivo?.tema}`);
      if (!response.ok) throw new Error("Erro ao buscar comentários");

      const data = await response.json();
      setComentarios(data);
    } catch (error) {
      console.error("Erro ao buscar comentários:", error);
    }
  }

  // Buscar as anotações do usuário relacionadas ao julgado
  useEffect(() => {
    if (!session || !repetitivo?.tema) return;

    async function fetchUserNotesInicial() {
      try {
        const response = await fetch(`/api/publish-user-notes-repet?userId=${session?.user.id}&tema=${repetitivo?.tema}`);
        if (!response.ok) throw new Error("Erro ao buscar anotações");

        const data = await response.json();
        setUserNotes(data);
      } catch (error) {
        console.error("Erro ao buscar anotações:", error);
      }
    }

    fetchUserNotesInicial();
  }, [repetitivo?.tema, session?.user.id]);

  const fetchUserNotes = async () => {
    try {
      const response = await fetch(`/api/publish-user-notes-repet?userId=${session?.user.id}&tema=${repetitivo?.tema}`);
      if (!response.ok) throw new Error("Erro ao buscar anotações");

      const data = await response.json();
      setUserNotes(data);
    } catch (error) {
      console.error("Erro ao buscar anotações:", error);
    }
  }


  useEffect(() => {
    if (!session || !repetitivo?.tema) return;

    async function fetchLidoStatus() {
      try {
        const response = await fetch(`/api/repetitivos-lidos?userId=${session?.user.id}&tema=${repetitivo?.tema}`);
        console.log('Parametros de busca dos comentarios', repetitivo?.tema, session?.user.id)
        const data = await response.json();
        setLido(data?.lido ?? false);
      } catch (error) {
        console.error("Erro ao buscar status de leitura:", error);
      }
    }

    fetchLidoStatus();
  }, [session, repetitivo?.tema]);

  useEffect(() => {
    if (!session || !repetitivo?.tema) return;
    async function fetchDestaqueStatus() {
      try {
        const response = await fetch(`/api/repetitivos-destaque?userId=${session?.user.id}&tema=${repetitivo?.tema}`);
        console.log('Parametros de busca dos comentarios', repetitivo?.tema, session?.user.id)
        const data = await response.json();
        setDestacado(data?.destacado ?? false);
      } catch (error) {
        console.error("Erro ao buscar status de destaque:", error);
      }
    }

    fetchDestaqueStatus();
  }, [session, repetitivo?.tema]);

  const toggleLido = async () => {
    if (!session || !repetitivo?.tema) return;

    const novoEstado = !lido; // Alterna entre true/false

    setLoading(true);
    try {
      const response = await fetch("/api/temas-lidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id, tema: repetitivo?.tema, lido: novoEstado }),
      });

      if (!response.ok) throw new Error("Erro ao atualizar tema lido");

      const data = await response.json();
      console.log("Resposta do toggle:", data); // Para ver o retorno
  
      setLido(data.lido); // Atualiza com o valor retornado
    } catch (error) {
      console.error("Erro ao atualizar tema lido:", error);
    }
  };

  const toggleDestacado = async () => {
    if (!session || !repetitivo?.tema) return alert("Você precisa estar logado para destacar.");

    const novoEstado = !destacado; // Alterna entre true/false

    try {
      const response = await fetch("/api/tema-destaque", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id, tema: repetitivo?.tema, destacado: novoEstado }),
      });

      if (!response.ok) throw new Error("Erro ao atualizar tema destacado");
      const data = await response.json();
      console.log("Resposta do toggle:", data); // Para ver o retorno

      setDestacado(data.destacado);
    } catch (error) {
      console.error(error);
    }
  };


  const handleEditar = (id: string, textoAtual: string) => {
    setEditando((prev) => ({ ...prev, [id]: true }));
    setNovoTexto((prev) => ({ ...prev, [id]: textoAtual }));
    fetchComentarios;
  };

  const handleEditarAnotacao = (id: string, textoAtual: string) => {
    setEditando((prev) => ({ ...prev, [id]: true }));
    setNovoTexto((prev) => ({ ...prev, [id]: textoAtual }));
    fetchUserNotes;
  };

  const handleSalvar = async (id: string) => {
    try {
      const response = await fetch("/api/publish-text-repet", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, text: novoTexto[id] }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar comentário.");
      }

      setComentarios((prev) =>
        prev.map((comentario) =>
          comentario._id === id ? { ...comentario, text: novoTexto[id] } : comentario
        )
      );
      setEditando((prev) => ({ ...prev, [id]: false }));
      fetchComentarios;
    } catch (error) {
      console.error("Erro ao atualizar comentário:", error);
    }
  };

  const handleSalvarAnotacao = async (id: string) => {
    try {
      const response = await fetch("/api/publish-user-notes-repet", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, text: novoTexto[id] }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar comentário.");
      }

      setUserNotes((prev) =>
        prev.map((anotacao) =>
          anotacao._id === id ? { ...anotacao, text: novoTexto[id] } : anotacao
        )
      );
      setEditando((prev) => ({ ...prev, [id]: false }));
      fetchUserNotes;
    } catch (error) {
      console.error("Erro ao atualizar comentário:", error);
    }
  };

  if (status === "loading" || loading) {
    return <p className="text-center text-lg">Carregando...</p>;
  }

  if (!session) {
    return null;
  }

  if (!repetitivo) {
    return <NotFoundPage />;
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-6">
            <div className="space-y-3 mb-4"><div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
              <div className="flex flex-col md:flex-row items-center gap-2 text-lg text-muted-foreground">
                <Badge variant="outline" className="bg-slate-100">
                  Tema {repetitivo.tema.toString()}
                </Badge>

                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  {repetitivo.situacaoTema}
                </Badge>
              </div>

              <div className="flex flex-row items-center justify-center gap-2">
                <Button
                  variant={lido ? "outline" : "secondary"}
                  size="sm"
                  className="h-9 gap-2 items-center"
                  onClick={toggleLido}
                >
                  {lido ? (
                    <>
                      <BookIcon size={16} fill="oklch(90.1% 0.058 230.902)" />
                      <span>Lido</span>
                    </>
                  ) : (
                    <>
                      <BookOpen size={16} />
                      <span>Marcar como Lido</span>
                    </>
                  )}
                </Button>

                <Button
                  variant={destacado ? "outline" : "secondary"}
                  size="sm"
                  className="h-9 gap-2 items-center"
                  onClick={() => toggleDestacado()}
                >
                  {destacado ? (
                    <>
                      <Star size={16} fill="oklch(82.8% 0.189 84.429)" />
                      <span>Destaque</span>
                    </>
                  ) : (
                    <>
                      <StarOff size={16} />
                      <span>Destacar tema</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

                <h1 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight mb-6 text-justify">{repetitivo.questaoSubmetidaJulgamento}</h1>
                {repetitivo.teseFirmada ? (<Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <FileCheck className="h-5 w-5 mr-2 text-slate-500" />
                      Tese
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700 text-justify">{repetitivo.teseFirmada}</p>
                  </CardContent>
                </Card>
                ) : (<Card>
                  <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <FileCheck className="h-5 w-5 mr-2 text-slate-500" />
                    Tese
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 text-justify">Pendente.</p>
                </CardContent>
              </Card>

                )}
                <div className="flex items-center justify-start gap-4 mb-4">
                  {repetitivo.processos &&
                    repetitivo.processos.length > 0 &&
                    repetitivo.processos.map((processo: any, index: number) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs bg-gray-100 p-1 rounded-xl mr-2"
                      >
                        <span>{processo.processo}</span>
                      </Badge>
                    ))
                  }
                {/* {repetitivo.linkProcesso && (
                  <div className="flex justify-start">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                        <Link
                          href={julgado.linkProcesso}
                          target="_blank"
                        >
                          Link do processo
                        </Link>
                    </Button>
                  </div>
                )} */}
                </div>
            </div>

            <Tabs defaultValue="informacoes" className="w-full">
              <div className="md:hidden">
              <TabsList className="flex flex-col gap-2 mb-6">
                <TabsTrigger className="w-full" value="informacoes">Informações</TabsTrigger>
                <TabsTrigger className="w-full" value="comentarios">Comentários e Análises</TabsTrigger>
                <TabsTrigger className="w-full" value="anotacoes">Anotações Pessoais</TabsTrigger>
              </TabsList>
              </div>
              <div className="hidden md:block">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="informacoes">Informações</TabsTrigger>
                <TabsTrigger value="comentarios">Comentários e Análises</TabsTrigger>
                <TabsTrigger value="anotacoes">Anotações Pessoais</TabsTrigger>
              </TabsList>
              </div>

              <TabsContent value="informacoes" className="space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-slate-500" />
                      Ramo do Direito
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-slate-700 mb-4">Direito {repetitivo.ramoDireito}</div>
                    <div className="flex justify-start items-center gap-2">
                        <div className="text-sm font-medium text-slate-500">Assuntos:</div>
                        <div className="flex flex-wrap gap-2 text-sm font-medium text-slate-600">              
                          {repetitivo.assunto_array && repetitivo.assunto_array.length > 0 && (
                            repetitivo.assunto_array.map((assunto, index) => (
                              <Badge key={Number(index)} variant="secondary" className="text-md p-1 rounded-lg">
                                <span>{assunto}</span>
                              </Badge>
                            ))
                          )}
                        </div>
                      </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Info className="h-5 w-5 mr-2 text-slate-500" />
                      Descrição
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {repetitivo.delimitacaoJulgado &&
                    <div className="text-slate-700 mb-2"><span className="font-semibold">Delimitação Julgado: </span>{repetitivo.delimitacaoJulgado}</div>
                    }
                    {repetitivo.informacoesComplementares &&
                    <div className="text-slate-700 mb-2"><span className="font-semibold">Informações Complementares: </span>{repetitivo.informacoesComplementares}</div>
                    }
                    {repetitivo.anotacoesNUGEPNAC &&
                    <div className="text-slate-700 mb-2"><span className="font-semibold">Anotações NUGEPNAC: </span>{repetitivo.anotacoesNUGEPNAC}</div>
                    }
                    {repetitivo.repercussaoGeral &&
                    <div className="text-slate-700"><span className="font-semibold">Repercussão Geral: </span>{repetitivo.repercussaoGeral}</div>
                    }
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Flag className="h-5 w-5 mr-2 text-slate-500" />
                        Situação
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {/* <div>
                        <p className="text-sm font-medium text-slate-500">Situação de Repercussão Geral</p>
                        <p className="text-slate-700">{repetitivo.situacaoRepGeral}</p>
                      </div> */}
                      <div>
                        <p className="text-sm font-medium text-slate-500">Situação do Tema</p>
                        <p className="text-slate-700">{repetitivo.situacaoTema}</p>
                      </div>
                    </CardContent>
                  </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <User className="h-5 w-5 mr-2 text-slate-500" />
                      Órgão Julgador
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-slate-700">{repetitivo.orgaoJulgador}</div>
                  </CardContent>
                </Card>
                </div>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <User className="h-5 w-5 mr-2 text-slate-500" />
                      Processos:
                    </CardTitle>
                  </CardHeader>
                          {repetitivo.processos && repetitivo.processos.length > 0 && (
                            repetitivo.processos.map((processo, index) => (
                              <CardContent key={Number(index)}>
                                <div className="text-slate-700 mb-2">
                                  <p>Processo: {processo.processo}</p>
                                  <p>Registro: {processo.numeroRegistro}</p>
                                  <p>Tribunal de Origem: {processo.tribunalOrigem}</p>
                                  <p>RRC: {processo.rrc}</p>
                                  <p>Relator: {processo.relatorAtual}</p>
                                  <p>Data de Afetação: {processo.dataAfetacao}</p>
                                  <p>Vista MPF: {processo.vistaMPF}</p>
                                  <p>Julgado em: {processo.julgadoEm}</p>
                                  <p>Acórdão Publicado em:{processo.acordaoPublicadoEm}</p>
                                  <p>Trânsito em Julgado: {processo.transitoJulgado}</p>
                                  <p>Data de Desafetação: {processo.dataDesafet}</p>
                                  <p>Observações de Desafetação: {processo.observacaoDesafet}</p>
                                </div>
                              </CardContent>
                            ))
                          )}
                </Card>
              </TabsContent>

              <TabsContent value="comentarios">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2 text-slate-500" />
                      Comentários e Análises
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {comentarios.length > 0 ? (
                      <div className="space-y-4">
                        {comentarios.map((comentario) => (
                          <div key={comentario._id} className="border rounded-lg p-4">

                            {editando[comentario._id] ? (
                              // Exibe o editor para editar o conteúdo
                              <AdminTextEditor
                                tema={repetitivo.tema}
                                value={novoTexto[comentario._id]} // Passa o texto salvo para editar
                                onChange={(value) => setNovoTexto((prev) => ({
                                  ...prev,
                                  [comentario._id]: value,
                                }))}
                                onCommentPosted={fetchComentarios} // Atualiza os comentários na página
                              />
                            ) : (
                              // Exibe o conteúdo formatado com dangerouslySetInnerHTML
                              <>
                                <div
                                  className="quill-content text-gray-700 mb-2"
                                  dangerouslySetInnerHTML={{ __html: comentario.text }}
                                />
                                <div className="flex justify-between items-center mb-1 mt-2">
                                  <div className="text-sm text-muted-foreground"> Publicado em:
                                    {new Date(comentario.createdAt).toLocaleDateString("pt-BR")}
                                  </div>
                                  {/* <div className="mt-2 text-sm text-muted-foreground">Por: {comentario.autor}</div> */}
                                </div>   
                              </>
                            )}                          
                            {session?.user?.role === "admin" && (
                              <div className="mt-2">
                                {editando[comentario._id] ? (
                                  <button
                                    onClick={() => handleSalvar(comentario._id)}
                                    className="px-3 py-1 bg-green-500 text-white rounded mr-2"
                                  >
                                    Salvar
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleEditar(comentario._id, comentario.text)}
                                    className="px-3 py-1 bg-neutral-400 text-white rounded"
                                  >
                                    Editar
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-muted-foreground">Nenhum comentário disponível.</div>
                    )}
                  </CardContent>
                </Card>
                {session?.user?.role === "admin" && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <MessageSquare className="h-5 w-5 mr-2 text-slate-500" />
                        Incluir novos comentários e análises
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* Inserir Novos Comentários */}
                      <AdminTextEditor tema={repetitivo.tema} onCommentPosted={fetchComentarios} />
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="anotacoes">
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                    <NotebookPen className="h-5 w-5 mr-2 text-slate-500" />
                    Anotações pessoais
                    </CardTitle>
                    <CardDescription>Faça sua próprias anotações sobre o tema e revise sempre que precisar.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {userNotes.length > 0 ? (
                      <div className="space-y-4">
                        {userNotes.map((anotacao) => (
                          <div key={anotacao._id} className="border rounded-lg p-4">

                            {editando[anotacao._id] ? (
                              // Exibe o editor para editar o conteúdo
                              <UserTextEditor
                                tema={repetitivo.tema}
                                value={novoTexto[anotacao._id]} // Passa o texto salvo para editar
                                onChange={(value) => setNovoTexto((prev) => ({
                                  ...prev,
                                  [anotacao._id]: value,
                                }))}
                                onCommentPosted={fetchUserNotes} // Atualiza os comentários na página
                              />
                            ) : (
                              // Exibe o conteúdo formatado com dangerouslySetInnerHTML
                              <>
                                <div
                                  className="quill-content text-gray-700 mb-2"
                                  dangerouslySetInnerHTML={{ __html: anotacao.text }}
                                />
                                <div className="flex justify-between items-center mb-1 mt-2">
                                  <div className="text-sm text-muted-foreground"> Publicado em:
                                    {new Date(anotacao.createdAt).toLocaleDateString("pt-BR")}
                                  </div>
                                  {/* <div className="mt-2 text-sm text-muted-foreground">Por: {comentario.autor}</div> */}
                                </div>   
                              </>
                            )}                          
                            
                              <div className="mt-2">
                                {editando[anotacao._id] ? (
                                  <button
                                    onClick={() => handleSalvarAnotacao(anotacao._id)}
                                    className="px-3 py-1 bg-green-500 text-white rounded mr-2"
                                  >
                                    Salvar
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleEditarAnotacao(anotacao._id, anotacao.text)}
                                    className="px-3 py-1 bg-neutral-400 text-white rounded"
                                  >
                                    Editar
                                  </button>
                                )}
                              </div>
                            
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-muted-foreground">Você ainda não fez nenhuma anotação.</div>
                    )}
                  </CardContent>
                </Card>
                <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <MessageSquare className="h-5 w-5 mr-2 text-slate-500" />
                        Incluir novas anotações
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* Inserir Novos Comentários */}
                      <UserTextEditor tema={repetitivo.tema} onCommentPosted={fetchUserNotes} />
                    </CardContent>
                  </Card>
                {/* Embedded Browser Section */}
                <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
                </div>
              </TabsContent>
            </Tabs>
          </div>
      </div>
    </main>
  );
}