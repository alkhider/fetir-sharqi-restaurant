import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { menuItemsDb } from "@db/schema";
import { eq, desc, sql } from "drizzle-orm";

export const menuRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    const items = await db
      .select()
      .from(menuItemsDb)
      .orderBy(menuItemsDb.category, menuItemsDb.name);
    return items;
  }),

  getById: publicQuery
    .input(z.object({ itemId: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(menuItemsDb)
        .where(eq(menuItemsDb.itemId, input.itemId));
      return result[0] ?? null;
    }),

  create: publicQuery
    .input(
      z.object({
        itemId: z.string(),
        name: z.string(),
        description: z.string().optional(),
        price: z.number(),
        priceLarge: z.number().optional(),
        calories: z.number().optional(),
        caloriesLarge: z.number().optional(),
        category: z.string(),
        image: z.string(),
        isHot: z.number().default(0),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(menuItemsDb).values({
        ...input,
        price: String(input.price),
        priceLarge: input.priceLarge ? String(input.priceLarge) : null,
      });
      return { id: Number(result[0].insertId) };
    }),

  update: publicQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        price: z.number().optional(),
        priceLarge: z.number().optional(),
        calories: z.number().optional(),
        caloriesLarge: z.number().optional(),
        category: z.string().optional(),
        image: z.string().optional(),
        isHot: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const db = getDb();
      const updateData: Record<string, any> = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.price !== undefined) updateData.price = String(data.price);
      if (data.priceLarge !== undefined) updateData.priceLarge = data.priceLarge ? String(data.priceLarge) : null;
      if (data.calories !== undefined) updateData.calories = data.calories;
      if (data.caloriesLarge !== undefined) updateData.caloriesLarge = data.caloriesLarge;
      if (data.category !== undefined) updateData.category = data.category;
      if (data.image !== undefined) updateData.image = data.image;
      if (data.isHot !== undefined) updateData.isHot = data.isHot;

      await db.update(menuItemsDb).set(updateData).where(eq(menuItemsDb.id, id));
      return { success: true };
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(menuItemsDb).where(eq(menuItemsDb.id, input.id));
      return { success: true };
    }),

  stats: publicQuery.query(async () => {
    const db = getDb();
    const total = await db
      .select({ count: sql<number>`count(*)` })
      .from(menuItemsDb);
    const byCategory = await db
      .select({
        category: menuItemsDb.category,
        count: sql<number>`count(*)`,
      })
      .from(menuItemsDb)
      .groupBy(menuItemsDb.category);
    return { total: total[0]?.count ?? 0, byCategory };
  }),
});
