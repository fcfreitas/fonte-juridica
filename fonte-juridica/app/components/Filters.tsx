import { useFilter } from "./FilterContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react";
import { useState } from "react";

type FilterParams = {
  text?: string;
  tema?: string;
};

type FreeTextFilterProps = {
  onFilter: (filters: FilterParams) => void;
};

export function Filters({ onFilter }: FreeTextFilterProps) {      ////dentro do () { onFilter }: FreeTextFilterProps
  const {
    ramoDireito,
    setRamoDireito,
    searchText,
    setSearchText,
    searchTema,
    setSearchTema,
  } = useFilter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newText = e.target.value
      setSearchText(newText);
      onFilter({text: newText, tema: searchTema });
      // console.log("searchText:", searchText)
    };

    const handleChangeTema = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTema = e.target.value
      setSearchTema(newTema);
      onFilter({text: searchText, tema: newTema });
      // console.log("searchText:", searchText)
    };

  return (
    <div className="space-y-6">
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar por termo..."
          value={searchText}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400"
        />
        <Search size={16} className="absolute right-3 top-2.5 text-slate-400" />
      </div>
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Número do tema..."
          value={searchTema}
          onChange={handleChangeTema}
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400"
        />
        <Search size={16} className="absolute right-3 top-2.5 text-slate-400" />
      </div>
      <div className="relative mb-6">
        <Label htmlFor="ramo-direito" className="font-semibold">
          Ramo do Direito:
        </Label>
        <Select value={ramoDireito} onValueChange={setRamoDireito}>
          <SelectTrigger id="ramo-direito" className="w-full bg-slate-50 mb-6">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value=" ">Todos</SelectItem>
            <SelectItem value="Administrativo">Administrativo</SelectItem>
            <SelectItem value="Ambiental">Ambiental</SelectItem>
            <SelectItem value="Civil">Civil</SelectItem>
            <SelectItem value="Consumidor">Consumidor</SelectItem>
            <SelectItem value="Trabalho">Trabalho</SelectItem>
            <SelectItem value="Eleitoral">Eleitoral</SelectItem>
            <SelectItem value="Internacional">Internacional</SelectItem>
            <SelectItem value="Penal">Penal</SelectItem>
            <SelectItem value="Penal Militar">Penal Militar</SelectItem>
            <SelectItem value="Previdenciário">Previdenciário</SelectItem>
            <SelectItem value="Processual Civil e do Trabalho">Processual Civil e do Trabalho</SelectItem>
            <SelectItem value="Processual Penal">Processual Penal</SelectItem>
            <SelectItem value="Processual Penal Militar">Processual Penal Militar</SelectItem>
            <SelectItem value="Registral">Registral</SelectItem>
            <SelectItem value="Militar">Militar</SelectItem>
            <SelectItem value="Tributário">Tributário</SelectItem>
          </SelectContent>
        </Select>
      </div>
  </div>
  );
}