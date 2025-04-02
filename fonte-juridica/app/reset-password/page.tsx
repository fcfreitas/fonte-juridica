// "use client";

// import { useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";

// export default function ResetPasswordPage() {
//   const searchParams = useSearchParams();
//   const token = searchParams.get("token");

//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setMessage("");
//     setError("");

//     if (password !== confirmPassword) {
//       setError("As senhas não coincidem.");
//       return;
//     }

//     const response = await fetch("/api/auth/reset-password", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ token, password }),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       setError(data.error);
//     } else {
//       setMessage("Senha redefinida com sucesso! Redirecionando para o login...");
//       setTimeout(() => router.push("/login"), 3000);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center p-16 h-screen">
//       <h1 className="text-2xl font-bold mb-4">Redefinir Senha</h1>

//       {message && <p className="text-green-500">{message}</p>}
//       {error && <p className="text-red-500">{error}</p>}

//       <form onSubmit={handleSubmit} className="flex flex-col items-center w-80">
//         <input
//           type="password"
//           placeholder="Nova senha"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="border p-2 mb-2 w-full"
//         />
//         <input
//           type="password"
//           placeholder="Confirme a nova senha"
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//           className="border p-2 mb-2 w-full"
//         />
//         <button type="submit" className="bg-blue-500 text-white p-2 w-full">
//           Redefinir Senha
//         </button>
//       </form>
//     </div>
//   );
// }
