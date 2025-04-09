"use client"

import { useEffect, useState } from "react"
import { Check, ChevronDown, Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FilterDynamicProps {
  onFilterSelect: (field: string, value: string) => void
  ramoDireito: string // Recebe o ramoDireito como prop
}

export function FiltersDynamic({ onFilterSelect, ramoDireito }: FilterDynamicProps) {
  const [values, setValues] = useState<string[]>([])
  const [situacaoRepGeralValues, setSituacaoRepGeralValues] = useState<string[]>([]) // Valores para 'situacaoRepGeral'
  const [situacaoTemaValues, setSituacaoTemaValues] = useState<string[]>([]) // Valores para 'situacaoTema'

  const [assunto, setAssunto] = useState("")
  const [situacaoRepGeral, setSituacaoRepGeral] = useState("")
  const [situacaoTema, setSituacaoTema] = useState("")

  const [loading, setLoading] = useState(true)

  // Estados para controlar a abertura de cada popover
  const [assuntoOpen, setAssuntoOpen] = useState(false)
  const [situacaoRepGeralOpen, setSituacaoRepGeralOpen] = useState(false)
  const [situacaoTemaOpen, setSituacaoTemaOpen] = useState(false)

  useEffect(() => {
    async function fetchValues() {
      try {
        const url = new URL(process.env.NEXT_PUBLIC_SITE_URL + "/api/filtros", window.location.href)
        if (ramoDireito) {
          url.searchParams.set("ramoDireito", ramoDireito)
        }

        const response = await fetch(url.toString())
        const data = await response.json()

        console.log("📥 Valores recebidos da API:", data)

        if (Array.isArray(data.assuntos)) {
          setValues(data.assuntos) // Setando os valores de 'assunto'
        }
        if (Array.isArray(data.situacaoRepGeralValues)) {
          setSituacaoRepGeralValues(data.situacaoRepGeralValues) // Setando os valores de 'situacaoRepGeral'
        }
        if (Array.isArray(data.situacaoTemaValues)) {
          setSituacaoTemaValues(data.situacaoTemaValues) // Setando os valores de 'situacaoTema'
        } else {
          console.error("Formato inválido recebido:", data)
        }
      } catch (error) {
        console.error("Erro ao buscar valores:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchValues()
  }, [ramoDireito]) // Quando 'ramoDireito' mudar, a função é chamada novamente.

  // Funções separadas para cada tipo de filtro para melhor controle
  const handleAssuntoSelect = (value: string) => {
    const trimmedValue = value.trim()
    console.log(`🎯 Assunto selecionado para filtragem:`, trimmedValue)
    setAssunto(trimmedValue)
    onFilterSelect("assunto", trimmedValue)
    // Fechando o popover explicitamente após um pequeno delay
    setTimeout(() => {
      setAssuntoOpen(false)
    }, 10)
  }

  const handleSituacaoRepGeralSelect = (value: string) => {
    const trimmedValue = value.trim()
    console.log(`🎯 Situação Rep. Geral selecionada para filtragem:`, trimmedValue)
    setSituacaoRepGeral(trimmedValue)
    onFilterSelect("situacaoRepGeral", trimmedValue)
    // Fechando o popover explicitamente após um pequeno delay
    setTimeout(() => {
      setSituacaoRepGeralOpen(false)
    }, 10)
  }

  const handleSituacaoTemaSelect = (value: string) => {
    const trimmedValue = value.trim()
    console.log(`🎯 Situação Tema selecionada para filtragem:`, trimmedValue)
    setSituacaoTema(trimmedValue)
    onFilterSelect("situacaoTema", trimmedValue)
    // Fechando o popover explicitamente após um pequeno delay
    setTimeout(() => {
      setSituacaoTemaOpen(false)
    }, 10)
  }

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="assunto" className="font-semibold">
          Assunto:
        </Label>
        <Popover open={assuntoOpen} onOpenChange={setAssuntoOpen}>
          <PopoverTrigger asChild>
            <Button
              id="assunto"
              variant="outline"
              role="combobox"
              aria-expanded={assuntoOpen}
              className="w-full bg-slate-50 h-auto py-2"
              disabled={loading || values.length === 0}
            >
              <div className="flex w-full items-center justify-between">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Carregando...</span>
                  </div>
                ) : (
                  <span className="truncate max-w-[calc(100%-20px)] text-left">{assunto || "Todos"}</span>
                )}
                <ChevronDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <div className="max-h-[300px] overflow-auto">
              <button
                type="button"
                className={cn(
                  "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground text-left",
                  assunto === " " && "bg-accent text-accent-foreground",
                )}
                onClick={() => handleAssuntoSelect(" ")}
              >
                {assunto === " " && (
                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    <Check className="h-4 w-4" />
                  </span>
                )}
                Todos
              </button>
              {values.map((value) => (
                <button
                  key={value}
                  type="button"
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground text-left",
                    assunto === value && "bg-accent text-accent-foreground",
                  )}
                  onClick={() => handleAssuntoSelect(value)}
                >
                  {assunto === value && (
                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                      <Check className="h-4 w-4" />
                    </span>
                  )}
                  <span className="truncate">{value}</span>
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="situacao-rep-geral" className="font-semibold">
          Situação de Repercussão Geral:
        </Label>
        <Popover open={situacaoRepGeralOpen} onOpenChange={setSituacaoRepGeralOpen}>
          <PopoverTrigger asChild>
            <Button
              id="situacao-rep-geral"
              variant="outline"
              role="combobox"
              aria-expanded={situacaoRepGeralOpen}
              className="w-full bg-slate-50 h-auto py-2"
              disabled={loading || situacaoRepGeralValues.length === 0}
            >
              <div className="flex w-full items-center justify-between">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Carregando...</span>
                  </div>
                ) : (
                  <span className="truncate max-w-[calc(100%-20px)] text-left">{situacaoRepGeral || "Todos"}</span>
                )}
                <ChevronDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <div className="max-h-[300px] overflow-auto">
              <button
                type="button"
                className={cn(
                  "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground text-left",
                  situacaoRepGeral === " " && "bg-accent text-accent-foreground",
                )}
                onClick={() => handleSituacaoRepGeralSelect(" ")}
              >
                {situacaoRepGeral === " " && (
                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    <Check className="h-4 w-4" />
                  </span>
                )}
                Todos
              </button>
              {situacaoRepGeralValues.map((value) => (
                <button
                  key={value}
                  type="button"
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground text-left",
                    situacaoRepGeral === value && "bg-accent text-accent-foreground",
                  )}
                  onClick={() => handleSituacaoRepGeralSelect(value)}
                >
                  {situacaoRepGeral === value && (
                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                      <Check className="h-4 w-4" />
                    </span>
                  )}
                  <span className="truncate">{value}</span>
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="situacao-tema" className="font-semibold">
          Situação do Tema:
        </Label>
        <Popover open={situacaoTemaOpen} onOpenChange={setSituacaoTemaOpen}>
          <PopoverTrigger asChild>
            <Button
              id="situacao-tema"
              variant="outline"
              role="combobox"
              aria-expanded={situacaoTemaOpen}
              className="w-full bg-slate-50 h-auto py-2"
              disabled={loading || situacaoTemaValues.length === 0}
            >
              <div className="flex w-full items-center justify-between">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Carregando...</span>
                  </div>
                ) : (
                  <span className="truncate max-w-[calc(100%-20px)] text-left">{situacaoTema || "Todos"}</span>
                )}
                <ChevronDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <div className="max-h-[300px] overflow-auto">
              <button
                type="button"
                className={cn(
                  "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground text-left",
                  situacaoTema === " " && "bg-accent text-accent-foreground",
                )}
                onClick={() => handleSituacaoTemaSelect(" ")}
              >
                {situacaoTema === " " && (
                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    <Check className="h-4 w-4" />
                  </span>
                )}
                Todos
              </button>
              {situacaoTemaValues.map((value) => (
                <button
                  key={value}
                  type="button"
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground text-left",
                    situacaoTema === value && "bg-accent text-accent-foreground",
                  )}
                  onClick={() => handleSituacaoTemaSelect(value)}
                >
                  {situacaoTema === value && (
                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                      <Check className="h-4 w-4" />
                    </span>
                  )}
                  <span className="truncate">{value}</span>
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </>
  )
}