import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectToDb } from "@/app/api/db";
import { authOptions } from "@/lib/auth";
import { sanitizeEditorHtml } from "@/lib/sanitize";
import { ObjectId } from "mongodb";

// Função para o método POST - Publicar o texto
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Acesso negado!" }, { status: 401 });
    }

    const { text, tema } = await request.json();

    const { db } = await connectToDb();

    // Salvar o texto no banco de dados (userId sempre vem da sessão, nunca do cliente)
    await db.collection("userPrivateNotes").insertOne({
      text: sanitizeEditorHtml(text),
      tema,
      userId: session.user.id,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: "Texto publicado com sucesso!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Erro ao publicar o texto. na API" }, { status: 500 });
  }
}

// Função para o método GET - Obter as anotações do usuário autenticado
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Acesso negado!" }, { status: 401 });
    }

    const { db } = await connectToDb();

    const { searchParams } = new URL(req.url);
    const temaParam = searchParams.get("tema")?.trim(); // Agora é opcional

    const tema = temaParam ? Number(temaParam) : null;
    // userId sempre vem da sessão, nunca do parâmetro da URL, para evitar
    // que um usuário leia as anotações privadas de outro.
    const query = { tema, userId: session.user.id }

    const posts = await db.collection("userPrivateNotes").find(query).toArray();

    return NextResponse.json(posts);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Erro ao buscar os textos." }, { status: 500 });
  }
}

// Função para o método PUT - Atualizar os textos publicados

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Acesso negado!" }, { status: 401 });
    }

    const { id, text } = await req.json();
    const { db } = await connectToDb();

    const existing = await db.collection("userPrivateNotes").findOne({ _id: new ObjectId(id) });
    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ message: "Acesso negado!" }, { status: 403 });
    }

    await db.collection("userPrivateNotes").updateOne(
      { _id: new ObjectId(id) },
      { $set: { text: sanitizeEditorHtml(text) } }
    );

    return NextResponse.json({ message: "Comentário atualizado com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar comentário:", error);
    return NextResponse.json({ error: "Erro ao atualizar comentário" }, { status: 500 });
  }
}
