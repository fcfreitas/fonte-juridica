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
  const [comentarios, setComentarios] = useState<{ text: string, createdAt: string }[]>([]);
  const [loading, setLoading] = useState(true);

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

        {/* Editor de Comentários */}
        <AdminTextEditor tema={julgado.tema} onCommentPosted={() => setComentarios} />

        {/* Seção de Comentários */}
        <h3 className="text-xl font-semibold mt-6">Comentários</h3>
        {comentarios.length > 0 ? (
          comentarios.map((comentario, index) => (
            <div key={index} className="border p-4 rounded shadow-md mb-2">
              <div className="quill-content text-gray-700" dangerouslySetInnerHTML={{ __html: comentario.text }} ></div>
              <p className="text-sm text-gray-500">Publicado em {formatDate(comentario.createdAt)}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Nenhum comentário ainda.</p>
        )}
      </div>
    </div>
  );
}
