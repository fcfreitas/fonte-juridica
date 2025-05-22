import { connectToDb } from "@/app/api/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ramoDireito = searchParams.get("ramoDireito") ?? "";

    const { db } = await connectToDb();
    if (!db) {
      return NextResponse.json(
        { error: "Falha na conexão com o banco de dados" },
        { status: 500 }
      );
    }

    // 1) valores únicos de ramoDireito
    const ramosDireito = await db.collection("repetitivos")
      .aggregate([
        { $group: { _id: "$ramoDireito" } },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    // 2) valores únicos de situacaoTema
    const situacaoTema = await db.collection("repetitivos")
      .aggregate([
        { $group: { _id: "$situacaoTema" } },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    // 3) Assuntos (2º elemento do array), opcional por ramoDireito
    const matchAssuntos: any = {
      "assunto_array.1": { $exists: true, $ne: null },
    };
    if (ramoDireito) {
      matchAssuntos.ramoDireito = {
        $regex: new RegExp(`^\\s*${ramoDireito}\\s*$`, "i"),
      };
    }

    const assuntos = await db
      .collection("repetitivos")
      .aggregate([
        { $match: matchAssuntos },
        { 
          $project: { 
            value: {
              $trim: {
                input: { $arrayElemAt: ["$assunto_array", 1] },
                chars: " "
              }
            }
          }
        },
        { $group: { _id: "$value" } },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    return NextResponse.json({
      ramosDireito: ramosDireito.map((r) => r._id ?? ""),
      situacaoTema: situacaoTema.map((s) => s._id ?? ""),
      assuntos: assuntos.map((a) => a._id ?? ""),
    });
  } catch (error: any) {
    console.error("❌ Erro ao buscar valores únicos:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}