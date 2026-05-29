import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { customers } from "@db/schema";
import { eq, desc, like, sql } from "drizzle-orm";

export const customerRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        search: z.string().optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const { search, limit, offset } = input ?? {};

      let query = db.select().from(customers);

      if (search) {
        query = query.where(
          like(customers.name, `%${search}%`)
        ) as typeof query;
      }

      const items = await query
        .orderBy(desc(customers.createdAt))
        .limit(limit ?? 50)
        .offset(offset ?? 0);

      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(customers);

      return { items, total: countResult[0]?.count ?? 0 };
    }),

  get: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(customers)
        .where(eq(customers.id, input.id));
      return result[0] ?? null;
    }),

  create: publicQuery
    .input(
      z.object({
        name: z.string(),
        phone: z.string(),
        address: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(customers).values(input);
      return { id: Number(result[0].insertId) };
    }),

  update: publicQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const db = getDb();
      await db.update(customers).set(data).where(eq(customers.id, id));
      return { success: true };
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(customers).where(eq(customers.id, input.id));
      return { success: true };
    }),

  stats: publicQuery.query(async () => {
    const db = getDb();
    const total = await db
      .select({ count: sql<number>`count(*)` })
      .from(customers);
    return { total: total[0]?.count ?? 0 };
  }),
});
