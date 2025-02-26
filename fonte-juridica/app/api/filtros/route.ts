import { connectToDb } from "@/app/api/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        // Captura o parâmetro 'ramoDireito' da URL
        const url = new URL(request.url);
        const ramoDireito = url.searchParams.get("ramoDireito");

        console.log("🔄 Buscando valores únicos de 'assunto_array[1]' com ramoDireito:", ramoDireito);

        const { db } = await connectToDb(); // Garante conexão ativa

        // Cria o filtro inicial para o assunto_array[1] não ser nulo
        const match: any = { "assunto_array.1": { $exists: true, $ne: null } };

        // Adiciona o filtro do ramoDireito, se fornecido
        if (ramoDireito) {
            match["ramoDireito"] = { $regex: new RegExp(ramoDireito, "i") };; // Adiciona o filtro de ramoDireito
        }

        // Realiza a consulta com o filtro aplicado
        const uniqueValues = await db.collection("julgados").aggregate([
            { $match: match }, // Aplica o filtro de ramoDireito (se existir)
            { 
                $project: { 
                    value: { $trim: { input: { $arrayElemAt: ["$assunto_array", 1] }, chars: " " } } 
                } 
            }, // Remove espaços extras antes e depois
            { $group: { _id: "$value" } }, // Remove duplicatas após o trim
            { $sort: { _id: 1 } }, // Ordena resultados
            { $limit: 500 } // Limita a quantidade de resultados para evitar sobrecarga
        ]).toArray();

        console.log(`✅ ${uniqueValues.length} valores encontrados.`);

        // Retorna os valores encontrados
        return NextResponse.json({ values: uniqueValues.map((item) => item._id) });
    } catch (error) {
        console.error("❌ Erro ao buscar valores únicos:", error);
        return NextResponse.json({ error: "Erro ao buscar valores únicos" }, { status: 500 });
    }
}
