import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { queryJulgados } from "@/lib/queries/julgados";
import { Julgado } from "../julgados-data";
import JulgadosPageClient from "./JulgadosPageClient";

export const dynamic = "force-dynamic";

export default async function JulgadosPage() {
  const session = await getServerSession(authOptions);

  // Só busca os dados no servidor quando a assinatura é válida: o conteúdo é
  // exclusivo para assinantes e não deve aparecer no HTML para quem não tem acesso
  // (a tela cliente cuida do redirecionamento/blur para os demais casos).
  const agora = Math.floor(Date.now() / 1000);
  const assinaturaValida = !!session?.user?.expireDate && session.user.expireDate > agora;

  if (!assinaturaValida) {
    return <JulgadosPageClient />;
  }

  const { items, total } = await queryJulgados({
    sortField: "tema",
    sortOrder: "desc",
    page: 1,
    limit: 20,
  });

  return (
    <JulgadosPageClient
      initialJulgados={items as unknown as Julgado[]}
      initialTotal={total}
    />
  );
}
