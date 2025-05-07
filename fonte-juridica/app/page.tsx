'use client';
import { Filter, MessageSquareText, Notebook } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-white text-slate-900 py-12 px-4 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Domine os temas do STF e STJ</h1>
          <p className="text-base md:text-lg text-slate-600">
            Feito para quem estuda para carreiras da área Jurídica.
          </p>
          <p className="text-base md:text-lg text-slate-600 mb-6">
            Acesse, organize e domine temas com facilidade e profundidade. 
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link href={"/register/"} className="bg-sky-700 text-white px-6 py-3 rounded-xl font-semibold">Crie sua conta</Link>
            <Link href={"/home/"} className="border border-sky-700 text-sky-700 px-6 py-3 rounded-xl font-semibold">Comece a explorar</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-50 py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <Filter className="mx-auto h-12 w-12 text-sky-700 mb-4" />
            <h3 className="text-xl font-bold mb-2">Filtros Inteligentes</h3>
            <p className="text-slate-600">Encontre julgados por tribunal, categoria, ramo do Direito ou palavras-chave.</p>
          </div>
          <div>
          <Notebook className="mx-auto h-12 w-12 text-sky-700 mb-4" />
            <h3 className="text-xl font-bold mb-2">Organização Pessoal</h3>
            <p className="text-slate-600">Marque como lido e faça suas anotações.</p>
          </div>
          <div>
          <MessageSquareText className="mx-auto h-12 w-12 text-sky-700 mb-4" />
            <h3 className="text-xl font-bold mb-2">Comentários e Análises</h3>
            <p className="text-slate-600 font-bold"> Em breve!</p>
            <p className="text-slate-600">Aprofunde-se nos principais temas com observações feitas por especialistas.</p>
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6">Como o Fonte Jurídica funciona?</h2>
          <ol className="text-left space-y-4 text-slate-700">
            <li>1. Crie sua conta em poucos segundos.</li>
            <li>2. Assine e desbloqueie as funcionalidades.</li>
            <li>3. Explore os temas atualizados e categorizados diariamente.</li>
            <li>4. Filtre e leia sem limite de temas por dia.</li>
            <li>5. Marque os temas que já leu e faça seus comentários organizados por tema.</li>
          </ol>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-slate-100 py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-8">O que dizem os usuários</h2>
          <blockquote className="italic text-slate-600 mb-4">"O Fonte Jurídica revolucionou meus estudos para concursos. Tudo organizado e fácil de acessar."</blockquote>
          <p className="font-semibold">— Laura, Procuradora do Estado de SP</p>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="bg-sky-600 text-white py-12 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Pronto para transformar sua rotina de estudos?</h2>
        <p className="mb-6">Comece hoje mesmo a usar o Fonte Jurídica.</p>
        <Link href={"/register/"} className="bg-white text-sky-700 font-semibold px-6 py-3 rounded-xl">Crie sua conta</Link>
      </section>
    </main>
  );
}
