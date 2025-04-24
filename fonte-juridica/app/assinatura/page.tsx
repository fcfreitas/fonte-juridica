'use client';

import { useState } from 'react';

const planos = {
  mensal: { title: 'Assinatura Mensal', price: 29.9 },
  semestral: { title: 'Assinatura Semestral', price: 149.9 },
  anual: { title: 'Assinatura Anual', price: 279.9 },
};

export default function Planos() {
  const [carregando, setCarregando] = useState(false);

  const handleAssinar = async (plano: keyof typeof planos) => {
    try {
      setCarregando(true);

      const res = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plano }),
      });

      const data = await res.json();
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        alert('Erro ao criar pagamento.');
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao processar o pagamento.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold text-center mb-6">Escolha seu plano</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(planos).map(([key, { title, price }]) => (
          <div key={key} className="border p-4 rounded-2xl shadow-md flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold">{title}</h2>
              <p className="text-lg mt-2">R$ {price.toFixed(2)}</p>
            </div>
            <button
              onClick={() => handleAssinar(key as keyof typeof planos)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
              disabled={carregando}
            >
              {carregando ? 'Processando...' : 'Assinar'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
