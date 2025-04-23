import { NextResponse } from "next/server";
import { connectToDb } from "@/app/api/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { token, password } = await req.json();

  if (!token || !password) {
    return NextResponse.json({ error: "Token e senha são obrigatórios." }, { status: 400 });
  }

  const { db } = await connectToDb();

  // Buscar usuário pelo token
  const existingUser = await db.collection("user").findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }, // Verifica se o token ainda é válido
  });

  if (!existingUser) {
    return NextResponse.json({ error: "Token inválido ou expirado." }, { status: 400 });
  }

  // Hash da nova senha
  const hashedPassword = await bcrypt.hash(password, 10);

  // Atualizar o usuário com a nova senha e remover o token
  await db.collection("user").updateOne(
    { _id: existingUser._id }, // Localizar o usuário pela ID
    {
      $set: {
        password: hashedPassword, // Atualizar a senha
        resetPasswordToken: undefined, // Remover o token
        resetPasswordExpires: undefined, // Remover a data de expiração do token
      },
    }
  );

  return NextResponse.json({ message: "Senha redefinida com sucesso!" });
}
