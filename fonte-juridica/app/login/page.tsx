"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push(process.env.NEXT_PUBLIC_SITE_URL+"/");
    }
  }, [session, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError("Login falhou. Verifique suas credenciais.");
    } else {
      router.push(process.env.NEXT_PUBLIC_SITE_URL+"/");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Login</h1>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleLogin} className="flex flex-col items-center w-80">
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 w-full"
          disabled={loading}
        >
          {loading ? "Carregando..." : "Entrar"}
        </button>
      </form>

      <p className="mt-4">
        Ainda não tem conta?{" "}
        <Link href="/register" className="text-blue-500">
          Registre-se aqui
        </Link>
      </p>
    </div>
  );
}
