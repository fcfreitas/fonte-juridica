import { connectToDb } from "@/app/api/db";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { db } = await connectToDb();

        // Busca o usuário pelo e-mail
        const user = await db.collection("user").findOne({ email: credentials?.email });

        if (!user) throw new Error("Email ou senha incorretos");

        // Verifica se a senha está correta
        const passwordMatch = await bcrypt.compare(credentials!.password, user.password);
        if (!passwordMatch) throw new Error("Email ou senha incorretos");

        return { id: user._id.toString(), name: user.name, email: user.email };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = String(user.id); // Garante que será uma string
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = String(token.id); // Garante que será uma string
      }
      return session;
    },
  },
  pages: {
    signIn: process.env.NEXT_PUBLIC_SITE_URL+"/login",
  },
};