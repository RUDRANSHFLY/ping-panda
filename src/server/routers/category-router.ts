import { Router } from "jstack";
import { privateProcedure } from "../jstack";
import { db } from "../db/db";
import { eventCategories, events } from "../db/schema";
import { desc, eq, and, gte, count } from "drizzle-orm";
import { startOfMonth } from "date-fns";

export const categoryRouter = new Router({
    getEventCategories: privateProcedure.query(async ({ c, ctx }) => {
        const now = new Date();
        const firstDayOfMonth = startOfMonth(now);

        // Fetch categories for the user
        const categories = await db
            .select({
                id: eventCategories.id,
                name: eventCategories.name,
                emoji: eventCategories.emoji,
                color: eventCategories.color,
                updatedAt: eventCategories.updatedAt,
                createdAt: eventCategories.createdAt,
            })
            .from(eventCategories)
            .where(eq(eventCategories.userId, ctx.user?.id ?? ""))
            .orderBy(desc(eventCategories.updatedAt));

        // Process each category to calculate uniqueFieldCount, eventsCount, and lastPing
        const categoriesWithCounts = await Promise.all(
            categories.map(async (category) => {
                // Count the number of events for the category
                const eventsCount = await db
                    .select({
                        count: count(),
                    })
                    .from(events)
                    .where(
                        and(
                            eq(events.eventCategory, category.id),
                            gte(events.createdAt, firstDayOfMonth)
                        )
                    );

                // Fetch events for the category
                const categoryEvents = await db
                    .select({
                        fields: events.fields,
                        createdAt: events.createdAt,
                    })
                    .from(events)
                    .where(
                        and(
                            eq(events.eventCategory, category.id),
                            gte(events.createdAt, firstDayOfMonth)
                        )
                    );

                // Calculate uniqueFieldCount and lastPing
                const uniqueFieldNames = new Set<string>();
                let lastPing: Date | null = null;

                categoryEvents.forEach((event) => {
                    Object.keys(event.fields as object).forEach((fieldName) => {
                        uniqueFieldNames.add(fieldName);
                    });
                    if (!lastPing || event.createdAt > lastPing) {
                        lastPing = event.createdAt;
                    }
                });

                return {
                    id: category.id,
                    name: category.name,
                    emoji: category.emoji,
                    color: category.color,
                    updatedAt: category.updatedAt,
                    createdAt: category.createdAt,
                    uniqueFieldCount: uniqueFieldNames.size,
                    eventsCount: eventsCount[0]?.count || 0,
                    lastPing,
                };
            })
        );

        return c.superjson({ categories: categoriesWithCounts });
    }),
});