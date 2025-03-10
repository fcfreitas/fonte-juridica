import { useFilter } from "./FilterContext";

export function Filters() {
  const { ramoDireito, setRamoDireito } = useFilter();

  return (
      <div>
        <div>
        </div>
        <div>
        <label className="block text-lg font-semibold mb-2">Ramo do Direito:</label>
          <select
            value={ramoDireito}
            onChange={(e) => setRamoDireito(e.target.value)}
            className="w-full mb-2 px-4 py-2 bg-slate-100 border border-slate-300 rounded focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
          >
            <option value="">Todos</option>
            <option value="DIREITO ADMINISTRATIVO E OUTRAS MATÉRIAS DE DIREITO PÚBLICO">Administrativo</option>
            <option value="DIREITO ASSISTENCIAL">Assistencial</option>
            <option value="DIREITO CIVIL">Civil</option>
            <option value="DIREITO DO CONSUMIDOR">Consumidor</option>
            <option value="DIREITO DO TRABALHO">Trabalho</option>
            <option value="DIREITO ELEITORAL">Eleitoral</option>
            <option value="DIREITO PREVIDENCIÁRIO">Previdenciário</option>
            <option value="DIREITO PROCESSUAL CIVIL E DO TRABALHO">Processual Civil e do Trabalho</option>
            <option value="DIREITO PROCESSUAL PENAL">Processual Penal</option>
            <option value="MILITAR">Militar</option>
            <option value="DIREITO TRIBUTÁRIO">Tributário</option>
          </select>
        </div>
      </div>
  );
}