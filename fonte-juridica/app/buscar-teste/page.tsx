import JulgadosList from '../JulgadosList';
import {julgados} from '../julgados-data';
import SearchBar from '../buscar/SearchBar';

export default function JulgadosPage() {

    return (
        <>
        <div className="container mx-auto p-8 flex flex-col h-full"> 
            <h1 className="text-4xl font-bold mb-4 ml-8"> Julgados </h1>
            <div className="group flex w-full">
                <div className="flex flex-col h-full">
                    <div className='hidden md:block w-[300px] h-screen sticky top-0 p-8'>
                        <div className="bg-white rounded-lg shadow-md p-4 flex-grow overflow-auto min-h-[200px]">
                            <SearchBar />
                        </div>
                    </div>

                </div>
                <div className="flex-1 flex flex-col min-h-screen p-8">
                            <JulgadosList julgados={julgados} />
                    </div>
            </div>

        </div>


        </>
    )
}