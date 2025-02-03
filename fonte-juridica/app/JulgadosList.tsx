import Link from 'next/link';
import { Julgado } from './julgados-data';
import SearchBar from './buscar/SearchBar';

export default function JulgadosList ({ julgados}: {julgados: Julgado[]}) {



    return (
        <div>
            <div className="grid grid-cols-1 gap-8">
                {julgados.map(julgados => (
                    <Link 
                        key={julgados.id} 
                        href={"/buscar/" + julgados.id}
                        className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition duration-300"
                    >
                            <h2 className="text-xl font-serif font-semibold text-slate-800">{julgados.name}</h2>
                            <p className="text-gray-600">Órgão: {julgados.mainCourt}</p>
                    </Link>
                ))}
            </div>
        </div>

    )
}