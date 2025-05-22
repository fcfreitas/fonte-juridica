"use client";

import { useEffect, useState } from "react";
import { Check, ChevronDown, Loader2, Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFilter } from "./FilterContextRepet";

export type FilterParams = { text?: string; tema?: string };

interface FiltersRepetProps {
  onFilterSelect: (
    field: "ramoDireito" | "assunto" | "situacaoTema",
    value: string
  ) => void;
  onFilter: (filters: FilterParams) => void;
}

export function FiltersRepet({ onFilterSelect, onFilter }: FiltersRepetProps) {
  const {
    ramoDireito,
    setRamoDireito,
    assunto,
    setAssunto,
    situacaoTema,
    setSituacaoTema,
    searchText,
    setSearchText,
    searchTema,
    setSearchTema,
  } = useFilter();

  const [ramosValues, setRamosValues] = useState<string[]>([]);
  const [assuntoValues, setAssuntoValues] = useState<string[]>([]);
  const [situacaoValues, setSituacaoValues] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [openPopover, setOpenPopover] =
    useState<{ ramo: boolean; assunto: boolean; situacao: boolean }>({
      ramo: false,
      assunto: false,
      situacao: false,
    });

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    async function fetchOptions() {
      try {
        const url = new URL(
          `${process.env.NEXT_PUBLIC_SITE_URL}/api/filtros-repetitivos`
        );
        if (ramoDireito) url.searchParams.set("ramoDireito", ramoDireito);

        const res = await fetch(url.toString());
        const data = await res.json();

        if (!isMounted) return;

        setRamosValues(
          Array.isArray(data.ramosDireito) ? data.ramosDireito : []
        );
        setAssuntoValues(Array.isArray(data.assuntos) ? data.assuntos : []);
        setSituacaoValues(
          Array.isArray(data.situacaoTema) ? data.situacaoTema : []
        );
      } catch (err) {
        console.error("Erro ao carregar filtros", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchOptions();
    return () => {
      isMounted = false;
    };
  }, [ramoDireito]);

  const handleSelect = (
    type: "ramo" | "assunto" | "situacao",
    value: string
  ) => {
    switch (type) {
      case "ramo":
        setRamoDireito(value);
        onFilterSelect("ramoDireito", value);
        setOpenPopover((o) => ({ ...o, ramo: false }));
        break;
      case "assunto":
        setAssunto(value);
        onFilterSelect("assunto", value);
        setOpenPopover((o) => ({ ...o, assunto: false }));
        break;
      case "situacao":
        setSituacaoTema(value);
        onFilterSelect("situacaoTema", value);
        setOpenPopover((o) => ({ ...o, situacao: false }));
        break;
    }
  };

  const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const txt = e.target.value;
    setSearchText(txt);
    onFilter({ text: txt, tema: searchTema });
  };

  const handleChangeTema = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tmp = e.target.value;
    setSearchTema(tmp);
    onFilter({ text: searchText, tema: tmp });
  };

  // Componente auxiliar para popovers
  const SelectPopover = ({
    label,
    open,
    onOpenChange,
    selected,
    options,
    type,
  }: {
    label: string;
    open: boolean;
    onOpenChange: (v: boolean) => void;
    selected: string;
    options: string[];
    type: "ramo" | "assunto" | "situacao";
  }) => (
    <div className="space-y-2">
      <Label className="font-semibold">{label}</Label>
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full bg-slate-50 py-2"
            disabled={loading || options.length === 0}
          >
            <div className="flex w-full items-center justify-between">
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Carregando...</span>
                </div>
              ) : (
                <span className="truncate max-w-[calc(100%-20px)]">
                  {selected || "Todos"}
                </span>
              )}
              <ChevronDown className="h-4 w-4 opacity-50 ml-2" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <div className="max-h-[300px] overflow-auto">
            {/* Opção "Todos" */}
            <button
              type="button"
              className={cn(
                "relative flex w-full cursor-pointer items-center rounded-sm py-1.5 pl-8 pr-2 text-sm hover:bg-accent hover:text-accent-foreground",
                selected === '' && 'bg-accent text-accent-foreground'
              )}
              onClick={() => handleSelect(type, '')}
            >
              {selected === '' && (
                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                  <Check className="h-4 w-4" />
                </span>
              )}
              Todos
            </button>
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                className={cn(
                  "relative flex w-full cursor-pointer items-center rounded-sm py-1.5 pl-8 pr-2 text-sm hover:bg-accent hover:text-accent-foreground",
                  selected === opt && 'bg-accent text-accent-foreground'
                )}
                onClick={() => handleSelect(type, opt)}
              >
                {selected === opt && (
                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    <Check className="h-4 w-4" />
                  </span>
                )}
                <span className="truncate">{opt}</span>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Pesquisa livre */}
      <div className="space-y-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Número do tema..."
            value={searchTema}
            onChange={handleChangeTema}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-slate-400"
          />
          <Search size={16} className="absolute right-3 top-2.5 text-slate-400" />
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por termo..."
            value={searchText}
            onChange={handleChangeText}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-slate-400"
          />
          <Search size={16} className="absolute right-3 top-2.5 text-slate-400" />
        </div>
      </div>

      {/* Popovers de filtro */}
      <SelectPopover
        label="Ramo Direito"
        open={openPopover.ramo}
        onOpenChange={(v) => setOpenPopover((o) => ({ ...o, ramo: v }))}
        selected={ramoDireito}
        options={ramosValues}
        type="ramo"
      />

      <SelectPopover
        label="Assunto"
        open={openPopover.assunto}
        onOpenChange={(v) => setOpenPopover((o) => ({ ...o, assunto: v }))}
        selected={assunto}
        options={assuntoValues}
        type="assunto"
      />

      <SelectPopover
        label="Situação do Tema"
        open={openPopover.situacao}
        onOpenChange={(v) => setOpenPopover((o) => ({ ...o, situacao: v }))}
        selected={situacaoTema}
        options={situacaoValues}
        type="situacao"
      />
    </div>
  );
}