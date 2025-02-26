"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from 'next/link';

export default function NavBar() {
    const { data: session } = useSession(); // Obtém sessão do usuário

    return (
        <nav className="bg-slate-300 shadow-md mb-2 border-b border-slate-200">
            <div className="container mx-auto px-4">
                <ul className="flex justify-between items-center space-x-8 py-4">
                    <div className="flex space-x-4">
                        <li>
                            <Link href="/" className="hover:text-slate-800 font-medium transition-colors">Home</Link>
                        </li>
                        <li>
                            <Link href="/stf-rep-geral" className="hover:text-slate-800 font-medium transition-colors">Buscar</Link>
                        </li>
                    </div>

                    <div>
                        {session ? (
                            <button
                                onClick={() => signOut()}
                                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                            >
                                Logout
                            </button>
                        ) : (
                            <button
                                onClick={() => signIn()}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                            >
                                Login
                            </button>
                        )}
                    </div>
                </ul>
            </div>
        </nav>
    );
}
