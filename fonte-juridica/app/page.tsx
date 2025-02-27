"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  return (
<>
  <div className="container mx-auto p-8 flex flex-col h-full">
    <div className="group flex w-full">
      <div className="flex-1 flex flex-col min-h-screen">
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-8 place-items-center">
            <Link
              href={"/stf-rep-geral/"}
              className="w-3/4 aspect-square bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition duration-300 flex flex-col items-center justify-center text-center"
            >
              <h2 className="text-2xl font-bold text-slate-800">STF</h2>
              <p className="text-base text-slate-700 mt-1">Temas de Repercussão Geral</p>
            </Link>
            <Link
              href={"/stf-jurisprudencias/"}
              className="w-3/4 aspect-square bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition duration-300 flex flex-col items-center justify-center text-center"
            >
              <h2 className="text-2xl font-bold text-slate-800">STF</h2>
              <p className="text-base text-slate-700 mt-1">Jurisprudências</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
</>
  );
}