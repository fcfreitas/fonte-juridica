// import { NextResponse } from "next/server";
// import { connectToDb } from "../../db";
// import User from "@/models/User";
// import bcrypt from "bcryptjs";

// export async function POST(req: Request) {
//   const { token, password } = await req.json();

//   if (!token || !password) {
//     return NextResponse.json({ error: "Token e senha são obrigatórios." }, { status: 400 });
//   }

//   await connectToDb();

//   // Buscar usuário pelo token
//   const user = await User.findOne({
//     resetPasswordToken: token,
//     resetPasswordExpires: { $gt: Date.now() }, // Verifica se o token ainda é válido
//   });

//   if (!user) {
//     return NextResponse.json({ error: "Token inválido ou expirado." }, { status: 400 });
//   }

//   // Hash da nova senha
//   const salt = await bcrypt.genSalt(10);
//   user.password = await bcrypt.hash(password, salt);

//   // Remover o token e salvar a nova senha
//   user.resetPasswordToken = undefined;
//   user.resetPasswordExpires = undefined;
//   await user.save();

//   return NextResponse.json({ message: "Senha redefinida com sucesso!" });
// }
