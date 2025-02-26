"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export default function LogoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(process.env.NEXT_PUBLIC_SITE_URL+"/login"); // Se não estiver logado, redireciona para login
    }
  }, [status, router]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: process.env.NEXT_PUBLIC_SITE_URL+"/login" }); // Faz logout e redireciona
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Você está logado</h1>
      <p className="text-gray-600">Deseja sair?</p>

      <button
        onClick={handleLogout}
        className="bg-red-600 text-white p-2 w-80 mt-4"
      >
        Logout
      </button>
    </div>
  );
}
