import { connectToDb } from "@/app/api/db";

export interface JulgadosSearchParams {
  court?: string | null;
  ramoDireito?: string | null;
  assunto?: string | null;
  situacaoRepGeral?: string | null;
  situacaoTema?: string | null;
  searchText?: string | null;
  searchTema?: string | null;
  sortField?: string | null;
  sortOrder?: string | null;
  page?: string | number | null;
  limit?: string | number | null;
}

export interface JulgadosResult {
  items: Record<string, unknown>[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

// Compartilhado entre a rota /api/julgados e o carregamento inicial (SSR)
// da página de listagem, para não duplicar a lógica de filtros/ordenação/paginação.
export async function queryJulgados(params: JulgadosSearchParams): Promise<JulgadosResult> {
  const { db } = await connectToDb();

  const court = params.court?.trim();
  const ramoDireito = params.ramoDireito?.trim();
  const assunto = params.assunto?.trim();
  const situacaoRepGeral = params.situacaoRepGeral?.trim();
  const situacaoTema = params.situacaoTema?.trim();
  const campoTexto = params.searchText?.trim();
  const campoTema = params.searchTema?.trim();
  const sortField = params.sortField || "tema";
  const sortOrder = params.sortOrder === "asc" ? 1 : -1;

  const page = Math.max(1, Number(params.page) || 1);
  const limit = Math.min(MAX_LIMIT, Math.max(1, Number(params.limit) || DEFAULT_LIMIT));

  const query: Record<string, unknown> = {};

  if (court) query.mainCourt = court;
  if (ramoDireito) query.ramoDireito = { $regex: ramoDireito, $options: "i" };
  if (assunto) query.assunto_array = { $regex: assunto };
  if (situacaoRepGeral) query.situacaoRepGeral = { $regex: situacaoRepGeral, $options: "i" };
  if (situacaoTema) query.situacaoTema = { $regex: situacaoTema, $options: "i" };

  if (campoTexto) {
    const searchRegex = { $regex: campoTexto, $options: "i" };
    const or: Record<string, unknown>[] = [
      { tema: searchRegex },
      { leadingCase: searchRegex },
      { relator: searchRegex },
      { titulo: searchRegex },
      { descricao: searchRegex },
      { tese: searchRegex },
      { ramoDireito: searchRegex },
      { assunto: searchRegex },
      { situacaoRepGeral: searchRegex },
      { situacaoTema: searchRegex },
    ];
    const asNumber = Number(campoTexto);
    if (!Number.isNaN(asNumber)) {
      or.push({ tema: { $eq: asNumber } });
    }
    query.$or = or;
  }

  if (campoTema) {
    const temaNumber = Number(campoTema);
    if (!Number.isNaN(temaNumber)) {
      query.tema = temaNumber;
    }
  }

  const pipeline: Record<string, unknown>[] = [{ $match: query }];

  if (sortField === "dataTese") {
    pipeline.push({
      $addFields: {
        dataTeseDate: {
          $dateFromString: { dateString: "$dataTese", format: "%d/%m/%Y", onError: null, onNull: null },
        },
        temDataTese: {
          $cond: {
            if: {
              $ne: [
                { $dateFromString: { dateString: "$dataTese", format: "%d/%m/%Y", onError: null, onNull: null } },
                null,
              ],
            },
            then: true,
            else: false,
          },
        },
      },
    });
    pipeline.push({ $sort: { temDataTese: -1, dataTeseDate: sortOrder } });
  } else {
    pipeline.push({ $sort: { [sortField]: sortOrder } });
  }

  pipeline.push({
    $facet: {
      items: [{ $skip: (page - 1) * limit }, { $limit: limit }],
      totalCount: [{ $count: "count" }],
    },
  });

  const [result] = await db
    .collection("julgados")
    .aggregate(pipeline)
    .maxTimeMS(10000)
    .toArray();

  const items = (result?.items ?? []) as Record<string, unknown>[];
  const total = result?.totalCount?.[0]?.count ?? 0;

  return { items, total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) };
}
