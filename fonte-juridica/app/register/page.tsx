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
    <div className="flex flex-col items-center p-16 h-screen">
      <h1 className="text-2xl font-bold mb-4">Criar Conta</h1>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">Conta criada! Redirecionando...</p>}

      <input
        type="text"
        placeholder="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 mb-2 w-80"
      />
      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 mb-2 w-80"
      />
      <div className="relative w-80">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Senha"
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
      <div className="relative w-80">
        <input
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Redigite a senha"
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
      <div className="text-sm text-left w-80 mb-2">
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
        onClick={handleRegister}
        className={`p-2 w-80 rounded ${
          isFormValid ? "bg-blue-500 text-white" : "bg-gray-400 text-gray-700 cursor-not-allowed"
        }`}
        disabled={!isFormValid}
      >
        Cadastrar
      </button>
    </div>
  );
}
