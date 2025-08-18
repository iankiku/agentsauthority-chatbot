import { sql } from "drizzle-orm";
import { Request, Response } from "express";
import { db } from "../db";

export async function handleDebugTables(req: Request, res: Response) {
	try {
		const result = await db.execute(sql`
      SELECT schemaname, tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `);

		res.json({
			tables: result.rows,
			count: result.rows.length,
		});
	} catch (error) {
		console.error("[Debug Service] Error fetching tables:", error);
		res.status(500).json({ error: "Failed to fetch database tables" });
	}
}
