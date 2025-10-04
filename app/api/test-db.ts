import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collections = await db.listCollections().toArray();
    res.status(200).json({
      dbName: db.databaseName,
      collections: collections.map(c => c.name),
    });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
