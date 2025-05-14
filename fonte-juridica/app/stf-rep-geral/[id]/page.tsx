"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import NotFoundPage from "@/app/not-found";
import { Julgado } from "@/app/julgados-data";
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

export default function JulgadoDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [julgado, setJulgado] = useState<Julgado | null>(null);
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

    async function fetchJulgado() {
      setLoading(true);
      try {
        const response = await fetch(`/api/julgados/${params.id}`);
        if (!response.ok) throw new Error("Julgado não encontrado");

        const data: Julgado = await response.json();
        setJulgado(data);
      } catch (error) {
        console.error("Erro ao buscar julgado:", error);
        setJulgado(null);
      } finally {
        setLoading(false);
      }
    }

    fetchJulgado();
  }, [params?.id, ]);

  // Buscar os comentários relacionados ao julgado
  useEffect(() => {
    if (!params?.id) return;

    async function fetchComentariosInicial() {
      try {
        const response = await fetch(`/api/publish-text?tema=${julgado?.tema}`);
        if (!response.ok) throw new Error("Erro ao buscar comentários");

        const data = await response.json();
        setComentarios(data);
      } catch (error) {
        console.error("Erro ao buscar comentários:", error);
      }
    }

    fetchComentariosInicial();
  }, [julgado?.tema]);

  const fetchComentarios = async () => {
    try {
      const response = await fetch(`/api/publish-text?tema=${julgado?.tema}`);
      if (!response.ok) throw new Error("Erro ao buscar comentários");

      const data = await response.json();
      setComentarios(data);
    } catch (error) {
      console.error("Erro ao buscar comentários:", error);
    }
  }

  // Buscar as anotações do usuário relacionadas ao julgado
  useEffect(() => {
    if (!session || !julgado?.tema) return;

    async function fetchUserNotesInicial() {
      try {
        const response = await fetch(`/api/publish-user-notes?userId=${session?.user.id}&tema=${julgado?.tema}`);
        if (!response.ok) throw new Error("Erro ao buscar anotações");

        const data = await response.json();
        setUserNotes(data);
      } catch (error) {
        console.error("Erro ao buscar anotações:", error);
      }
    }

    fetchUserNotesInicial();
  }, [julgado?.tema, session?.user.id]);

  const fetchUserNotes = async () => {
    try {
      const response = await fetch(`/api/publish-user-notes?userId=${session?.user.id}&tema=${julgado?.tema}`);
      if (!response.ok) throw new Error("Erro ao buscar anotações");

      const data = await response.json();
      setUserNotes(data);
    } catch (error) {
      console.error("Erro ao buscar anotações:", error);
    }
  }


  useEffect(() => {
    if (!session || !julgado?.tema) return;

    async function fetchLidoStatus() {
      try {
        const response = await fetch(`/api/temas-lidos?userId=${session?.user.id}&tema=${julgado?.tema}`);
        console.log('Parametros de busca dos comentarios', julgado?.tema, session?.user.id)
        const data = await response.json();
        setLido(data?.lido ?? false);
      } catch (error) {
        console.error("Erro ao buscar status de leitura:", error);
      }
    }

    fetchLidoStatus();
  }, [session, julgado?.tema]);

  useEffect(() => {
    if (!session || !julgado?.tema) return;
    async function fetchDestaqueStatus() {
      try {
        const response = await fetch(`/api/tema-destaque?userId=${session?.user.id}&tema=${julgado?.tema}`);
        console.log('Parametros de busca dos comentarios', julgado?.tema, session?.user.id)
        const data = await response.json();
        setDestacado(data?.destacado ?? false);
      } catch (error) {
        console.error("Erro ao buscar status de destaque:", error);
      }
    }

    fetchDestaqueStatus();
  }, [session, julgado?.tema]);

  const toggleLido = async () => {
    if (!session || !julgado?.tema) return;

    const novoEstado = !lido; // Alterna entre true/false

    setLoading(true);
    try {
      const response = await fetch("/api/temas-lidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id, tema: julgado?.tema, lido: novoEstado }),
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
    if (!session || !julgado?.tema) return alert("Você precisa estar logado para destacar.");

    const novoEstado = !destacado; // Alterna entre true/false

    try {
      const response = await fetch("/api/tema-destaque", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id, tema: julgado?.tema, destacado: novoEstado }),
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
      const response = await fetch("/api/publish-text", {
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
      const response = await fetch("/api/publish-user-notes", {
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

  if (!julgado) {
    return <NotFoundPage />;
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-6">
            <div className="space-y-3 mb-4"><div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
              <div className="flex flex-col md:flex-row items-center gap-2 text-lg text-muted-foreground">
                <Badge variant="outline" className="bg-slate-100">
                  Tema {julgado.tema.toString()}
                </Badge>

                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  {julgado.situacaoTema}
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

                <h1 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight mb-6 text-justify">{julgado.titulo}</h1>
                {julgado.tese ? (<Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <FileCheck className="h-5 w-5 mr-2 text-slate-500" />
                      Tese
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700 text-justify">{julgado.tese}</p>
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
                  <Badge variant="outline" className="bg-slate-100">
                    {julgado.leadingCase}
                  </Badge>
                {julgado.linkProcesso && (
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
                )}
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
                    <div className="text-slate-700 mb-4">Direito {julgado.ramoDireito}</div>
                    <div className="flex justify-start items-center gap-2">
                        <div className="text-sm font-medium text-slate-500">Assuntos:</div>
                        <div className="flex flex-wrap gap-2 text-sm font-medium text-slate-600">              
                          {julgado.assunto_array && julgado.assunto_array.length > 0 && (
                            julgado.assunto_array.slice(1).map((assunto, index) => (
                              <Badge key={Number(index)} variant="secondary" className="text-sm p-1 rounded-lg">
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
                    <div className="text-slate-700">{julgado.descricao}</div>
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
                      <div>
                        <p className="text-sm font-medium text-slate-500">Situação de Repercussão Geral</p>
                        <p className="text-slate-700">{julgado.situacaoRepGeral}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">Situação do Tema</p>
                        <p className="text-slate-700">{julgado.situacaoTema}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-slate-500" />
                        Datas
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <p className="text-sm font-medium text-slate-500">Data de Repercussão Geral</p>
                        <p className="text-slate-700">{julgado.dataJulgamento}</p>
                      </div>
                      {julgado.dataTese && (
                        <div>
                          <p className="text-sm font-medium text-slate-500">Data da Tese</p>
                          <p className="text-slate-700">{julgado.dataTese}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <User className="h-5 w-5 mr-2 text-slate-500" />
                      Relator
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-slate-700">{julgado.relator}</div>
                  </CardContent>
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
                                tema={julgado.tema}
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
                      <AdminTextEditor tema={julgado.tema} onCommentPosted={fetchComentarios} />
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
                                tema={julgado.tema}
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
                      <UserTextEditor tema={julgado.tema} onCommentPosted={fetchUserNotes} />
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