import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { reviews } from "@db/schema";
import { eq, desc, sql } from "drizzle-orm";

export const reviewRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const { limit, offset } = input ?? {};

      const items = await db
        .select()
        .from(reviews)
        .orderBy(desc(reviews.createdAt))
        .limit(limit ?? 50)
        .offset(offset ?? 0);

      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(reviews);

      return { items, total: countResult[0]?.count ?? 0 };
    }),

  create: publicQuery
    .input(
      z.object({
        name: z.string(),
        rating: z.number().min(1).max(5),
        text: z.string(),
        date: z.string(),
        orderType: z.string().optional(),
        source: z.string().default("manual"),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(reviews).values(input);
      return { id: Number(result[0].insertId) };
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(reviews).where(eq(reviews.id, input.id));
      return { success: true };
    }),

  stats: publicQuery.query(async () => {
    const db = getDb();
    const total = await db
      .select({ count: sql<number>`count(*)` })
      .from(reviews);
    const avgRating = await db
      .select({ avg: sql<number>`avg(${reviews.rating})` })
      .from(reviews);
    return {
      total: total[0]?.count ?? 0,
      average: Math.round((avgRating[0]?.avg ?? 0) * 10) / 10,
    };
  }),
});
