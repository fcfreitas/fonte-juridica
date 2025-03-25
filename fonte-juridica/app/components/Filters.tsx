import { useFilter } from "./FilterContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export function Filters() {
  const { ramoDireito, setRamoDireito } = useFilter();

  return (
    <div className="space-y-2">
    <Label htmlFor="ramo-direito" className="font-semibold text-md">
      Ramo do Direito:
    </Label>
    <Select value={ramoDireito} onValueChange={setRamoDireito}>
      <SelectTrigger id="ramo-direito" className="w-full bg-slate-50 text-md">
        <SelectValue placeholder="Todos" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value=" ">Todos</SelectItem>
        <SelectItem value="DIREITO ADMINISTRATIVO E OUTRAS MATÉRIAS DE DIREITO PÚBLICO">
          Administrativo
        </SelectItem>
        <SelectItem value="DIREITO ASSISTENCIAL">Assistencial</SelectItem>
        <SelectItem value="DIREITO CIVIL">Civil</SelectItem>
        <SelectItem value="DIREITO DO CONSUMIDOR">Consumidor</SelectItem>
        <SelectItem value="DIREITO DO TRABALHO">Trabalho</SelectItem>
        <SelectItem value="DIREITO ELEITORAL">Eleitoral</SelectItem>
        <SelectItem value="DIREITO PREVIDENCIÁRIO">Previdenciário</SelectItem>
        <SelectItem value="DIREITO PROCESSUAL CIVIL E DO TRABALHO">Processual Civil e do Trabalho</SelectItem>
        <SelectItem value="DIREITO PROCESSUAL PENAL">Processual Penal</SelectItem>
        <SelectItem value="MILITAR">Militar</SelectItem>
        <SelectItem value="DIREITO TRIBUTÁRIO">Tributário</SelectItem>
      </SelectContent>
    </Select>
  </div>
  );
}