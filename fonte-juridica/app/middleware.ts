// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { verify } from "jsonwebtoken";

// export function middleware(req: NextRequest) {
//   const token = req.cookies.get("token")?.value;

//   // Se a página for protegida e não houver token, redireciona para login
//   if (!token && req.nextUrl.pathname.startsWith("/buscar")) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   try {
//     verify(token as string, process.env.JWT_SECRET as string);
//     return NextResponse.next();
//   } catch {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }
// }

// export const config = {
//   matcher: ["/buscar/:path*"], // Protege todas as páginas dentro de /buscar
// };
