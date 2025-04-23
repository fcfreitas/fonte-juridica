"use client"; // Indica que este componente deve ser tratado no lado do cliente

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // useSearchParams é o hook correto
import { Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
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
    <div className="flex flex-col items-center p-16 h-screen">
      <h1 className="text-2xl font-bold mb-4">Redefinir Senha</h1>

      {message && <p className="text-green-500">{message}</p>}
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col items-center w-80">
        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Nova senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 mb-2 w-full"
          />
          <button
            type="button"
            className="absolute right-3 top-3"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="relative w-full">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirme a nova senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border p-2 mb-2 w-full"
          />
          <button
            type="button"
            className="absolute right-3 top-3"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Verificação da senha */}
        <div className="text-sm text-left w-full mb-2">
          <p className={passwordValidation.length ? "text-green-600" : "text-red-600"}>
            ✅ Pelo menos 8 caracteres
          </p>
          <p className={passwordValidation.uppercase ? "text-green-600" : "text-red-600"}>
            ✅ Pelo menos uma letra maiúscula
          </p>
          <p className={passwordValidation.lowercase ? "text-green-600" : "text-red-600"}>
            ✅ Pelo menos uma letra minúscula
          </p>
          <p className={passwordValidation.number ? "text-green-600" : "text-red-600"}>
            ✅ Pelo menos um número
          </p>
          <p className={passwordValidation.match ? "text-green-600" : "text-red-600"}>
            ✅ Senhas coincidem
          </p>
        </div>

        <button
          type="submit"
          disabled={!isFormValid || loading}
          className={`p-2 w-full rounded ${
            isFormValid ? "bg-blue-500 text-white" : "bg-gray-400 text-gray-700 cursor-not-allowed"
          }`}
        >
          {loading ? "Carregando..." : "Redefinir Senha"}
        </button>
      </form>
    </div>
  );
}
