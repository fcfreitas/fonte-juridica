"use client"

import type React from "react"

import { useFilter } from "./FilterContext"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"
import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

type FilterParams = {
  text?: string
  tema?: string
}

type FreeTextFilterProps = {
  onFilter: (filters: FilterParams) => void
}

export function Filters({ onFilter }: FreeTextFilterProps) {
  const { ramoDireito, setRamoDireito, searchText, setSearchText, searchTema, setSearchTema } = useFilter()

  const [ramoOpen, setRamoOpen] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value
    setSearchText(newText)
    onFilter({ text: newText, tema: searchTema })
    // console.log("searchText:", searchText)
  }

  const handleChangeTema = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTema = e.target.value
    setSearchTema(newTema)
    onFilter({ text: searchText, tema: newTema })
    // console.log("searchText:", searchText)
  }

  const handleRamoSelect = (value: string) => {
    setRamoDireito(value)
    // Fechando o popover explicitamente após um pequeno delay
    setTimeout(() => {
      setRamoOpen(false)
    }, 10)
  }

  const ramoOptions = [
    { value: " ", label: "Todos" },
    { value: "Administrativo", label: "Administrativo" },
    { value: "Ambiental", label: "Ambiental" },
    { value: "Civil", label: "Civil" },
    { value: "Consumidor", label: "Consumidor" },
    { value: "Trabalho", label: "Trabalho" },
    { value: "Eleitoral", label: "Eleitoral" },
    { value: "Internacional", label: "Internacional" },
    { value: "Penal", label: "Penal" },
    { value: "Penal Militar", label: "Penal Militar" },
    { value: "Previdenciário", label: "Previdenciário" },
    { value: "Processual Civil e do Trabalho", label: "Processual Civil e do Trabalho" },
    { value: "Processual Penal", label: "Processual Penal" },
    { value: "Processual Penal Militar", label: "Processual Penal Militar" },
    { value: "Registral", label: "Registral" },
    { value: "Militar", label: "Militar" },
    { value: "Tributário", label: "Tributário" },
  ]

  return (
    <div className="space-y-3">
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
      <div className="relative mb-3">
        <input
          type="text"
          placeholder="Número do tema..."
          value={searchTema}
          onChange={handleChangeTema}
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400"
        />
        <Search size={16} className="absolute right-3 top-2.5 text-slate-400" />
      </div>
      <div className="hidden md:block space-y-2 mb-6">
        <Label htmlFor="ramo-direito" className="font-semibold">
          Ramo do Direito:
        </Label>
        <Popover open={ramoOpen} onOpenChange={setRamoOpen}>
          <PopoverTrigger asChild>
            <Button
              id="ramo-direito"
              variant="outline"
              role="combobox"
              aria-expanded={ramoOpen}
              className="w-full bg-slate-50 h-auto py-2"
            >
              <div className="flex w-full items-center justify-between">
                <span className="truncate max-w-[calc(100%-20px)] text-left">
                  {ramoDireito === " " ? "Todos" : ramoDireito || "Todos"}
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <div className="max-h-[300px] overflow-auto">
              {ramoOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground text-left",
                    ramoDireito === option.value && "bg-accent text-accent-foreground",
                  )}
                  onClick={() => handleRamoSelect(option.value)}
                >
                  {ramoDireito === option.value && (
                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                      <Check className="h-4 w-4" />
                    </span>
                  )}
                  <span className="truncate">{option.label}</span>
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="md:hidden space-y-2 mb-6">
        <Label htmlFor="ramo-direito" className="font-semibold">
          Ramo do Direito:
        </Label>
        <Select
          value={ramoDireito}
          onValueChange={(value) => setRamoDireito(value)}
        >
          <SelectTrigger
            id="ramo-direito"
            className="w-full bg-slate-50 h-auto py-2"
          >
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px] overflow-auto">
            {ramoOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
