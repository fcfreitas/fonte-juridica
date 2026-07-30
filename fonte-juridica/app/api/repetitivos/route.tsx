import { NextResponse } from "next/server";
import { queryRepetitivos } from "@/lib/queries/repetitivos";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    const result = await queryRepetitivos({
      ramoDireito: url.searchParams.get("ramoDireito"),
      assunto: url.searchParams.get("assunto"),
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
    console.error("Erro ao buscar repetitivos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar repetitivos" },
      { status: 500 }
    );
  }
}
