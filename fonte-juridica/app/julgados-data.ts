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