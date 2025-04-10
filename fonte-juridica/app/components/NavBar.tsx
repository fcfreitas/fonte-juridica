"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, BookOpenIcon as BookClosed, Search, LogOut, LogIn, Filter } from "lucide-react"

export default function NavBar() {
    const { data: session } = useSession();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }

        if (isDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownOpen]);

    return (
        <nav className="bg-slate-100 border-b border-slate-200 z-50">
            <div className="container mx-auto px-4">
                <ul className="flex justify-between items-center space-x-8 py-4">
                    <div className="flex space-x-4">
                        <li>
                        <Link
                        href="/"
                         className="font-large"
                        >
                            Home
                        </Link>
                        </li>
                        <li className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="hover:text-slate-800 font-large transition-colors focus:outline-none"
                            >
                                Menu
                            </button>

                            {isDropdownOpen && (
                                <ul className="absolute left-0 mt-2 w-80 bg-white shadow-lg rounded-lg border border-gray-200">
                                    <li>
                                        <Link
                                            href="/stf-rep-geral"
                                            className="block px-4 py-2 hover:bg-gray-100 transition"
                                            onClick={() => setIsDropdownOpen(false)} // Fecha o dropdown ao clicar
                                        >
                                            STF - Temas de Repercussão Geral
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/stf-jurisprudencias"
                                            className="block px-4 py-2 hover:bg-gray-100 transition"
                                            onClick={() => setIsDropdownOpen(false)} // Fecha o dropdown ao clicar
                                        >
                                            STF - Jurisprudências
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>
                    </div>

                    <div>
            {session ? (
              <Button variant="destructive" size="default" className="flex items-center gap-2" onClick={() => signOut()}>
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            ) : (
              <Button variant="primary" size="default" className="flex items-center gap-2" onClick={() => signIn()}>
                <LogIn size={16} />                
                <span>Login</span>
              </Button>
            )}
          </div>
                </ul>
            </div>
        </nav>
    );
}
