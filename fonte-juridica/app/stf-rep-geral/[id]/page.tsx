'use client'

import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // Importa useParams
import NotFoundPage from "@/app/not-found"
import { Julgado } from "@/app/julgados-data";
import Link from "next/link";

const formatDate = (date: string | null | undefined): string => {
    if (!date) {
        return "";
    }
    return date.substring(0, 10); // Pega apenas a parte da data (YYYY-MM-DD)
}

export default function JulgadoDetailPage() {
    // const julgado = julgados.find( p=> p.id === params.id)
    const params = useParams()
    const [julgado, setJulgado] = useState<Julgado | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!params?.id) return;

        async function fetchJulgado() {
            try {
                const url = process.env.NEXT_PUBLIC_SITE_URL+`/api/julgados/${params.id}`;
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error("Julgado não encontrado");
                }

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

    if (loading) {
        return <p className="text-center text-gray-500">Carregando...</p>;
    }

    if (!julgado) {
        return <NotFoundPage />;
    }

    return (
        <>
        <div className="container mx-auto p-8 flex col-1 md:flex-row">
            <div className="w-full">
                <h1 className="text-3xl font-bold mb-8 h-30"> Tema {julgado.tema.toString()} - {julgado.titulo} </h1>
                <p className="text-lg text-gray-600 mb-2">Área do Direito: { julgado.ramoDireito}</p>
                <p className="text-lg text-gray-600 mb-2">Descrição: { julgado.descricao}</p>
                <h3 className="text-xl font-semi-bold mb-2 mt-4">Tese</h3>
                <p className="text-gray-700">{julgado.tese}</p>
                <p className="text-lg text-gray-600 mb-2">Data de julgamento: { formatDate(julgado.dataJulgamento)}</p>
                <p className="text-lg text-gray-600 mb-2">Situação de Repercussão Geral: { julgado.situacaoRepGeral}</p>
                <p className="text-lg text-gray-600 mb-2">Situação do Tema: { julgado.situacaoTema}</p>
                <p className="text-lg  text-gray-600 mb-2">Recurso Paradigma: { julgado.leadingCase}</p>
                <p className="text-lg text-gray-600 mb-2">Relator: { julgado.relator}</p>
                <p className="text-lg text-gray-600 mb-2">Data da Tese: { formatDate(julgado.dataTese)}</p>
                <Link href={julgado.linkProcesso} target="_blank" className="text-md font-bold text-gray-600 mb-2">
                    <link rel="icon" href="/favicon.ico" />
                    Link do processo
                </Link>
            </div>
        </div>
        </>
    )
    
    
}