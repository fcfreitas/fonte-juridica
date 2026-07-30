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
      setMessage("Você receberá um link para redefinir sua senha.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-sm">
        <h1 className="text-2xl font-serif font-semibold text-ink-900 mb-6 text-center">Recuperar senha</h1>

        {message && <p className="text-emerald-700 text-sm mb-3">{message}</p>}
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button type="submit" className="rounded-md bg-ink-900 hover:bg-ink-800 text-brass-400 font-semibold py-2 transition-colors">
            Enviar e-mail de recuperação
          </button>
        </form>
      </div>
    </div>
  );
}
