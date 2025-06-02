import { Router } from "jstack";
import { privateProcedure } from "../jstack";
import { db } from "../db/db";
import { eventCategories, events } from "../db/schema";
import { desc, eq, and, gte, count } from "drizzle-orm";
import { startOfDay, startOfMonth, startOfWeek } from "date-fns";
import { z } from "zod"
import { CATEGORY_NAME_VALIDATION } from "@/lib/validators/category-validator";
import { parseColor } from "@/lib/utils";
import { HTTPException } from "hono/http-exception";

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
                name: "sale",
                emoji: "💴",
                color: 0xffeb3b
            },
            {
                name: "question",
                emoji: "🤔",
                color: 0x6c5ce7
            }
        ]

        const categoriesToInsert = data.map((category) => ({
            ...category,
            userId: user?.id || "",
        }))

        const categories = await db.insert(eventCategories).values(categoriesToInsert).returning();

        return c.json({ sucess: true, count: categories.length })
    }),

    pollCategory: privateProcedure.input(z.object({
        name: CATEGORY_NAME_VALIDATION
    })).query(async ({ c, ctx, input }) => {
        const { name } = input;
        const userId = ctx.user?.id || "";
        const category = await db.select().from(eventCategories).where(
            and(
                eq(eventCategories.name, name),
                eq(eventCategories.userId, userId)
            )
        )

        if (category.length === 0) {
            throw new HTTPException(404, {
                message: `Category ${name} not found`
            })
        }

        const categoryCount = await db.select({ count: count() }).from(events).where(
            and(
                eq(events.eventCategory, category[0]?.id || ""),
                eq(events.userId, userId)
            )
        );


        const hasEvents = (categoryCount[0]?.count || 0) > 0;


        return c.json({
            hasEvents
        })
    }),

    getEventsByCategoryName: privateProcedure.input(z.object({
        name: CATEGORY_NAME_VALIDATION,
        page: z.number(),
        limit: z.number().max(50),
        timeRange: z.enum(["today", "week", "month"])
    })).query(async ({ c, input, ctx }) => {
        const { limit, name, page, timeRange } = input

        const now = new Date()
        let startDate: Date

        switch (timeRange) {
            case "today":
                startDate = startOfDay(now)
                break;
            case "week":
                startDate = startOfWeek(now, {
                    weekStartsOn: 0
                })
                break;
            case "month":
                startDate = startOfMonth(now)
                break;
            default:
                throw new Error("Invalid timeRange value");
        }

        if (!startDate) {
            throw new Error("startDate is undefined");
        }

        const eventIdArr = await db.select({ id: eventCategories.id }).from(eventCategories).where(eq(eventCategories.name, name)).limit(1);


        const universalStartDate = new Date(startDate.toUTCString())

        const [eventsList, countResult, distinctFields] = await Promise.all([
            db.select().from(events).where(
                and(eq(events.eventCategory, eventIdArr[0]?.id || ""),
                    eq(events.userId, ctx.user?.id ?? ""),
                    gte(events.createdAt, universalStartDate)
                )
            ).orderBy(events.createdAt)
                .offset((page - 1) * limit)
                .limit(limit),
            db.select({ count: count() })
                .from(events)
                .where(
                    and(
                        eq(events.eventCategory, eventIdArr[0]?.id || ""),
                        eq(events.userId, ctx.user?.id ?? ""),
                        gte(events.createdAt, universalStartDate)
                    )
                ),

            db.select({ fields: events.fields }).from(events).where(
                and(eq(events.eventCategory, eventIdArr[0]?.id || ""),
                    eq(events.userId, ctx.user?.id ?? ""),
                    gte(events.createdAt, universalStartDate)
                )
            ).then((eventsList) => {
                const fieldNames = new Set<string>();
                if (eventsList) {
                    eventsList.forEach((event) => {
                        Object.keys(event.fields as object).forEach((fieldName) => {
                            fieldNames.add(fieldName)
                        })
                    })
                }

                return fieldNames.size
            })
        ])





        return c.superjson({
            events: eventsList,
            eventsCount: countResult[0]?.count,
            uniqueFields: distinctFields
        });
    })



});