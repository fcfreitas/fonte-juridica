import { NextResponse } from "next/server";
import { connectToDb } from "@/app/api/db";

// Função para o método POST - Publicar o texto
export async function POST(request: Request) {
  try {
    const { db }  = await connectToDb();
    const { text, userId, role } = await request.json();

    // Verificar se o usuário é admin
    if (role !== "admin") {
      return NextResponse.json({ message: "Acesso negado!" }, { status: 403 });
    }

    // Salvar o texto no banco de dados
    await db.collection("posts").insertOne({
      text,
      userId,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: "Texto publicado com sucesso!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Erro ao publicar o texto. na API" }, { status: 500 });
  }
}

// Função para o método GET - Obter todos os textos publicados
export async function GET() {
  try {
    const {db} = await connectToDb();
    const posts = await db.collection("posts").find().toArray();

    return NextResponse.json(posts);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Erro ao buscar os textos." }, { status: 500 });
  }
}
