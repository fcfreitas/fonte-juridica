import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { queryRepetitivos } from "@/lib/queries/repetitivos";
import { Repetitivo } from "../julgados-data";
import RepetitivosPageClient from "./RepetitivosPageClient";

export const dynamic = "force-dynamic";

export default async function RepetitivosPage() {
  const session = await getServerSession(authOptions);

  // Só busca os dados no servidor quando a assinatura é válida: o conteúdo é
  // exclusivo para assinantes e não deve aparecer no HTML para quem não tem acesso
  // (a tela cliente cuida do redirecionamento/blur para os demais casos).
  const agora = Math.floor(Date.now() / 1000);
  const assinaturaValida = !!session?.user?.expireDate && session.user.expireDate > agora;

  if (!assinaturaValida) {
    return <RepetitivosPageClient />;
  }

  const { items, total } = await queryRepetitivos({
    sortField: "tema",
    sortOrder: "desc",
    page: 1,
    limit: 20,
  });

  return (
    <RepetitivosPageClient
      initialRepetitivos={items as unknown as Repetitivo[]}
      initialTotal={total}
    />
  );
}
