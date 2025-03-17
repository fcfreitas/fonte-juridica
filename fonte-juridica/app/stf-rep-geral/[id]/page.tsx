"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import NotFoundPage from "@/app/not-found";
import { Julgado } from "@/app/julgados-data";
import Link from "next/link";
import AdminTextEditor from "@/app/components/textEditor";

export const dynamic = "force-dynamic";

const formatDate = (date: string | null | undefined): string => {
  return date ? date.substring(0, 10) : "";
};

export default function JulgadoDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [julgado, setJulgado] = useState<Julgado | null>(null);
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
        <AdminTextEditor />
      </div>
    </div>
  );
}