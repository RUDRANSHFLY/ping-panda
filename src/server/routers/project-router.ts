import { Router } from "jstack";
import { privateProcedure } from "../jstack";
import { addMonths, startOfMonth } from "date-fns";
import { db } from "../db/db";
import { eventCategories, quotas, users } from "../db/schema";
import { and, count, eq } from "drizzle-orm";
import { FREE_QUOTA, PRO_QUOTA } from "@/confg";
import z from "zod"

export const projectRouter = new Router({
    getUsage: privateProcedure.query(async ({ c, ctx }) => {
        const { user } = ctx;

        const currentDate = startOfMonth(new Date())

        const quota = await db.
            select().
            from(quotas)
            .where(
                and(
                    eq(quotas.userId, user?.id ?? ""),
                    eq(quotas.year, currentDate.getFullYear()),
                    eq(quotas.month, currentDate.getMonth() + 1)
                )
            );

        const eventCount = quota[0]?.count ?? 0;

        const categoryCount = await db.select({ count: count() }).from(eventCategories).where(eq(eventCategories.userId, user?.id ?? ""))


        const limits = user?.plan === "pro" ? PRO_QUOTA : FREE_QUOTA

        const resetDate = addMonths(currentDate, 1)

        return c.superjson({
            categoriesUsed: categoryCount[0]?.count,
            categoriesLimit: limits.maxEventCategories,
            eventsUsed: eventCount,
            eventsLimits: limits.maxEventsPerMonths,
            resetDate,
        })
    }),

    setDiscordId: privateProcedure.input(z.object({ discordId: z.string().max(20) })).mutation(async ({ c, ctx, input }) => {
        const { user } = ctx;
        const { discordId } = input;

        await db.update(users).set({ discordId: discordId }).where(eq(users.id, user?.id ?? ""));

        return c.json({success : true})
    })
})