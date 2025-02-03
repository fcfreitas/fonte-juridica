import JulgadosList from '../JulgadosList';
import {julgados} from '../julgados-data';
import SearchBar from './SearchBar';

export default function JulgadosPage() {

    return (
        <>
        <div className="container mx-auto p-8 flex flex-col h-full"> 
            <h1 className="text-4xl font-bold mb-8"> Julgados </h1>
            <div>
            <SearchBar />
            </div>
            <JulgadosList julgados={julgados} />
        </div>

        </>
    )
}