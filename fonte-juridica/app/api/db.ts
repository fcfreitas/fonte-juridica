
import { MongoClient, Db, ServerApiVersion } from 'mongodb';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

const uri = process.env.MONGODB_URI as string;

export async function connectToDb() {
    if (cachedClient && cachedDb) {
        return {client: cachedClient, db: cachedDb}
    };

    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    await client.connect();

    cachedClient = client;
    cachedDb = client.db('fonte-juridica')

    return { client, db: cachedDb }
}