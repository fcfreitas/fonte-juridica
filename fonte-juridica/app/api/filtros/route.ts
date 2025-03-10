import { connectToDb } from "@/app/api/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        // Captura os parâmetros da URL
        const url = new URL(request.url);
        const ramoDireito = url.searchParams.get("ramoDireito");

        console.log("🔄 Buscando valores com ramoDireito:", ramoDireito);

        const { db } = await connectToDb(); // Garante conexão ativa
        if (!db) {
            console.error("❌ Não foi possível conectar ao banco de dados");
            return NextResponse.json({ error: "Falha na conexão com o banco de dados" }, { status: 500 });
        }

        // Cria o filtro para o assunto_array[1] não ser nulo
        const match: any = { "assunto_array.1": { $exists: true, $ne: null } };

        // Se ramoDireito for fornecido, filtra também pelo ramoDireito
        if (ramoDireito) {
            match["ramoDireito"] = { $regex: new RegExp(ramoDireito, "i") }; // Filtro por ramoDireito
        }

        // Consulta para valores únicos de 'assunto_array[1]', com filtro opcional de ramoDireito
        const uniqueValues = await db.collection("julgados").aggregate([
            { $match: match },
            { 
                $project: { 
                    value: { $trim: { input: { $arrayElemAt: ["$assunto_array", 1] }, chars: " " } } 
                } 
            },
            { $group: { _id: "$value" } },
            { $sort: { _id: 1 } },
            { $limit: 500 }
        ]).toArray();

        console.log("🔍 Resultados de assunto:", uniqueValues);

        // Obter valores únicos de situacaoRepGeral com agregação
        const situacaoRepGeralValues = await db.collection("julgados").aggregate([
            { $group: { _id: "$situacaoRepGeral" } },
            { $sort: { _id: 1 } }
        ]).toArray();

        console.log("🔍 Resultados de situacaoRepGeral:", situacaoRepGeralValues);

        // Obter valores únicos de situacaoTema com agregação
        const situacaoTemaValues = await db.collection("julgados").aggregate([
            { $group: { _id: "$situacaoTema" } },
            { $sort: { _id: 1 } }
        ]).toArray();

        console.log("🔍 Resultados de situacaoTema:", situacaoTemaValues);

        // Retorna os valores encontrados
        return NextResponse.json({ 
            assuntos: uniqueValues.map((item) => item._id),
            situacaoRepGeralValues: situacaoRepGeralValues.map((item) => item._id),
            situacaoTemaValues: situacaoTemaValues.map((item) => item._id)
        });
    } catch (error) {
        console.error("❌ Erro ao buscar valores únicos:", error);
        return NextResponse.json({ error: "Erro ao buscar valores únicos", details: error }, { status: 500 });
    }
}
