// components/JulgadoCard.tsx
import { BookIcon, BookOpen } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface JulgadoCardProps {
  j: any;
  temasLidos: Record<number, boolean>;
  toggleLido: (tema: number) => void;
  formatDate: (date: string) => string;
}

export function JulgadoCard({ j, temasLidos, toggleLido, formatDate }: JulgadoCardProps) {
  const lido = !!temasLidos[Number(j.tema)];

  return (
    <Card
      key={j._id}
      className={`overflow-hidden transition-all duration-200 z-1 ${
        lido ? "border-l-4 border-l-emerald-500" : "border-l-4 border-l-red-400"
      }`}
    >
      <CardHeader className="bg-slate-50 pb-2">
        <div className="flex justify-between items-start">
          <Link
            href={`/stf-rep-geral/${j._id}`}
            className="block"
            target="_blank"
          >
            <CardTitle className="text-lg font-bold text-slate-800 text-justify">
              {j.tema.toString()} - {j.titulo}
            </CardTitle>
          </Link>
        </div>
        <div className="flex items-center justify-between mt-1">
          <div>
            <div className="space-y-1">
              <p className="text-slate-600 font-medium text-sm">
                Recurso Paradigma:{" "}
                <span className="font-normal">{j.leadingCase}</span>
              </p>
            </div>
          </div>
          <Button
            variant={lido ? "outline" : "secondary"}
            size="sm"
            className="h-9 gap-2"
            onClick={() => toggleLido(Number(j.tema))}
          >
            {lido ? (
              <>
                <BookIcon size={16} />
                <span>Lido</span>
              </>
            ) : (
              <>
                <BookOpen size={16} />
                <span>Marcar como Lido</span>
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <p className="text-slate-700 text-justify mb-2 font-semibold text-sm">
              Tese:{" "}
              <span className="font-normal text-slate-600 text-justify">
                {/* {j.tese
                  ? j.tese.slice(0, 250) +
                    (j.tese.length > 250 ? " (...)" : "")
                  : "Pendente."} */}
                {j.tese ? j.tese : "Pendente."}
              </span>
            </p>
            <p className="text-slate-600 font-medium text-sm">
              {j.dataTese ? "Data da Tese: " + formatDate(j.dataTese) : ""}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-slate-50 flex flex-col items-start flex-wrap gap-2 pt-3 pb-3">
        <div>
          <p className="text-sm text-slate-700 mt-1 font-medium">
            Ramo do Direito:{" "}
            <span className="font-normal">{j.ramoDireito}</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-slate-700 mr-2">Assuntos:</p>
          {j.assunto_array &&
            j.assunto_array.length > 0 &&
            j.assunto_array.slice(1).map((assunto: string, index: number) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-sm bg-gray-100 p-2 rounded-lg"
              >
                <span>{assunto}</span>
              </Badge>
            ))}
          </div>
          <div className="space-y-1">
            <p className="text-slate-600 font-medium text-sm">
              Situação de Repercussão Geral:{" "}
              <span className="font-normal">{j.situacaoRepGeral}</span>
            </p>
            <p className="text-slate-600 font-medium text-sm">
              Situação do Tema:{" "}
              <span className="font-normal">{j.situacaoTema}</span>
            </p>
          </div>        
      </CardFooter>
    </Card>
  );
}
