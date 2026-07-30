import Link from "next/link";

export default function HeaderBar() {
    return (
        <div className="z-40">
            <header className='bg-ink-900 text-paper p-3 md:p-6 border-b border-brass-900/40'>
                    <div className='container mx-auto px-4'>
                        <h1 className='text-2xl md:text-3xl font-serif font-semibold tracking-tight'>
                            <Link href="/">
                                Jus<span className="text-brass-400">dex</span>
                            </Link>
                        </h1>
                    </div>
            </header>
        </div>
    )
}