import { connectToDb } from "@/app/api/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 });
    }

    const { db } = await connectToDb();

    // Verifica se o usuário já existe
    const existingUser = await db.collection("user").findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Usuário já cadastrado" }, { status: 400 });
    }

    // Criptografa a senha antes de salvar
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o usuário no banco de dados
    const newUser = {
      name,
      email,
      password: hashedPassword,
    };

    await db.collection("user").insertOne(newUser);

    return NextResponse.json({ message: "Usuário cadastrado com sucesso" }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: "Erro no servidor" }, { status: 500 });
  }
}
