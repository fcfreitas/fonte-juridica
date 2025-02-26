"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const response = await fetch(process.env.NEXT_PUBLIC_SITE_URL+"/api/auth/register", {
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
    <div className="flex flex-col items-center justify-center h-screen">
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
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 mb-2 w-80"
      />
      <button onClick={handleRegister} className="bg-blue-500 text-white p-2 w-80">
        Cadastrar
      </button>
    </div>
  );
}
