'use client'

import { useState, useEffect } from "react";
import JulgadosList from "../JulgadosList";
import { Filters } from "../components/Filters";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FiltersDynamic } from "../components/FilterDynamic";
import { useFilter } from "../components/FilterContext";

export const dynamic = "force-dynamic";

export default function JulgadosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const { ramoDireito, setRamoDireito, assunto, setAssunto } = useFilter(); // ✅ Use o contexto global

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push(process.env.NEXT_PUBLIC_SITE_URL+"/login");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <p className="text-center text-lg">Carregando...</p>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="container mx-auto p-8 flex flex-col h-full">
      <h1 className="text-4xl font-bold mb-4 ml-8">STF - Temas de Repercussão Geral</h1>
      <div className="group flex w-full">
        <div className="flex flex-col h-full">
          <div className="hidden md:block w-[300px] h-screen sticky top-0 p-8">
            <div className="bg-white rounded-lg shadow-md p-4 flex-grow overflow-auto min-h-[200px]">
              <Filters />
              <FiltersDynamic onFilterSelect={(field: string, value: string) => setAssunto(value)} ramoDireito={ramoDireito} />
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
