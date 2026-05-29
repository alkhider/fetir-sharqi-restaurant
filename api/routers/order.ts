import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { orders, customers } from "@db/schema";
import { eq, desc, like, sql } from "drizzle-orm";

export const orderRouter = createRouter({
  // List orders with optional filtering
  list: publicQuery
    .input(
      z.object({
        status: z.string().optional(),
        search: z.string().optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const { status, search, limit, offset } = input ?? {};

      let query = db.select().from(orders);

      if (status) {
        query = query.where(eq(orders.status, status)) as typeof query;
      }

      if (search) {
        query = query.where(
          like(orders.customerName, `%${search}%`)
        ) as typeof query;
      }

      const items = await query
        .orderBy(desc(orders.createdAt))
        .limit(limit ?? 50)
        .offset(offset ?? 0);

      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(orders);

      return { items, total: countResult[0]?.count ?? 0 };
    }),

  // Get single order
  get: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(orders)
        .where(eq(orders.id, input.id));
      return result[0] ?? null;
    }),

  // Create order
  create: publicQuery
    .input(
      z.object({
        orderNumber: z.string(),
        customerName: z.string(),
        customerPhone: z.string(),
        customerId: z.number().optional(),
        type: z.string(),
        items: z.array(z.any()),
        amount: z.number(),
        tax: z.number().default(0),
        total: z.number(),
        status: z.string().default("pending"),
        payment: z.string().default("cash"),
        note: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(orders).values({
        ...input,
        amount: String(input.amount),
        tax: String(input.tax),
        total: String(input.total),
      });
      return { id: Number(result[0].insertId) };
    }),

  // Update order status
  updateStatus: publicQuery
    .input(
      z.object({
        id: z.number(),
        status: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(orders)
        .set({ status: input.status })
        .where(eq(orders.id, input.id));
      return { success: true };
    }),

  // Delete order
  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(orders).where(eq(orders.id, input.id));
      return { success: true };
    }),

  // Get stats
  stats: publicQuery.query(async () => {
    const db = getDb();
    const total = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders);
    const byStatus = await db
      .select({
        status: orders.status,
        count: sql<number>`count(*)`,
      })
      .from(orders)
      .groupBy(orders.status);
    const revenue = await db
      .select({ total: sql<number>`sum(${orders.total})` })
      .from(orders);

    return {
      total: total[0]?.count ?? 0,
      byStatus,
      revenue: revenue[0]?.total ?? 0,
    };
  }),
});
