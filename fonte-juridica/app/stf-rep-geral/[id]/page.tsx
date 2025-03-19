"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import NotFoundPage from "@/app/not-found";
import { Julgado } from "@/app/julgados-data";
import Link from "next/link";
import AdminTextEditor from "@/app/components/textEditor";
import "@/styles/quill-styles.css";

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
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<{ [key: string]: boolean }>({});
  const [novoTexto, setNovoTexto] = useState<{ [key: string]: string }>({});

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
  }, [params?.id]);

  // Buscar os comentários relacionados ao julgado
  useEffect(() => {
    if (!params?.id) return;

    async function fetchComentarios() {
      try {
        const response = await fetch(`/api/publish-text?tema=${julgado?.tema}`);
        if (!response.ok) throw new Error("Erro ao buscar comentários");

        const data = await response.json();
        setComentarios(data);
      } catch (error) {
        console.error("Erro ao buscar comentários:", error);
      }
    }

    fetchComentarios();
  }, [julgado?.tema]);

  const handleEditar = (id: string, textoAtual: string) => {
    setEditando((prev) => ({ ...prev, [id]: true }));
    setNovoTexto((prev) => ({ ...prev, [id]: textoAtual }));
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
    <div className="container mx-auto p-8 flex flex-col md:flex-row">
      <div className="w-full">
        <h1 className="text-3xl font-bold mb-8 text-justify">
          Tema {julgado.tema.toString()} - {julgado.titulo}
        </h1>
        <p className="text-lg text-gray-600 mb-2">
          Ramo do Direito: {julgado.ramoDireito}
        </p>
        <h3 className="text-xl font-semibold mb-2 mt-4">Descrição</h3>
        <p className="text-lg text-gray-600 mb-2 text-justify">
          {julgado.descricao}
        </p>
        <h3 className="text-xl font-semibold mb-2 mt-4">Tese</h3>
        <p className="text-lg text-gray-600 mb-6 text-justify">
          {julgado.tese}
        </p>
        <p className="text-lg text-gray-600 mb-2">
          Data de julgamento: {formatDate(julgado.dataJulgamento)}
        </p>
        <p className="text-lg text-gray-600 mb-2">
          Situação de Repercussão Geral: {julgado.situacaoRepGeral}
        </p>
        <p className="text-lg text-gray-600 mb-2">
          Situação do Tema: {julgado.situacaoTema}
        </p>
        <p className="text-lg text-gray-600 mb-2">
          Recurso Paradigma: {julgado.leadingCase}
        </p>
        <p className="text-lg text-gray-600 mb-2">Relator: {julgado.relator}</p>
        <p className="text-lg text-gray-600 mb-2">
          Data da Tese: {formatDate(julgado.dataTese)}
        </p>
        <Link
          href={julgado.linkProcesso}
          target="_blank"
          className="text-md font-bold text-gray-600 mb-2"
        >
          Link do processo
        </Link>

        {/* Editor de Novos Comentários */}
        <AdminTextEditor tema={julgado.tema} onCommentPosted={() => setComentarios} />

        {/* Seção de Comentários */}
        <h3 className="text-xl font-semibold mt-6">Comentários</h3>
        {comentarios.length > 0 ? (
          comentarios.map((comentario) => (
            <div key={comentario._id} className="border p-4 rounded shadow-md mb-2">
              {editando[comentario._id] ? (
                // Exibe o editor para editar o conteúdo
                <AdminTextEditor
                  tema={julgado.tema}
                  value={novoTexto[comentario._id]} // Passa o texto salvo para editar
                  onChange={(value) => setNovoTexto((prev) => ({
                    ...prev,
                    [comentario._id]: value,
                  }))}
                  onCommentPosted={() => setComentarios} // Atualiza os comentários na página
                />
              ) : (
                // Exibe o conteúdo formatado com dangerouslySetInnerHTML
                <div
                  className="quill-content text-gray-700"
                  dangerouslySetInnerHTML={{ __html: comentario.text }}
                />
              )}
          
              <p className="text-sm text-gray-500">
                Publicado em {formatDate(comentario.createdAt)}
              </p>
          
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
                      className="px-3 py-1 bg-blue-500 text-white rounded"
                    >
                      Editar
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">Nenhum comentário ainda.</p>
        )}
      </div>
    </div>
  );
}