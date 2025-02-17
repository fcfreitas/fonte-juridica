'use client'

import JulgadosList from '../JulgadosList';
import { Julgado } from '../julgados-data';
import { Filters } from "../components/Filters";

export default function JulgadosPage() {

    return (
        <div className="container mx-auto p-8 flex flex-col h-full"> 
            <h1 className="text-4xl font-bold mb-4 ml-8"> Julgados </h1>
            <div className="group flex w-full">
                <div className="flex flex-col h-full">
                            <Filters />
                </div>
                <div className="flex-1 flex flex-col min-h-screen p-8">
                    <div className="space-y-4">
                        <JulgadosList />
                    </div>
                </div>
            </div>
        </div>
    )
}