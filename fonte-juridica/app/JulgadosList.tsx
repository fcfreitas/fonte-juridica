'use client'

import { useState, useEffect } from "react";
import Link from 'next/link';
import { useFilter } from "./components/FilterContext";
import { Julgado } from "./julgados-data";

const formatDate = (date: string | null | undefined): string => {
    if (!date) {
        return "";
    }
    return date.substring(0, 10); // Pega apenas a parte da data (YYYY-MM-DD)
}

export default function JulgadosList() {
    const { court, ramoDireito, assunto } = useFilter();
    const [julgados, setJulgados] = useState<Julgado[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        async function fetchJulgados() {
            let url = "/api/julgados"; // Ajuste para o endpoint correto
            const params = new URLSearchParams();
    
            if (court) params.append("court", court);
            if (ramoDireito) params.append("ramoDireito", ramoDireito);
            if (assunto) {
                // Garantir que o valor do filtro assunto não tenha espaços extras
                params.append("assunto", assunto.trim());
            }
    
            if (params.toString()) {
                url += `?${params.toString()}`;
            }
    
            try {
                const response = await fetch(url);
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
    
        fetchJulgados();
    }, [court, ramoDireito, assunto]); // Atualiza sempre que os filtros mudarem
    
    if (loading) return <div>Carregando...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <div className="grid grid-cols-1 gap-8">
                {julgados.map((j) => (
                    <Link
                        key={j._id}
                        href={"/buscar/" + j._id}
                        className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition duration-300"
                    >
                        <h2 className="text-xl font-serif font-semibold text-slate-800">Tema {j.tema.toString()} - {j.titulo}</h2>
                        <p className="text-gray-600">Área: {j.ramoDireito}</p>
                        <p className="text-gray-600">Tese: {j.tese}</p>
                        <p className="text-gray-600">Data de julgamento: {formatDate(j.dataJulgamento)}</p>
                        <p className="text-gray-600">Situação de Repercussão Geral: {j.situacaoRepGeral}</p>
                        <p className="text-gray-600">Situação do Tema: {j.situacaoTema}</p>
                        <p className="text-gray-600">Recurso Paradigma: {j.leadingCase}</p>
                        {j.assunto_array && j.assunto_array.length > 0 && (
                            <div className="flex gap-2 mt-2">
                                <p>Assuntos:</p>
                                {j.assunto_array.map((assunto_array, index) => (
                                    <span key={index} className="flex items-center gap-1 text-sm bg-gray-100 p-1 rounded-lg">
                                        {assunto_array}
                                    </span>
                                ))}
                            </div>
                        )}
                    </Link>
                ))}
            </div>
        </div>
    );
}
