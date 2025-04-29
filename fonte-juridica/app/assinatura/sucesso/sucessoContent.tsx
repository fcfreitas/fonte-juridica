'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function SucessoContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      console.log('Sessão Stripe:', sessionId);
    }
  }, [sessionId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold text-green-600 mb-4">Assinatura Confirmada!</h1>
      <p className="text-lg text-center mb-6">Obrigado por assinar o Fonte Jurídica.</p>
      <a
        href="/"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl transition"
      >
        Voltar para Home
      </a>
    </div>
  );
}
