import { Filter, Notebook, MessageSquareText, BookIcon, ShieldCheck, RefreshCcw, Scale, Star } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-background text-ink-900 py-16 px-4 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-brass-700 mb-4">
            STF · STJ · Corte Interamericana de Direitos Humanos
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-semibold leading-tight mb-6">
            Domine a jurisprudência que decide carreiras e casos.
          </h1>
          <p className="text-base md:text-lg text-ink-600 max-w-2xl mx-auto">
            O Jusdex organiza temas e julgados do STF, STJ e da Corte IDH com
            atualização automatizada direto da base oficial de transparência do STF —
            para quem estuda ou atua na área jurídica e não pode se dar ao luxo de
            trabalhar com dado desatualizado.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
            <Link
              href={"/register/"}
              className="bg-ink-900 hover:bg-ink-800 text-brass-400 px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Crie sua conta
            </Link>
            <Link
              href={"/home/"}
              className="border border-ink-300 text-ink-800 hover:border-ink-900 px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Comece a explorar
            </Link>
          </div>
        </div>
      </section>

      {/* Prévia do produto */}
      <section className="bg-secondary py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-ink-900 mb-3">
              Cada tema, organizado do jeito que você precisa para estudar ou atuar
            </h2>
            <p className="text-ink-600 max-w-2xl mx-auto">
              Veja como um tema de repercussão geral aparece dentro do Jusdex —
              sem precisar criar conta para entender o formato.
            </p>
          </div>

          {/* Mockup estático — dados de exemplo */}
          <div className="rounded-xl border border-border bg-card shadow-lg overflow-hidden">
            <div className="bg-secondary px-6 py-4 border-b border-border">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                <h3 className="font-semibold text-ink-900 text-justify">
                  1.234 — Constitucionalidade da incidência de contribuição previdenciária
                  sobre o auxílio-doença pago pelo empregador
                </h3>
                <div className="flex items-center gap-2 shrink-0">
                  <BookIcon size={16} className="text-brass-600" />
                  <Star size={16} className="text-brass-600" />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-ink-600">Recurso Paradigma:</span>
                <Badge variant="outline" className="text-xs bg-background">RE 1.287.019</Badge>
              </div>
            </div>

            <div className="px-6 py-5">
              <p className="text-sm font-semibold text-ink-800 mb-1">Tese firmada</p>
              <p className="text-sm text-ink-600 text-justify">
                &ldquo;É inconstitucional a incidência de contribuição previdenciária
                sobre os valores pagos pelo empregador ao empregado durante os
                primeiros quinze dias de afastamento por motivo de doença.&rdquo;
              </p>
            </div>

            <div className="bg-secondary px-6 py-4 border-t border-border flex flex-col gap-3">
              <p className="text-sm text-ink-700">
                <span className="font-medium">Ramo do Direito:</span> Tributário / Previdenciário
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-brass-100 text-brass-800 text-xs">Contribuições Sociais</Badge>
                <Badge variant="secondary" className="bg-brass-100 text-brass-800 text-xs">Auxílio-Doença</Badge>
              </div>
              <div className="flex flex-wrap gap-4">
                <span className="text-sm text-ink-700">
                  Repercussão Geral: <Badge variant="secondary" className="bg-brass-100 text-brass-800 text-xs">Mérito julgado</Badge>
                </span>
                <span className="text-sm text-ink-700">
                  Situação: <Badge variant="secondary" className="bg-brass-100 text-brass-800 text-xs">Trânsito em julgado</Badge>
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs text-center text-muted-foreground mt-3">
            Exemplo ilustrativo, com dados fictícios de conteúdo real do Jusdex.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="bg-background py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div>
            <Filter className="mx-auto h-10 w-10 text-brass-600 mb-4" strokeWidth={1.5} />
            <h3 className="font-serif text-xl font-semibold text-ink-900 mb-2">Filtros Inteligentes</h3>
            <p className="text-ink-600">
              Encontre julgados por tribunal, ramo do Direito, situação processual ou
              palavras-chave, sem se perder em listas intermináveis.
            </p>
          </div>
          <div>
            <Notebook className="mx-auto h-10 w-10 text-brass-600 mb-4" strokeWidth={1.5} />
            <h3 className="font-serif text-xl font-semibold text-ink-900 mb-2">Organização Pessoal</h3>
            <p className="text-ink-600">
              Marque temas como lidos, destaque os mais relevantes e faça suas
              próprias anotações vinculadas a cada tema.
            </p>
          </div>
          <div>
            <MessageSquareText className="mx-auto h-10 w-10 text-brass-600 mb-4" strokeWidth={1.5} />
            <h3 className="font-serif text-xl font-semibold text-ink-900 mb-2">Comentários e Análises</h3>
            <span className="inline-block text-xs font-semibold uppercase tracking-wide text-brass-700 border border-brass-300 rounded-full px-3 py-1 mb-2">
              Em construção · lista de espera
            </span>
            <p className="text-ink-600">
              Aprofunde-se nos principais temas com análises de especialistas.
              Crie sua conta para ser avisado assim que estiver disponível.
            </p>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="bg-secondary py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-ink-900 mb-3">Como o Jusdex funciona</h2>
          <p className="text-ink-600 mb-10">
            Do cadastro à rotina de estudo ou trabalho, em cinco passos.
          </p>
          <ol className="text-left space-y-5">
            {[
              "Crie sua conta em poucos segundos.",
              "Assine e desbloqueie o acesso completo aos temas.",
              "Explore temas atualizados automaticamente, direto da base de transparência do STF.",
              "Filtre por tribunal, ramo do Direito ou palavra-chave e leia sem limite.",
              "Marque os temas que já leu e organize suas próprias anotações.",
            ].map((passo, index) => (
              <li key={index} className="flex items-start gap-4">
                <span className="flex items-center justify-center h-8 w-8 rounded-full bg-ink-900 text-brass-400 text-sm font-semibold shrink-0">
                  {index + 1}
                </span>
                <span className="text-ink-700 pt-1">{passo}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Prova social: números */}
      <section className="bg-background py-16 px-4 border-y border-border">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="font-serif text-3xl font-semibold text-ink-900">[ajustar]</p>
            <p className="text-sm text-ink-600 mt-1">temas monitorados</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">ajustar com dado real</p>
          </div>
          <div>
            <p className="font-serif text-3xl font-semibold text-ink-900">3</p>
            <p className="text-sm text-ink-600 mt-1">tribunais e cortes cobertos</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">STF · STJ · Corte IDH</p>
          </div>
          <div className="flex flex-col items-center">
            <RefreshCcw className="h-6 w-6 text-brass-600 mb-1" strokeWidth={1.5} />
            <p className="font-serif text-lg font-semibold text-ink-900">Atualização diária</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">automatizada, direto do STF</p>
          </div>
          <div className="flex flex-col items-center">
            <ShieldCheck className="h-6 w-6 text-brass-600 mb-1" strokeWidth={1.5} />
            <p className="font-serif text-lg font-semibold text-ink-900">Fonte oficial</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">dados de transparência do STF</p>
          </div>
        </div>
      </section>

      {/* Prova social: depoimentos */}
      <section className="bg-secondary py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-ink-900 mb-10">O que dizem os usuários</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <figure className="rounded-xl border border-border bg-card p-6 text-left">
              <Scale className="h-5 w-5 text-brass-600 mb-3" strokeWidth={1.5} />
              <blockquote className="text-ink-700 text-sm italic mb-4">
                &ldquo;O Jusdex revolucionou meus estudos para concursos. Tudo organizado
                e fácil de acessar.&rdquo;
              </blockquote>
              <figcaption className="text-sm font-semibold text-ink-900">
                Laura, Procuradora do Estado de SP
              </figcaption>
            </figure>
            <figure className="rounded-xl border border-border bg-card p-6 text-left">
              <Scale className="h-5 w-5 text-brass-600 mb-3" strokeWidth={1.5} />
              <blockquote className="text-ink-700 text-sm italic mb-4">
                &ldquo;Uso o Jusdex toda semana para acompanhar os temas de repercussão
                geral sem perder tempo lendo inteiro cada acórdão.&rdquo;
              </blockquote>
              <figcaption className="text-sm font-semibold text-ink-900">
                Rafael, Advogado tributarista
              </figcaption>
              <p className="text-[11px] text-muted-foreground mt-2">depoimento ilustrativo</p>
            </figure>
            <figure className="rounded-xl border border-border bg-card p-6 text-left">
              <Scale className="h-5 w-5 text-brass-600 mb-3" strokeWidth={1.5} />
              <blockquote className="text-ink-700 text-sm italic mb-4">
                &ldquo;A organização por ramo do Direito e as anotações pessoais mudaram
                a forma como reviso jurisprudência antes das provas.&rdquo;
              </blockquote>
              <figcaption className="text-sm font-semibold text-ink-900">
                Beatriz, Concurseira — carreiras jurídicas federais
              </figcaption>
              <p className="text-[11px] text-muted-foreground mt-2">depoimento ilustrativo</p>
            </figure>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-ink-900 text-paper py-16 px-4 text-center">
        <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-4">
          Pronto para transformar sua rotina de estudos ou trabalho?
        </h2>
        <p className="mb-8 text-ink-200 max-w-xl mx-auto">
          Comece hoje mesmo a usar o Jusdex e tenha jurisprudência do STF, STJ e
          Corte IDH sempre atualizada, organizada e ao seu alcance.
        </p>
        <Link
          href={"/register/"}
          className="inline-block bg-brass-500 hover:bg-brass-400 text-ink-950 font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          Crie sua conta
        </Link>
      </section>
    </main>
  );
}
