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
  );
}