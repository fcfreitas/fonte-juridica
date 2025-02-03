import NotFoundPage from "@/app/not-found"
import {julgados} from "@/app/julgados-data"

export default function JulgadoDetailPage({ params }: { params: { id: string}}) {
    const julgado = julgados.find( p=> p.id === params.id)

    if (!julgado) {
        return <NotFoundPage/>
    }

    return (
        <>
        <div className="container mx-auto p-8 flex flex-col md:flex-row">
            <div className="w-1/2">
                <h1 className="text-3xl font-bold mb-4"> { julgado.name} </h1>
                <p className="text-lg text-gray-600 mb-2">Órgão: { julgado.mainCourt}</p>
                <p className="text-lg text-gray-600 mb-2">Categoria: { julgado.category}</p>
                <p className="text-lg text-gray-600 mb-2">Sub-Categoria: { julgado.subCategory}</p>
                <p className="text-lg text-gray-600 mb-2">Assunto: { julgado.subject}</p>
                <h3 className="text-xl font-semi-bold mb-2 mt-4">Resumo</h3>
                <p className="text-gray-700">{julgado.description}</p>
            </div>
            <div className="xl:w-full xl:h-full mb-4 md:mb-0 md:mr-8">
                <embed 
                src={julgado.textUrl} 
                type="application/pdf"
                height="100%" 
                width="100%" 
                className="w-full h-screen rounded-lg shadow-md"/>
            </div>

        </div>

        </>
    )
    
    
}