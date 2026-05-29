import { createRouter, publicQuery } from "./middleware";
import { orderRouter } from "./routers/order";
import { customerRouter } from "./routers/customer";
import { reviewRouter } from "./routers/review";
import { menuRouter } from "./routers/menu";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),

  order: orderRouter,
  customer: customerRouter,
  review: reviewRouter,
  menu: menuRouter,
});

export type AppRouter = typeof appRouter;
