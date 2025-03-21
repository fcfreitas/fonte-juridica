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
    const collection =  db.collection("temasLidos");

    // Verifica se já existe um registro para esse usuário e tema
    const existingRecord = await collection.findOne({ userId, tema });

    if (existingRecord) {
      // Alterna entre true e false
      const updatedRecord = await collection.updateOne(
        { _id: new ObjectId(existingRecord._id) },
        { $set: { lido: !existingRecord.lido } }
      );
      return NextResponse.json({ success: true, lido: !existingRecord.lido });
    } else {
      // Insere um novo registro como lido (true)
      await collection.insertOne({ userId, tema, lido: true });
      return NextResponse.json({ success: true, lido: true });
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
      const tema = searchParams.get("tema"); // Agora é opcional
  
      if (!userId) {
        return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
      }
  
      const { db } = await connectToDb();
      const collection = db.collection("temasLidos");
  
      // Busca todos os temas do usuário ou um tema específico
      const query = tema ? { userId, tema } : { userId };
      const records = await collection.find(query).toArray();
  
      // Se houver um tema específico, retorna o objeto diretamente
      if (tema) {
        return NextResponse.json(records[0] || { lido: false });
      }
  
      // Se não houver tema, retorna todos
      return NextResponse.json(records);
    } catch (error) {
      console.error("Erro ao buscar status de leitura:", error);
      return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
  }  
