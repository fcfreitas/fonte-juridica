import { connectToDb } from "../db";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ message: "Preencha todos os campos!" }), {
        status: 400,
      });
    }

    const { db } = await connectToDb();

    // Busca o usuário pelo email
    const user = await db.collection("user").findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ message: "Usuário não encontrado!" }), {
        status: 404,
      });
    }

    // Verifica a senha
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return new Response(JSON.stringify({ message: "Senha incorreta!" }), {
        status: 401,
      });
    }

    // Certifica-se de que a variável JWT_SECRET está definida
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET não está definido no ambiente!");
      return new Response(JSON.stringify({ message: "Erro no servidor!" }), {
        status: 500,
      });
    }

    // Gera um token JWT
    const token = sign({ id: user._id, email: user.email }, process.env.JWT_SECRET as string, {
      expiresIn: "3h",
    });

    // Obtém os cookies antes de defini-los    
    const cookieStore = await cookies(); // Obtém a store de cookies mutável
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS apenas em produção
      maxAge: 10800, // 3 horas
      path: "/",
    });

    return new Response(JSON.stringify({ message: "Login bem-sucedido!" }), {
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ message: "Erro no servidor!" }), {
      status: 500,
    });
  }
}
