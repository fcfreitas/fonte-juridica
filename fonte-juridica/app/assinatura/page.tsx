'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function Assinatura() {
  const [carregando, setCarregando] = useState(false);
  const { data: session } = useSession();

  const handleAssinar = async () => {
    try {
      setCarregando(true);

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: session?.user.id, 
          email: session?.user.email 
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // Redireciona para o Stripe Checkout
      } else {
        alert('Erro ao criar checkout.');
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao processar a assinatura.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold text-center mb-6">Assinatura Fonte Jurídica</h1>
      <div className="border p-6 rounded-2xl shadow-md flex flex-col justify-between items-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Assinatura Mensal</h2>
          <p className="text-lg">R$ 29,90 / mês</p>
        </div>
        <button
          onClick={handleAssinar}
          className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
          disabled={carregando}
        >
          {carregando ? 'Processando...' : 'Assinar agora'}
        </button>
      </div>
    </div>
  );
}
