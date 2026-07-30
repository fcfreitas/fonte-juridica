"use client"; // Indica que este componente deve ser tratado no lado do cliente

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // useSearchParams é o hook correto
import { Eye, EyeOff } from "lucide-react";

// Componente que faz uso de `useSearchParams`
function ResetPasswordPage() {
  const searchParams = useSearchParams(); // Corrigir aqui, agora usamos useSearchParams
  const token = searchParams.get("token"); // Pega o token da URL

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  // Verificação da força da senha
  const passwordValidation = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    match: password === confirmPassword && password !== "",
  };

  const isFormValid = Object.values(passwordValidation).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    if (!isFormValid) {
      setError("A senha não atende aos requisitos.");
      setLoading(false);
      return;
    }

    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error);
      setLoading(false);
    } else {
      setMessage("Senha redefinida com sucesso! Redirecionando para o login...");
      setTimeout(() => router.push("/login"), 3000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-sm">
        <h1 className="text-2xl font-serif font-semibold text-ink-900 mb-6 text-center">Redefinir senha</h1>

        {message && <p className="text-emerald-700 text-sm mb-3">{message}</p>}
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nova senha"
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

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirme a nova senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-muted-foreground"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Verificação da senha */}
          <div className="text-sm text-left mb-1 space-y-0.5">
            <p className={passwordValidation.length ? "text-emerald-700" : "text-red-600"}>
              ✅ Pelo menos 8 caracteres
            </p>
            <p className={passwordValidation.uppercase ? "text-emerald-700" : "text-red-600"}>
              ✅ Pelo menos uma letra maiúscula
            </p>
            <p className={passwordValidation.lowercase ? "text-emerald-700" : "text-red-600"}>
              ✅ Pelo menos uma letra minúscula
            </p>
            <p className={passwordValidation.number ? "text-emerald-700" : "text-red-600"}>
              ✅ Pelo menos um número
            </p>
            <p className={passwordValidation.match ? "text-emerald-700" : "text-red-600"}>
              ✅ Senhas coincidem
            </p>
          </div>

          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`p-2 rounded-md font-semibold transition-colors ${
              isFormValid ? "bg-ink-900 hover:bg-ink-800 text-brass-400" : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            {loading ? "Carregando..." : "Redefinir Senha"}
          </button>
        </form>
      </div>
    </div>
  );
}

// Componente Suspense que envolve o ResetPasswordPage
export default function ResetPasswordPageSuspense() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ResetPasswordPage />
    </Suspense>
  );
}
