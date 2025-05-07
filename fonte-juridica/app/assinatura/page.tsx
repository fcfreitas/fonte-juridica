'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { CheckCircle, Loader2 } from 'lucide-react'; // Ícones opcionais

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
        window.location.href = data.url;
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
    <div className="max-w-xl mx-auto py-12 px-4 min-h-[70vh]">
      <h1 className="text-3xl font-bold text-center text-slate-800 mb-8">
        Assinatura 
      </h1>

      <div className="rounded-2xl border border-slate-200 shadow-xl p-8 bg-white text-center">
        <h2 className="text-2xl font-semibold text-slate-800 mb-2"> Mensal</h2>
        <p className="text-lg text-slate-600 mb-4">R$ 29,90 / mês</p>

        <ul className="text-sm text-slate-600 text-left space-y-2 mb-6">
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-sky-500" /> Acesso completo aos temas
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-sky-500" /> Comentários e análises <p className='font-semibold'> Em breve! </p>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-sky-500" /> Atualizações semanais do STF e STJ
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-sky-500" /> Organização de temas lidos
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-sky-500" /> Anotações próprias separadas por temas
          </li>
        </ul>

        <button
          onClick={handleAssinar}
          disabled={carregando}
          className="w-full bg-gradient-to-r from-sky-300 to-sky-600 hover:from-sky-400 hover:to-sky-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {carregando ? (
            <span className="flex justify-center items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Processando...
            </span>
          ) : (
            '🚀 Comece agora'
          )}
        </button>

        <p className="text-xs text-slate-500 mt-4">
          Sem fidelidade. Cancele quando quiser.
        </p>
      </div>
    </div>
  );
}
