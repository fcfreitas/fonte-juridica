import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { connectToDb } from "../db";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
        return new Response(JSON.stringify({ message: "Todos os campos são obrigatórios!" }), {
          status: 400,
        });
      }

    const { db } = await connectToDb();

    // Verifica se o usuário já existe
    const existingUser = await db.collection("user").findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "E-mail já cadastrado!" }, { status: 400 });
    }

    // Criptografa a senha antes de salvar
    const hashedPassword = await hash(password, 10);
    const newUser = { name, email, password: hashedPassword };

    // Insere o usuário no banco
    await db.collection("user").insertOne(newUser);

    return NextResponse.json({ message: "Usuário cadastrado com sucesso!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao cadastrar usuário" }, { status: 500 });
  }
}
