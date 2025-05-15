import { connectToDb } from "@/app/api/db";
import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    // Aguarde a resolução dos parâmetros
    const { params } = await context;

    if (!params?.id) {
      return new Response(JSON.stringify({ error: "ID não fornecido" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { db } = await connectToDb();

    // Verifica se o ID é válido antes de converter
    if (!ObjectId.isValid(params.id)) {
      return new Response(JSON.stringify({ error: "ID inválido" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const repetitivoId = new ObjectId(params.id);
    const repetitivo = await db.collection("repetitivos").findOne({ _id: repetitivoId });

    if (!repetitivo) {
      return new Response(JSON.stringify({ error: "Repetitivo não encontrado" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(repetitivo), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Erro ao buscar julgado:", error);
    return new Response(JSON.stringify({ error: "Erro interno do servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
