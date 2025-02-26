"use client";

import { useSession, signOut } from "next-auth/react";

export const dynamic = "force-dynamic";

export default function dashboard() {
  const { data: session } = useSession();

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <h1 className="text-white text-xl">Meu App</h1>

      {session?.user ? (
        <div className="flex items-center space-x-4">
          <span className="text-white">Olá, {session.user.name}!</span>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => signOut()}
          >
            Sair
          </button>
        </div>
      ) : (
        <a href="/api/auth/signin" className="text-white">
          Entrar
        </a>
      )}
    </nav>
  );
}
