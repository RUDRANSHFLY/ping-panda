import { Router } from "jstack";
import { privateProcedure } from "../jstack";
import { db } from "../db/db";
import { eventCategories, events } from "../db/schema";
import { desc, eq, and, gte, count } from "drizzle-orm";
import { startOfMonth } from "date-fns";
import { z } from "zod"
import { CATEGORY_NAME_VALIDATION } from "@/lib/validators/category-validator";
import { parseColor } from "@/lib/utils";

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

    deleteCategory: privateProcedure.input(z.object({
        name: z.string()
    })).mutation(async ({ c, input, ctx }) => {
        const { name } = input;

        await db.delete(eventCategories).where(
            and(
                eq(eventCategories.name, name),
                eq(eventCategories.userId, ctx.user?.id ?? "")
            )
        );

        return c.json({ success: true })
    }),

    createCategory: privateProcedure.input(z.object({
        name: CATEGORY_NAME_VALIDATION,
        color: z
            .string()
            .min(1, {
                message: "Color is required.",
            })
            .regex(/#[0-9A-F]{6}$/, {
                message: "Invalid color format.",
            }),
        emoji: z
            .string()
            .emoji({
                message: "Invalid emoji.",
            })
            .optional(),
    })).mutation(async ({ c, ctx, input }) => {
        const { user } = ctx;
        const { color, name, emoji } = input;

        /* eslint-disable @typescript-eslint/no-unused-vars */
        const eventCategory = await db
            .insert(eventCategories)
            .values({
                name: name.toLowerCase(),
                color: parseColor(color),
                emoji: emoji ?? "",
                userId: user?.id || "default-user-id",
            })



        return c.json({ sucess: true })

    }),


    insertQuickStartCategories: privateProcedure.mutation(async ({ c, ctx }) => {
        const { user } = ctx;
        const data = [
            {
                name: "bug",
                emoji: "🪲",
                color: 0xff6b6b
            },
            {
                name: "Sale",
                emoji: "💴",
                color: 0xffeb3b
            },
            {
                name: "Question",
                emoji: "🤔",
                color: 0x6c5ce7
            }
        ]

        const categoriesToInsert = data.map((category) => ({
            ...category,
            userId: user?.id || "",
        }))

        const categories = await db.insert(eventCategories).values(categoriesToInsert).returning();

        return c.json({sucess : true , count : categories.length})
    })

});