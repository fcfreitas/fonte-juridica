import { IntegerType } from "mongodb";

export interface Julgado {
    _id: string;
    tema: IntegerType;
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

  export interface Processo {
  // Exemplo de estrutura. Adapte com os campos reais dos processos
  processo: string;
  numeroRegistro?: IntegerType;
  tribunalOrigem: string;
  rrc: string;
  relatorAfetouProc: string;
  relatorAtual: string;
  dataAfetacao: string;
  vistaMPF: string;
  julgadoEm: string;
  acordaoPublicadoEm: string;
}

export interface Repetitivo {
  _id: string;
  tema: IntegerType;
  anotacoesNUGEPNAC: string;
  assunto: string;
  assunto_array: string[];
  delimitacaoJulgado: string;
  entendimentoAnterior?: string;
  informacoesComplementares?: string;
  orgaoJulgador: string;
  processoSTF?: string;
  processos: Processo[];
  questaoSubmetidaJulgamento: string;
  ramoDireito: string;
  referenciaLegs?: string;
  referenciaSumular?: string;
  repercussaoGeral: string;
  situacaoTema: string;
  sumulaOrigTema?: string;
  teseFirmada: string;
}
  
//   export const julgados: Julgado[] = [{
//     id: '123',
//     textUrl: 'https://redir.stf.jus.br/paginadorpub/paginador.jsp?docTP=TP&docID=753077366',
//     name: 'Julgado da Laura 123',
//     description: 'Laura is a good fellah',
//     mainCourt: 'STF',
//     category: 'Ambiental',
//     subCategory: 'Florestas',
//     subject: 'Desmatamento',
//     releaseDate: '2024-01-16',
//     keyWords: ['STF', 'Laura', 'Ambiental']
//   },
//   {
//     id: '234',
//     textUrl: '234.pdf',
//     name: 'Julgado do Xandao',
//     description: 'Xandao é um ministro bem legal',
//     mainCourt: 'STF',
//     category: 'Penal',
//     subCategory: 'Crime Financeiro',
//     subject: 'Corrupção',
//     releaseDate: '2016-12-12',
//     keyWords: ['STF', 'Xandao', 'Corrupção']
//   },
//   {
//     id: '345',
//     textUrl: '345.pdf',
//     name: 'Julgado do Além',
//     description: 'Estamos inventando coisas por aqui.',
//     mainCourt: 'STJ',
//     category: 'Civil',
//     subCategory: 'Família',
//     subject: 'Sucessões',
//     releaseDate: '2020-07-15',
//     keyWords: ['STJ', 'Família', 'Sucessões']
//   }
// ];