"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login"); // 🔥 Redireciona para a página de login se não estiver logado
    }
  }, [user, router]);

  if (!user) return null; // Evita piscar conteúdo antes do redirecionamento

  return <>{children}</>;
}
