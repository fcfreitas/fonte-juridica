'use client'

import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // Importa useParams
import NotFoundPage from "@/app/not-found"
import { Julgado } from "@/app/julgados-data";

const formatDate = (date: string) => {
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
                const url = `/api/julgados/${params.id}`;
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
        <div className="container mx-auto p-8 flex flex-col md:flex-row">
            <div className="w-1/2">
                <h1 className="text-3xl font-bold mb-4"> { julgado.titulo} </h1>
                <p className="text-lg text-gray-600 mb-2">Leading Case: { julgado.leadingCase}</p>
                <p className="text-lg text-gray-600 mb-2">Data do julgamento: { formatDate(julgado.dataJulgamento)}</p>
                <p className="text-lg text-gray-600 mb-2">Tema: { julgado.tema.toString()}</p>
                <p className="text-lg text-gray-600 mb-2">Ramo: { julgado.ramoDireito}</p>
                <p className="text-lg text-gray-600 mb-2">Assunto: { julgado.relator}</p>
                <h3 className="text-xl font-semi-bold mb-2 mt-4">Tese</h3>
                <p className="text-gray-700">{julgado.tese}</p>
                <p className="text-lg text-gray-600 mb-2">Data da Tese: { formatDate(julgado.dataTese)}</p>
            </div>
            <div className="xl:w-full xl:h-full mb-4 md:mb-0 md:mr-8">
                <embed 
                src={julgado.linkProcesso} 
                type="application/pdf"
                height="100%" 
                width="100%" 
                className="w-full h-screen rounded-lg shadow-md"/>
            </div>

        </div>

        </>
    )
    
    
}