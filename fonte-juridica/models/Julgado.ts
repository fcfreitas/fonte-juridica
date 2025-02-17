import mongoose, { Document, Schema } from "mongoose";

// Definindo a estrutura do Julgado
interface IJulgado extends Document {
  _id: string;
  tema: number;
  leadingCase: string;
  relator: string;
  titulo: string;
  descricao: string;
  dataJulgamento: string;
  situacaoTema: string;
  tese: string;
  dataTese: string;
  situacaoRepGeral: string;
  linkProcesso: string;
  ramoDireito: string;
  assunto: string;
  assunto_array: string[];
}

const JulgadoSchema = new Schema<IJulgado>(
  {
    _id: { type: String, required: true},
    tema: { type: Number, required: true },
    leadingCase: { type: String, required: false },
    relator: { type: String, required: false },
    titulo: { type: String, required: false },
    descricao: { type: String, required: false },
    dataJulgamento: { type: String, required: false },
    situacaoTema: { type: String, required: false },
    tese: { type: String, required: false },
    dataTese: { type: String, required: false },
    situacaoRepGeral: { type: String, required: false },
    linkProcesso: { type: String, required: false },
    ramoDireito: { type: String, required: false },
    assunto: { type: String, required: false },
    assunto_array: { type: [String], required: false },
  },
  { timestamps: true }
);

// Criação do modelo Julgado
const Julgado = mongoose.models.Julgado || mongoose.model<IJulgado>("Julgado", JulgadoSchema);

export default Julgado;
