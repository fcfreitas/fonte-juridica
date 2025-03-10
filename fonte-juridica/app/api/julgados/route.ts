import { connectToDb } from "@/app/api/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Acessa os parâmetros da URL da requisição
    const url = new URL(request.url);
    const court = url.searchParams.get("court");
    const ramoDireito = url.searchParams.get("ramoDireito");
    const assunto = url.searchParams.get("assunto");
    const situacaoRepGeral = url.searchParams.get("situacaoRepGeral");
    const situacaoTema = url.searchParams.get("situacaoTema");

    console.log("🔍 Parâmetros recebidos:", { court, ramoDireito, assunto, situacaoRepGeral, situacaoTema });

    // Conectar ao banco de dados
    const { db } = await connectToDb();

    // Criar a query com base nos filtros
    const query: any = {};

    // Filtro por tribunal (court)
    if (court) query.mainCourt = court;

    // Filtro por ramoDireito
    if (ramoDireito && ramoDireito.trim() !== "") {
      query.ramoDireito = { $regex: ramoDireito.trim(), $options: "i" }; // Case insensitive
    }

    // Filtro por assunto
    if (assunto) {
      console.log("📌 Aplicando filtro de Assunto:", assunto);
      query.assunto_array = { $regex: assunto.trim() };
    }

    // Filtro por situacaoRepGeral
    if (situacaoRepGeral && situacaoRepGeral.trim() !== "") {
      query.situacaoRepGeral = { $regex: situacaoRepGeral.trim(), $options: "i" }; // Case insensitive
    }

    // Filtro por situacaoTema
    if (situacaoTema && situacaoTema.trim() !== "") {
      query.situacaoTema = { $regex: situacaoTema.trim(), $options: "i" }; // Case insensitive
    }

    console.log("🛠 Query gerada:", JSON.stringify(query, null, 2));

    // Buscar os julgados com os filtros e limitar o tempo da consulta
    const julgados = await db
      .collection("julgados")
      .find(query)
      .sort({ tema: -1 })
      .maxTimeMS(10000) // Timeout de 10 segundos para evitar travamentos
      .toArray();

    console.log(`✅ Julgados retornados: ${julgados.length}`);

    return NextResponse.json(julgados);

  } catch (error) {
    console.error("❌ Erro ao buscar julgados:", error);
    return NextResponse.json(
      { error: "Erro ao buscar julgados", details: error },
      { status: 500 }
    );
  }
}
