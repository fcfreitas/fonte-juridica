"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, LogIn, ChevronDown, ChevronUp } from "lucide-react"

interface TribunalItem {
    label: string;
    href: string;
}

const TRIBUNAIS: TribunalItem[] = [
    { label: "STF - Temas de Repercussão Geral", href: "/stf-rep-geral" },
    { label: "STJ - Repetitivos", href: "/stj-repetitivos" },
];

export default function NavBar() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLLIElement | null>(null);

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

    const isTribunalAtiva = TRIBUNAIS.some((item) => pathname?.startsWith(item.href));

    return (
        <nav className="bg-secondary border-b border-border z-40">
            <div className="container mx-auto px-3 md:px-6">
                <ul className="flex justify-between items-center space-x-8 p-3 px-4 md:px-6">
                    <div className="flex space-x-4">
                        <li className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className={`flex items-center gap-1 font-large transition-colors focus:outline-none hover:text-brass-600 ${
                                    isTribunalAtiva ? "text-brass-600 font-semibold" : ""
                                }`}
                            >
                                Tribunais
                                {isDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>

                            {isDropdownOpen && (
                                <ul className="absolute left-0 mt-2 w-80 bg-white shadow-lg rounded-lg border border-gray-200">
                                    {TRIBUNAIS.map((item) => {
                                        const isAtivo = pathname?.startsWith(item.href);
                                        return (
                                            <li key={item.href}>
                                                <Link
                                                    href={item.href}
                                                    className={`block px-4 py-2 hover:bg-gray-100 transition ${
                                                        isAtivo ? "text-brass-600 font-semibold" : ""
                                                    }`}
                                                    onClick={() => setIsDropdownOpen(false)}
                                                >
                                                    {item.label}
                                                </Link>
                                            </li>
                                        );
                                    })}
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
