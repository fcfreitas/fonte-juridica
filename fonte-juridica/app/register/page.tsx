"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export const dynamic = "force-dynamic";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  // Função para verificar a força da senha
  const passwordValidation = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    match: password === confirmPassword && password !== "",
  };

  const isFormValid = Object.values(passwordValidation).every(Boolean);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!isFormValid) {
      setError("A senha não atende aos requisitos.");
      return;
    }

    const response = await fetch(process.env.NEXT_PUBLIC_SITE_URL + "/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error);
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-sm">
        <h1 className="text-2xl font-serif font-semibold text-ink-900 mb-6 text-center">Criar conta no Jusdex</h1>

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        {success && <p className="text-emerald-700 text-sm mb-3">Conta criada! Redirecionando...</p>}

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
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
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Redigite a senha"
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
            onClick={handleRegister}
            className={`p-2 rounded-md font-semibold transition-colors ${
              isFormValid ? "bg-ink-900 hover:bg-ink-800 text-brass-400" : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
            disabled={!isFormValid}
          >
            Cadastrar
          </button>
        </div>
      </div>
    </div>
  );
}
