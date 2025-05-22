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

interface RepetitivoCardProps {
  j: any;
  repetitivosLidos: Record<number, boolean>;
  toggleLido: (repetitivo: number) => void;
  repetitivosDestacados: Record<number, boolean>;
  toggleDestacado: (repetitivo: number) => void;
  formatDate: (date: string) => string;
}

export function RepetitivoCard({ j, repetitivosLidos, toggleLido, repetitivosDestacados, toggleDestacado, formatDate }: RepetitivoCardProps) {
  const lido = !!repetitivosLidos[Number(j.tema)];
  const destacado = !!repetitivosDestacados[Number(j.tema)];

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
            href={`/stj-repetitivos/${j._id}`}
            className="block"
            target="_blank"
          >
            <CardTitle className="text-lg font-bold text-slate-800">
              <span>{j.tema.toString()} - </span>
              <span dangerouslySetInnerHTML={{ __html: j.questaoSubmetidaJulgamento }}/>
            </CardTitle>
          </Link>
        </div>
        <div className="flex items-center justify-between mt-1">
              <div className="text-slate-600 font-normal text-sm">
                Processos:{" "}
                {/* <span className="font-normal">           */}
                  {j.processos &&
                    j.processos.length > 0 &&
                    j.processos.map((processo: any, index: number) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs bg-gray-100 p-1 rounded-xl mr-2"
                      >
                        <span>{processo.processo}</span>
                      </Badge>
                    ))
                  }
                {/* </span> */}
              </div>
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
                {j.teseFirmada ? j.teseFirmada : "Pendente."}
              </span>
            </p>
            <p className="text-slate-600 font-medium text-sm">
              {j.transitoJulgado ? "Trânsito em Julgado: " + formatDate(j.transitoJulgado) : ""}
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
            j.assunto_array.map((assunto: string, index: number) => (
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
              Tema:{" "}
            </span>
              <Badge variant="secondary" className="bg-sky-100 text-sky-700 text-xs">{j.situacaoTema}</Badge>
          </div>
        </div>      
      </CardFooter>
    </Card>
  );
}
