'use client'

import { useState, useEffect } from "react";
import JulgadosList from "../JulgadosList";
import { Filters } from "../components/Filters";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FiltersDynamic } from "../components/FilterDynamic";
import { useFilter } from "../components/FilterContext";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"; // Shadcn para modal responsivo
import { Button } from "@/components/ui/button";


export const dynamic = "force-dynamic";

export default function JulgadosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);

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
      {/* Botão para abrir filtros no mobile */}
      <div className="md:hidden flex justify-start mb-4 ml-8">
      <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Filtrar</Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-md md:max-w-lg h-auto max-h-[90vh] overflow-y-auto rounded-lg">
            <DialogTitle className="text-lg font-semibold">Filtros</DialogTitle>
            <Filters />
            <FiltersDynamic
              onFilterSelect={(field: string, value: string) => setAssunto(value)}
              ramoDireito={ramoDireito}
            />
            <Button className="mt-4 w-full" onClick={() => (document.activeElement as HTMLElement | null)?.blur()}>
              Fechar
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="group flex w-full">
        {/* Filtros desktop */}
        <div className="hidden md:block w-[300px] h-screen sticky top-0 p-8">
          <div className="bg-white rounded-lg shadow-md p-4 flex-grow overflow-auto min-h-[200px]">
            <Filters />
            <FiltersDynamic onFilterSelect={(field: string, value: string) => setAssunto(value)} ramoDireito={ramoDireito} />
          </div>
        </div>

        {/* Lista de julgados */}
        <div className="flex-1 flex flex-col min-h-screen p-4 md:p-8">
          <div className="space-y-4">
            <JulgadosList />
          </div>
        </div>
      </div>
    </div>
  );
}
