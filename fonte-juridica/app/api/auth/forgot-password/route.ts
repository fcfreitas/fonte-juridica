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
    from:`"Fonte Jurídica" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Recuperação de Senha - Fonte Jurídica",
    text: `Recebemos uma solicitação para redefinir sua senha. Se foi você, clique no link a seguir: ${resetLink}`,
    html: `
      <div style="font-family:Arial, sans-serif; background-color:#f8fafc; color:#0f172a; padding:40px 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <h2 style="color: #0f172a; margin-bottom: 20px;">Redefinir sua senha</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #334155;">
            Recebemos uma solicitação para redefinir a senha da sua conta no <strong>Fonte Jurídica</strong>.
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #334155;">
            Se foi você, clique no botão abaixo. O link é válido por 1 hora.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color:#0069a8; color:#ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Redefinir senha
            </a>
          </div>
          <p style="font-size: 14px; color: #64748b;">
            Se você não solicitou essa alteração, pode ignorar este e-mail com segurança.
          </p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">
            © ${new Date().getFullYear()} Fonte Jurídica. Todos os direitos reservados.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: "E-mail enviado com sucesso!" });
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    return NextResponse.json({ error: "Erro ao enviar o e-mail." }, { status: 500 });
  }
}