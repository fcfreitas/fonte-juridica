import { NextResponse } from "next/server";
import { connectToDb } from "../db";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const { userId, tema } = await req.json();
    if (!userId || !tema) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    const { db } = await connectToDb();
    const collection = db.collection("temasDestacados");

    // Verifica se já existe um registro para esse usuário e tema
    const existingRecord = await collection.findOne({ userId, tema });

    if (existingRecord) {
      // Alterna entre true e false e retorna o valor atualizado
      const updatedRecord = await collection.findOneAndUpdate(
        { _id: new ObjectId(existingRecord._id) },
        { $set: { destacado: !existingRecord.destacado } },
        { returnDocument: "after" } // Retorna o novo valor
      );
      return NextResponse.json({ success: true, destacado: updatedRecord?.value?.destacado });
    } else {
      // Insere um novo registro como destacado (true)
      const newRecord = await collection.insertOne({ userId, tema, destacado: true });
      return NextResponse.json({ success: true, destacado: true });
    }
  } catch (error) {
    console.error("Erro ao atualizar status de leitura:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const temaParam = searchParams.get("tema")?.trim(); // Agora é opcional

    if (!userId) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    const { db } = await connectToDb();
    const collection = db.collection("temasDestacados");

    const tema = temaParam ? Number(temaParam) : null;

    // Monta a query corretamente
    const query = tema !== null ? { userId, tema } : { userId };
    const records = await collection.find(query).toArray();

    // Log para garantir que estamos vendo o que estamos buscando
    console.log("Query:", query);
    console.log("Records encontrados:", records);

    // Se houver um tema específico, retorna o objeto diretamente
    if (tema !== null) {
      return NextResponse.json(records[0] || { destacado: false });
    }

    // Se não houver tema, retorna todos
    return NextResponse.json(records);
  } catch (error) {
    console.error("Erro ao buscar status de leitura:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
  
