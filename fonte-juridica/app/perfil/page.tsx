// 'use client';

// import { useSession } from 'next-auth/react';

// export default function Perfil() {
//   const { data: session } = useSession();

//   const pagante = session?.user?.pagante; // Esse campo deveria vir do MongoDB via NextAuth session

//   return (
//     <div className="max-w-2xl mx-auto py-10 px-4">
//       <h1 className="text-2xl font-bold text-center mb-6">Meu Perfil</h1>

//       <div className="border p-6 rounded-2xl shadow-md text-center">
//         <h2 className="text-xl font-semibold mb-2">{session?.user.name}</h2>
//         <p className="text-lg">{session?.user.email}</p>

//         <div className="mt-6">
//           {pagante ? (
//             <div className="text-green-600 font-semibold">Assinatura Ativa ✅</div>
//           ) : (
//             <div className="text-red-600 font-semibold">Sem assinatura ativa ❌</div>
//           )}
//         </div>

//         {!pagante && (
//           <a
//             href="/assinatura"
//             className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl transition"
//           >
//             Assinar agora
//           </a>
//         )}
//       </div>
//     </div>
//   );
// }
