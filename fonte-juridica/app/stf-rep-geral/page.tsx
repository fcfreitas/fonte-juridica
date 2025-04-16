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
import { Filter } from "lucide-react";

export default function JulgadosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const { ramoDireito, setRamoDireito, assunto, setAssunto, situacaoRepGeral, setSituacaoRepGeral, situacaoTema, setSituacaoTema, searchText, setSearchText, searchTema, setSearchTema } = useFilter();


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
    console.log("📌 Aplicando filtros:", { ramoDireito, assunto, situacaoRepGeral, situacaoTema, searchText });

    const query = new URLSearchParams();
    if (assunto) query.append("assunto", assunto);
    if (ramoDireito) query.append("ramoDireito", ramoDireito);
    if (situacaoRepGeral) query.append("situacaoRepGeral", situacaoRepGeral);
    if (situacaoTema) query.append("situacaoTema", situacaoTema);
    if(searchText) query.append("searchText", searchText);
    if(searchTema) query.append("searchTema", searchTema);

    router.push(`?${query.toString()}`);
    setIsOpen(false);
  };

  const clearFilters = () => {
    setRamoDireito("")
    setAssunto("")
    setSituacaoRepGeral("")
    setSituacaoTema("")
    setSearchText("")
    setSearchTema("")
  }

  return (
    <div className="container mx-auto p-3 md:px-10">
    {/*Versão Desktop */}
      <div className="bg-slate-50 w-full flex items-center">
        <h2 className="text-xl font-semibold leading-none text-2xl md:text-3xl font-bold text-slate-800">STF - Temas de Repercussão Geral</h2>
      </div>
      
      {/* Botão para abrir filtros no mobile */}
      <div className="md:hidden flex justify-end mb-4 z-50 fixed top-[170px] w-full pr-10">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" onClick={() => setIsOpen(true)}>
              Filtrar
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-md md:max-w-lg h-auto max-h-[90vh] overflow-y-auto rounded-lg">
            <DialogTitle className="text-lg font-semibold">Filtros</DialogTitle>
            <Filters onFilter={() => {}} />
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

      <div className="group flex w-full pt-8">
        {/* Filtros desktop */}
        <div className="hidden md:block w-[300px] h-screen hidden space-y-2 bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <Filter size={16} />
            Filtros
          </h3>
            <Filters onFilter={() => {}} />
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

        {/* Lista de julgados */}
        <main className="flex-1 px-4 md:px-6">
          <JulgadosList />
        </main>
      </div>
    </div>
  );
}
