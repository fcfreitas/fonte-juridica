"use client";

import { useState, useEffect } from "react";
import JulgadosList from "../JulgadosList";
import { Filters } from "../components/Filters";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FiltersDynamic } from "../components/FilterDynamic";

export default function JulgadosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedValue, setSelectedValue] = useState("");

  useEffect(() => {
    if (status === "loading") return; // Aguarda carregar a sessão
    if (!session) {
      router.push("/login"); // Redireciona se o usuário NÃO estiver autenticado
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <p className="text-center text-lg">Carregando...</p>;
  }

  if (!session) {
    return null; // Retorna nada enquanto redireciona
  }

  return (
    <div className="container mx-auto p-8 flex flex-col h-full">
      <h1 className="text-4xl font-bold mb-4 ml-8">Julgados</h1>
      <div className="group flex w-full">
        <div className="flex flex-col h-full">
          <div className='hidden md:block w-[300px] h-screen sticky top-0 p-8'>
            <div className="bg-white rounded-lg shadow-md p-4 flex-grow overflow-auto min-h-[200px]">
              <Filters />
              <FiltersDynamic onFilterSelect={setSelectedValue} />
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col min-h-screen p-8">
          <div className="space-y-4">
            <JulgadosList />
          </div>
        </div>
      </div>
    </div>
  );
}
