"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userEmail: email }),
    });

    console.log("Email enviado para busca; ", email)

    const data = await response.json();

    if (!response.ok) {
      setError(data.error);
    } else {
      setMessage("Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha.");
    }
  };

  return (
    <div className="flex flex-col items-center p-16 h-screen">
      <h1 className="text-2xl font-bold mb-4">Recuperar Senha</h1>

      {message && <p className="text-green-500">{message}</p>}
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col items-center w-80">
        <input
          type="email"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 w-full">
          Enviar e-mail de recuperação
        </button>
      </form>
    </div>
  );
}
