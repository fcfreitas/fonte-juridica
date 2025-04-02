import { NextResponse } from "next/server";
import { connectToDb } from "../../db";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
    const { userEmail } = await request.json();
    const email = userEmail

    console.log("Buscar o email:", email)

  if (!email) {
    return NextResponse.json({ error: "E-mail obrigatório." }, { status: 400 });
  }

  const { db } = await connectToDb();
  const users = db.collection("user")

  // Buscar e atualizar o usuário diretamente no banco
  const resetToken = crypto.randomBytes(32).toString("hex");
  const user = await users.findOneAndUpdate(
    { email },
    {
      $set: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: Date.now() + 3600000, // 1 hora
      },
    },
    { returnDocument: "after" }
  );
  console.log("Usuário localizado: ", user)

  if (!user?.email) {
    return NextResponse.json({ error: "E-mail não encontrado." }, { status: 400 });
  }

  // Configurar transporte do Nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Construir e-mail
  const resetLink = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password?token=${resetToken}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Recuperação de Senha",
    text: `Clique no link para redefinir sua senha: ${resetLink}. Esse link é válido por 1 hora.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: "E-mail enviado com sucesso!" });
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    return NextResponse.json({ error: "Erro ao enviar o e-mail." }, { status: 500 });
  }
}