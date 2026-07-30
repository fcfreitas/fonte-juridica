'use client';

export default function Cancelado() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Assinatura Cancelada</h1>
      <p className="text-lg text-center mb-6">Parece que houve um problema ou você cancelou o processo.</p>
      <a
        href="/assinatura"
        className="bg-ink-900 hover:bg-ink-800 text-brass-400 font-semibold py-2 px-6 rounded-xl transition"
      >
        Tentar Novamente
      </a>
    </div>
  );
}
