'use client'

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface FilterDynamicProps {
  onFilterSelect: (field: string, value: string) => void;
  ramoDireito: string; // Recebe o ramoDireito como prop
}

export function FiltersDynamic({ onFilterSelect, ramoDireito }: FilterDynamicProps) {
  const [values, setValues] = useState<string[]>([]);
  const [situacaoRepGeralValues, setSituacaoRepGeralValues] = useState<string[]>([]); // Valores para 'situacaoRepGeral'
  const [situacaoTemaValues, setSituacaoTemaValues] = useState<string[]>([]); // Valores para 'situacaoTema'

  const [assunto, setAssunto] = useState(""); 
  const [situacaoRepGeral, setSituacaoRepGeral] = useState(""); 
  const [situacaoTema, setSituacaoTema] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchValues() {
      try {
        const url = new URL(process.env.NEXT_PUBLIC_SITE_URL+"/api/filtros", window.location.href);
        if (ramoDireito) {
          url.searchParams.set("ramoDireito", ramoDireito);
        }

        const response = await fetch(url.toString());
        const data = await response.json();

        console.log("📥 Valores recebidos da API:", data);

        if (Array.isArray(data.assuntos)) {
          setValues(data.assuntos); // Setando os valores de 'assunto'
        }
        if (Array.isArray(data.situacaoRepGeralValues)) {
          setSituacaoRepGeralValues(data.situacaoRepGeralValues); // Setando os valores de 'situacaoRepGeral'
        }
        if (Array.isArray(data.situacaoTemaValues)) {
          setSituacaoTemaValues(data.situacaoTemaValues); // Setando os valores de 'situacaoTema'
        } else {
          console.error("Formato inválido recebido:", data);
        }
      } catch (error) {
        console.error("Erro ao buscar valores:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchValues();
  }, [ramoDireito]); // Quando 'ramoDireito' mudar, a função é chamada novamente.

  const handleSelectChange = (e: string, filterType: string) => {
    const value = e.trim(); // Remover espaços extras
    console.log(`🎯 ${filterType} selecionado para filtragem:`, value);

    switch (filterType) {
      case "assunto":
        setAssunto(value);
        onFilterSelect("assunto", value); // Envia para o componente pai
        break;
      case "situacaoRepGeral":
        setSituacaoRepGeral(value);
        onFilterSelect("situacaoRepGeral", value); // Envia para o componente pai
        break;
      case "situacaoTema":
        setSituacaoTema(value);
        onFilterSelect("situacaoTema", value); // Envia para o componente pai
        break;
      default:
        console.warn(`⚠️ Filtro "${filterType}" não reconhecido!`);
        return;
    }
  };

  return (
  <>
    <div className="space-y-2">
    <Label htmlFor="assunto" className="font-semibold">Assunto:</Label>
    <Select 
      value={assunto} 
      onValueChange={(e) => handleSelectChange(e, "assunto")}
      disabled={loading || values.length === 0}
    >
      <SelectTrigger id="assunto" className="w-full bg-slate-50">
        {loading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Carregando...</span>
          </div>
        ) : (
          <SelectValue placeholder="Todos" />
        )}
      </SelectTrigger>
      <SelectContent>
        <SelectItem value=" ">Todos</SelectItem>
        {values.map((value) => (
          <SelectItem key={value} value={value}>
            {value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    </div>

    <div className="space-y-2">
    <Label htmlFor="situacao-rep-geral" className="font-semibold">Situação de Repercussão Geral:</Label>
    <Select 
      value={situacaoRepGeral} 
      onValueChange={(e) => handleSelectChange(e, "situacaoRepGeral")}
      disabled={loading || situacaoRepGeralValues.length === 0}
    >
      <SelectTrigger id="situacao-rep-geral" className="w-full bg-slate-50">
        {loading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Carregando...</span>
          </div>
        ) : (
          <SelectValue placeholder="Todos" />
        )}
      </SelectTrigger>
      <SelectContent>
        <SelectItem value=" ">Todos</SelectItem>
        {situacaoRepGeralValues.map((value) => (
          <SelectItem key={value} value={value}>
            {value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    </div>

    <div className="space-y-2">
    <Label htmlFor="situacao-tema" className="font-semibold">Situação do Tema:</Label>
    <Select 
      value={situacaoTema} 
      onValueChange={(e) => handleSelectChange(e, "situacaoTema")}
      disabled={loading || situacaoTemaValues.length === 0}
    >
      <SelectTrigger id="situacao-tema" className="w-full bg-slate-50">
        {loading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Carregando...</span>
          </div>
        ) : (
          <SelectValue placeholder="Todos" />
        )}
      </SelectTrigger>
      <SelectContent>
        <SelectItem value=" ">Todos</SelectItem>
        {situacaoTemaValues.map((value) => (
          <SelectItem key={value} value={value}>
            {value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    </div>
  </>
  );
}






///////////////////

// <div className="space-y-2">
// {/* Filtro de Assunto */}
// <div>
//   <label className="block text-lg font-semibold mb-2">Assunto:</label>
//   <select
//     value={assunto}
//     onChange={(e) => handleSelectChange(e, "assunto")}
//     className="w-full mb-2 px-4 py-2 bg-slate-100 border border-slate-300 rounded focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
//     disabled={loading || values.length === 0}
//   >
//     {loading ? (
//       <option>Carregando...</option>
//     ) : (
//       <>
//         <option value="">Todos</option>
//         {values.map((value) => (
//           <option key={value} value={value}>
//             {value}
//           </option>
//         ))}
//       </>
//     )}
//   </select>
// </div>

// {/* Filtro de SituacaoRepGeral */}
// <div>
//   <label className="block text-lg font-semibold mb-2">Situação Rep. Geral:</label>
//   <select
//     value={situacaoRepGeral}
//     onChange={(e) => handleSelectChange(e, "situacaoRepGeral")}
//     className="w-full mb-2 px-4 py-2 bg-slate-100 border border-slate-300 rounded focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
//     disabled={loading || situacaoRepGeralValues.length === 0}
//   >
//     {loading ? (
//       <option>Carregando...</option>
//     ) : (
//       <>
//         <option value="">Todos</option>
//         {situacaoRepGeralValues.map((value) => (
//           <option key={value} value={value}>
//             {value}
//           </option>
//         ))}
//       </>
//     )}
//   </select>
// </div>

// {/* Filtro de SituacaoTema */}
// <div>
//   <label className="block text-lg font-semibold mb-2">Situação Tema:</label>
//   <select
//     value={situacaoTema}
//     onChange={(e) => handleSelectChange(e, "situacaoTema")}
//     className="w-full mb-2 px-4 py-2 bg-slate-100 border border-slate-300 rounded focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
//     disabled={loading || situacaoTemaValues.length === 0}
//   >
//     {loading ? (
//       <option>Carregando...</option>
//     ) : (
//       <>
//         <option value="">Todos</option>
//         {situacaoTemaValues.map((value) => (
//           <option key={value} value={value}>
//             {value}
//           </option>
//         ))}
//       </>
//     )}
//   </select>
// </div>
// </div>