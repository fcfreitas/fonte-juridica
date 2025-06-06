import { connectToDb } from "@/app/api/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Acessa os parâmetros da URL da requisição
    const url = new URL(request.url);
    const ramoDireito = url.searchParams.get("ramoDireito");
    const assunto = url.searchParams.get("assunto");
    const situacaoTema = url.searchParams.get("situacaoTema");
    const campoTexto = url.searchParams.get("searchText");
    const campoTema = url.searchParams.get("searchTema");
    const sortField = url.searchParams.get("sortField") || "tema"; // campo padrão
    const sortOrder = url.searchParams.get("sortOrder") === "asc" ? 1 : -1; // asc ou desc


    console.log("🔍 Parâmetros recebidos:", { ramoDireito, assunto, situacaoTema, campoTexto, campoTema });

    // Conectar ao banco de dados
    const { db } = await connectToDb();

    // Criar a query com base nos filtros
    const query: any = {};

    // Filtro por ramoDireito
    if (ramoDireito && ramoDireito.trim() !== "") {
      query.ramoDireito = { $regex: ramoDireito.trim(), $options: "i" }; // Case insensitive
    }

    // Filtro por assunto
    if (assunto) {
      console.log("📌 Aplicando filtro de Assunto:", assunto);
      query.assunto_array = { $regex: assunto.trim() };
    }

    // Filtro por situacaoTema
    if (situacaoTema && situacaoTema.trim() !== "") {
      query.situacaoTema = { $regex: situacaoTema.trim(), $options: "i" }; // Case insensitive
    }

    // Filtro por campoTexto em todos os campos
    if (campoTexto && campoTexto.trim() !== "") {
      const searchRegex = { $regex: campoTexto.trim(), $options: "i" }; // Case insensitive

      query.$or = [
        { tema: searchRegex },
        { leadingCase: searchRegex},
        { relator: searchRegex},
        { titulo: searchRegex},
        { descricao: searchRegex},
        { tese: searchRegex},
        { ramoDireito: searchRegex },
        { assunto: searchRegex },
        { situacaoRepGeral: searchRegex },
        { situacaoTema: searchRegex },
        { tema: { $eq: parseInt(campoTexto) } } // Caso tema seja um número e a pesquisa seja numérica
      ];
    }

    // Filtro por campoTema em tema
    if (campoTema && campoTema.trim() !== "") {
      query.tema = parseInt(campoTema); // Caso tema seja um número e a pesquisa seja numérica
    }

    console.log("🛠 Query gerada:", JSON.stringify(query, null, 2));


    // Se for ordenar por dataTese.toDate, converte pra Date
    let pipeline: any[] = [{ $match: query }];

    if (sortField === "dataTese") {
      pipeline.push({
        $addFields: {
          dataTeseDate: {
            $dateFromString: {
              dateString: "$dataTese",
              format: "%d/%m/%Y",
              onError: null,
              onNull: null
            }
          },
          temDataTese: {
            $cond: {
              if: {
                $ne: [
                  {
                    $dateFromString: {
                      dateString: "$dataTese",
                      format: "%d/%m/%Y",
                      onError: null,
                      onNull: null
                    }
                  },
                  null
                ]
              },
              then: true,
              else: false
            }
          }
        }
      });
    
      pipeline.push({
        $sort: {
          temDataTese: -1, // Entradas com data vêm primeiro
          dataTeseDate: sortOrder
        }
      });
    } else {
      pipeline.push({ $sort: { [sortField]: sortOrder } });
    }

    // Buscar os repetitivos com os filtros e limitar o tempo da consulta
    const repetitivos = await db
      .collection("repetitivos")
      .aggregate(pipeline)
      .maxTimeMS(10000) // Timeout de 10 segundos para evitar travamentos
      .toArray();

    console.log(`✅ Repetitivos retornados: ${repetitivos.length}`);

    return NextResponse.json(repetitivos);

  } catch (error) {
    console.error("❌ Erro ao buscar repetitivos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar repetitivos", details: error },
      { status: 500 }
    );
  }
}
