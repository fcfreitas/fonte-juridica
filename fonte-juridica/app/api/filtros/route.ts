import { connectToDb } from "@/app/api/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        console.log("🔄 Buscando valores únicos de 'assunto_array[1]'...");

        const { db } = await connectToDb(); // Garante conexão ativa

        const uniqueValues = await db.collection("julgados").aggregate([
            { $match: { "assunto_array.1": { $exists: true, $ne: null } } }, // Evita valores nulos
            { 
                $project: { 
                    value: { $trim: { input: { $arrayElemAt: ["$assunto_array", 1] }, chars: " " } } 
                } 
            }, // Remove espaços extras antes e depois
            { $group: { _id: "$value" } }, // Remove duplicatas após o trim
            { $sort: { _id: 1 } }, // Ordena resultados
            { $limit: 500 } // Evita sobrecarga no servidor
        ]).toArray();

        console.log(`✅ ${uniqueValues.length} valores encontrados.`);

        return NextResponse.json({ values: uniqueValues.map((item) => item._id) });
    } catch (error) {
        console.error("❌ Erro ao buscar valores únicos:", error);
        return NextResponse.json({ error: "Erro ao buscar valores únicos" }, { status: 500 });
    }
}
