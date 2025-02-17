import { connectToDb } from "@/app/api/db";
import { NextRequest } from "next/server"
import { ObjectId } from "mongodb";

// import { julgados } from "@/app/julgados-data"


// type Params =  { 
//     id:string;
// }

export async function GET(request: NextRequest, context: { params: { id: string } }) {

    try {
        const { params } = context; // Extraindo `params` corretamente
        if (!params || !params.id) {
          return new Response(JSON.stringify({ error: "ID não fornecido" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
    
        const { db } = await connectToDb();
        
        // Converter o ID para ObjectId (se necessário)
        const julgadoId = new ObjectId(params.id);
    
        // Buscar o julgado pelo ID corretamente
        const julgado = await db.collection("julgados").findOne({ _id: julgadoId });
    
        if (!julgado) {
          return new Response(JSON.stringify({ error: "Julgado não encontrado" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }
    
        return new Response(JSON.stringify(julgado), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
    
      } catch (error) {
        console.error("Erro ao buscar julgado:", error);
        return new Response(JSON.stringify({ error: "Erro interno do servidor" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }