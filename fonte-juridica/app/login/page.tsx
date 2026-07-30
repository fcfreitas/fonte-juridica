"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      console.log("Session:", session);
      if (session.user.pagante) {
        router.push("/home");
      } else {
        router.push("/assinatura");
      }
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
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-sm">
        <h1 className="text-2xl font-serif font-semibold text-ink-900 mb-6 text-center">Entrar no Jusdex</h1>

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <div className="relative">
            <input
            type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-muted-foreground"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <p className="text-sm">
            <Link href="/forgot-password" className="text-brass-700 hover:text-brass-800 underline-offset-4 hover:underline">
              Esqueci minha senha
            </Link>
          </p>

          <button
            type="submit"
            className="rounded-md bg-ink-900 hover:bg-ink-800 text-brass-400 font-semibold py-2 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Carregando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-muted-foreground">
          Ainda não tem conta?{" "}
          <Link href="/register" className="text-brass-700 hover:text-brass-800 underline-offset-4 hover:underline">
            Registre-se aqui
          </Link>
        </p>
      </div>
    </div>
  );
}
