import { NextResponse } from "next/server";
import { queryJulgados } from "@/lib/queries/julgados";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    const result = await queryJulgados({
      court: url.searchParams.get("court"),
      ramoDireito: url.searchParams.get("ramoDireito"),
      assunto: url.searchParams.get("assunto"),
      situacaoRepGeral: url.searchParams.get("situacaoRepGeral"),
      situacaoTema: url.searchParams.get("situacaoTema"),
      searchText: url.searchParams.get("searchText"),
      searchTema: url.searchParams.get("searchTema"),
      sortField: url.searchParams.get("sortField"),
      sortOrder: url.searchParams.get("sortOrder"),
      page: url.searchParams.get("page"),
      limit: url.searchParams.get("limit"),
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro ao buscar julgados:", error);
    return NextResponse.json(
      { error: "Erro ao buscar julgados" },
      { status: 500 }
    );
  }
}
