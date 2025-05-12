// components/JulgadoCard.tsx
import { BookIcon, BookOpen, StarOff, Star } from "lucide-react";
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
  temasDestacados: Record<number, boolean>;
  toggleDestacado: (tema: number) => void;
  formatDate: (date: string) => string;
}

export function JulgadoCard({ j, temasLidos, toggleLido, temasDestacados, toggleDestacado, formatDate }: JulgadoCardProps) {
  const lido = !!temasLidos[Number(j.tema)];
  const destacado = !!temasDestacados[Number(j.tema)];

  return (
    <Card
      key={j._id}
      className={`overflow-hidden transition-all duration-200 z-1 ${
        lido ? "border-l-4 border-l-emerald-500" : "border-l-4 border-l-red-400"
      }`}
    >
      <CardHeader className="bg-slate-50 pb-2 pt-2">
        
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
              <p className="text-slate-600 font-normal text-sm">
                Recurso Paradigma:{" "}
                <span className="font-normal">{j.leadingCase}</span>
              </p>
              <div className="flex justify-end items-center">
                <Button
                  variant={lido ? "outline" : "outline"}
                  size="sm"
                  className="h-8 gap-2 mr-2"
                  onClick={() => toggleLido(Number(j.tema))}
                >
                  {lido ? (
                    <>
                      <BookIcon size={16} fill="oklch(90.1% 0.058 230.902)" />
                      {/* <span>Lido</span> */}
                    </>
                  ) : (
                    <>
                      <BookOpen size={16} />
                      {/* <span>Marcar como Lido</span> */}
                    </>
                  )}
                </Button>
              
                <Button
                  variant={destacado ? "outline" : "outline"}
                  size="sm"
                  className="h-8 gap-2"
                  onClick={() => toggleDestacado(Number(j.tema))}
                >
                  {destacado ? (
                    <>
                      <Star size={16} fill="oklch(82.8% 0.189 84.429)" />
                      {/* <span>Destaque</span> */}
                    </>
                  ) : (
                    <>
                      <StarOff size={16} />
                      {/* <span>Destacar tema</span> */}
                    </>
                  )}
                </Button>
              </div>
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
          <p className="text-sm text-slate-700 mr-2 font-medium">Assuntos:</p>
          {j.assunto_array &&
            j.assunto_array.length > 0 &&
            j.assunto_array.slice(1).map((assunto: string, index: number) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs bg-gray-100 p-1 rounded-xl"
              >
                <span>{assunto}</span>
              </Badge>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 mt-1">
            <div className="flex items-center gap-2">
              <span className="text-slate-600 font-medium text-sm">
                Repercussão Geral:{" "}</span>
                <Badge variant="secondary" className="bg-sky-100 text-sky-700">{j.situacaoRepGeral}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-600 font-medium text-sm">
                Tema:{" "}
              </span>
                <Badge variant="secondary" className="bg-sky-100 text-sky-700">{j.situacaoTema}</Badge>
            </div>
          </div>      
      </CardFooter>
    </Card>
  );
}
