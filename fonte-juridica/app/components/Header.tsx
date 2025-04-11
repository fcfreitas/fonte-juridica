export default function HeaderBar() {
    return (
        <div className="z-50">
            <div className='bg-amber-50 p-3 text-center text-sm font-medium text-amber-900 py-2'>
                <p className=''>A sua fonte de decisões jurídicas. <span className="underline font-bold">Assine agora!</span></p>
            </div>
            <header className='bg-sky-700 text-white p-3 md:p-6'>
                    <div className='container mx-auto px-4'>
                        <h1 className='text-2xl md:text-3xl font-bold'>Fonte Jurídica</h1>
                    </div>
            </header>           
        </div>
    )
}