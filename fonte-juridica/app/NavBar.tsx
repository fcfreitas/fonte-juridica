import Link from 'next/link';

export default function NavBar() {
    return(
        <nav className='bg-slate-300 shadow-md mb-2 border-b border-slate-200'>
            <div className='container mx-auto px-4'>
                <ul className='flex justify-between items-center space-x-8 py-4'>
                    <div className='flex space-x-4'>
                        <li>
                            <Link href="/" className='hover:text-slate-800 font-medium transition-colors'>Home</Link>
                        </li>
                        <li>
                            <Link href="/buscar" className='hover:text-slate-800 font-medium transition-colors'>Buscar</Link>
                        </li>
                    </div>
                </ul>
            </div>
        </nav>
    )
}
