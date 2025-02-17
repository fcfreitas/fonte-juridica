import { connectToDb } from "@/app/api/db";
import { NextResponse } from "next/server";
import Julgado from "@/models/Julgado"; // Certifique-se de que este é o modelo correto

export async function GET(request: Request) {
  try {
    // Acessa os parâmetros da URL da requisição
    const url = new URL(request.url);
    const court = url.searchParams.get('court');
    const ramoDireito = url.searchParams.get('ramoDireito');
    const assunto = url.searchParams.get('assunto');

    // Conectar ao banco de dados
    const { db } = await connectToDb();

    // Criar a query com base nos filtros
    const query: any = {};

    if (court) query.mainCourt = court;
    if (ramoDireito) query.ramoDireito = ramoDireito;

    if (assunto) {
      query.assunto_array = {
        $elemMatch: {
          $eq: assunto.trim(), // Comparar diretamente com o valor da posição 1 do array
        }
      };
    }

    // Buscar os julgados com os filtros
    const julgados = await db.collection("julgados").find(query).toArray();

    return NextResponse.json(julgados);
  } catch (error) {
    console.error("Erro ao buscar julgados:", error);
    return NextResponse.json({ error: "Erro ao buscar julgados" }, { status: 500 });
  }
}
