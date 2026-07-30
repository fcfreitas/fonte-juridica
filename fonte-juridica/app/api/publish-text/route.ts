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
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Acesso negado!" }, { status: 403 });
    }

    const { text, tema } = await request.json();

    const { db } = await connectToDb();

    // Salvar o texto no banco de dados
    await db.collection("posts").insertOne({
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

// Função para o método GET - Obter todos os textos publicados
export async function GET(req: Request) {
  try {
    const {db} = await connectToDb();

    const { searchParams } = new URL(req.url);
    const temaParam = searchParams.get("tema")?.trim(); // Agora é opcional

    const tema = temaParam ? Number(temaParam) : null;
    const query = { tema }

    const posts = await db.collection("posts").find(query).toArray();

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
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Acesso negado!" }, { status: 403 });
    }

    const { id, text } = await req.json();
    const { db } = await connectToDb();

    await db.collection("posts").updateOne(
      { _id: new ObjectId(id) },
      { $set: { text: sanitizeEditorHtml(text) } }
    );

    return NextResponse.json({ message: "Comentário atualizado com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar comentário:", error);
    return NextResponse.json({ error: "Erro ao atualizar comentário" }, { status: 500 });
  }
}
