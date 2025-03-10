'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import JulgadosList from "../JulgadosList";
import { Filters } from "../components/Filters";
import { FiltersDynamic } from "../components/FilterDynamic";
import { useFilter } from "../components/FilterContext";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function JulgadosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const { ramoDireito, setRamoDireito, assunto, setAssunto, situacaoRepGeral, setSituacaoRepGeral, situacaoTema, setSituacaoTema } = useFilter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push(process.env.NEXT_PUBLIC_SITE_URL + "/login");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <p className="text-center text-lg">Carregando...</p>;
  }

  if (!session) {
    return null;
  }

  const handleApplyFilters = () => {
    console.log("📌 Aplicando filtros:", { ramoDireito, assunto, situacaoRepGeral, situacaoTema });

    const query = new URLSearchParams();
    if (assunto) query.append("assunto", assunto);
    if (ramoDireito) query.append("ramoDireito", ramoDireito);
    if (situacaoRepGeral) query.append("situacaoRepGeral", situacaoRepGeral);
    if (situacaoTema) query.append("situacaoTema", situacaoTema);

    router.push(`?${query.toString()}`);
    setIsOpen(false);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4">STF - Temas de Repercussão Geral</h1>

      {/* Botão para abrir filtros no mobile */}
      <div className="md:hidden flex justify-start mb-4">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" onClick={() => setIsOpen(true)}>
              Filtrar
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-md md:max-w-lg h-auto max-h-[90vh] overflow-y-auto rounded-lg">
            <DialogTitle className="text-lg font-semibold">Filtros</DialogTitle>
            <Filters />
            <FiltersDynamic
              onFilterSelect={(field, value) => {
                if (field === "assunto") setAssunto(value);
                else if (field === "ramoDireito") setRamoDireito(value);
                else if (field === "situacaoRepGeral") setSituacaoRepGeral(value);
                else if (field === "situacaoTema") setSituacaoTema(value);
              }}
              ramoDireito={ramoDireito}
            />
            <Button className="mt-4 w-full" onClick={handleApplyFilters}>
              Aplicar Filtros
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="group flex w-full">
        {/* Filtros desktop */}
        <div className="hidden md:block w-[300px] h-screen sticky top-0 p-8">
          <div className="bg-white rounded-lg shadow-md p-4">
            <Filters />
            <FiltersDynamic
              onFilterSelect={(field, value) => {
                if (field === "assunto") setAssunto(value);
                else if (field === "ramoDireito") setRamoDireito(value);
                else if (field === "situacaoRepGeral") setSituacaoRepGeral(value);
                else if (field === "situacaoTema") setSituacaoTema(value);
              }}
              ramoDireito={ramoDireito}
            />
          </div>
        </div>

        {/* Lista de julgados */}
        <div className="flex-1 flex flex-col p-4">
          <JulgadosList />
        </div>
      </div>
    </div>
  );
}
