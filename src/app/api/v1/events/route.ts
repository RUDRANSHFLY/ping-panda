import { FREE_QUOTA, PRO_QUOTA } from "@/confg";
import { DiscordClient } from "@/lib/discord-client";
import { CATEGORY_NAME_VALIDATION } from "@/lib/validators/category-validator";
import { db } from "@/server/db/db";
import { eventCategories, events, quotas, users } from "@/server/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const REQUEST_VALIDATOR = z.object({
    category: CATEGORY_NAME_VALIDATION,
    fields: z.record(z.string().or(z.number()).or(z.boolean()).optional()),
    description: z.string().optional(),
}).strict()

export const POST = async (req: NextRequest):Promise<NextResponse<{ message: string; }> | null> => {


    try {

        const authHeader = req.headers.get("Authorization")


        if (!authHeader) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            )
        }


        if (!authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { message: "Invalid auth header format. 'Bearer [API_KEY]'" },
                { status: 401 }
            )
        }


        const apiKey = authHeader.split(" ")[1]


        if (!apiKey || apiKey.trim() === "") {
            return NextResponse.json(
                { message: "Invalid API key" },
                { status: 401 }
            )
        }


        const user = await db
            .select()
            .from(users)
            .where(eq(users.apiKey, apiKey))
            .limit(1);

        if (user.length === 0) {
            return NextResponse.json(
                { message: "Invalid API key" },
                { status: 401 }
            )
        }

        if (!user[0]?.discordId) {
            return NextResponse.json(
                { message: "Please enter your discord ID in your account settings." },
                { status: 403 }
            )
        }


        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();


        const quota = await db.select().from(quotas).where(
            and(
                eq(quotas.userId, user[0].id),
                eq(quotas.month, currentMonth),
                eq(quotas.year, currentYear)
            )
        ).limit(1);

        const quotaLimit = user[0].plan === "free"
            ? FREE_QUOTA.maxEventsPerMonths
            : PRO_QUOTA.maxEventsPerMonths

        if (quota.length > 0 && (quota[0]?.count || 0) >= quotaLimit) {
            return NextResponse.json(
                { message: "Monthly quota reached. Please upgrade your plan for more events" },
                { status: 429 }
            )
        }

        const discordBotToken = process.env.DISCORD_BOT_TOKEN!;

        const discord = new DiscordClient(discordBotToken)

        const dmChannel = await discord.createDM(user[0]?.discordId)

        await discord.sendEmbed(dmChannel.id, {
            title: "Hello World"
        })

        let requestData: unknown;

        try {
            requestData = await req.json();
        } catch (error) {
            return NextResponse.json({
                message: "Invalid JSON request body"
            }, { status: 400 })
        }

        const validationResult = REQUEST_VALIDATOR.parse(requestData)

        const category = await db
            .select()
            .from(eventCategories)
            .where(
                and(
                    eq(eventCategories.userId, user[0]?.id),
                    eq(eventCategories.name, validationResult?.category)
                )
            )
            .limit(1)

        if (category.length === 0 || category[0] === undefined) {
            return NextResponse.json({
                message: `You don't have a category named ${validationResult.category}`
            }, {
                status: 404,
            })
        }


        const eventData = {
            title: `${category[0]?.emoji || "🛎️"} ${category[0]?.name?.charAt(0)?.toUpperCase() + category[0]?.name?.slice(1)}`,
            description: validationResult.description || `A new ${category[0].name} event has occurred!`,
            color: category[0]?.color,
            timestamp: new Date().toISOString(),
            fields: Object.entries(validationResult.fields || {}).map(([key, value]) => {
                return {
                    name: key,
                    value: String(value),
                    inline: true,
                }
            })

        }


        const event = await db.insert(events).values({
            name: category[0]?.name || "Default",
            eventCategory: category[0]?.id || "Default",
            formattedMessage: `${eventData.title}\n\n${eventData.description}`,
            userId: user[0]?.id,
            fields: validationResult.fields || {},
        }).returning();

        if (event.length === 0 || event[0] === undefined) {
            return null;
        }

        try {
            await discord.sendEmbed(dmChannel.id, eventData);

            await db.update(events).set({
                deliveryStatus: "delivered",
            }).where(
                eq(events.id, event[0]?.id)
            )

            await db.insert(quotas).values({
                userId: user[0]?.id || "",
                month: currentMonth,
                year: currentYear,
                count: 1,
                updatedAt: new Date(),
            }).onConflictDoUpdate({
                target: [quotas.userId, quotas.month, quotas.year],
                set: {
                    count: sql`${quotas.count} + 1`,
                    updatedAt: new Date(),
                }
            })
        } catch (error) {
            await db.update(events).set({
                deliveryStatus: "failed",
            }).where(
                eq(events.id, event[0]?.id)
            );

            console.log(error);

            return NextResponse.json({
                message: "Error processing the event. Please try again later.",
                eventId: event[0]?.id,
            }, {
                status: 500,

            })


        }


        return NextResponse.json({
            message: "Event processed successfully",
            eventId: event[0]?.id,
        })


    } catch (error) {
        console.log(error)
        if(error instanceof z.ZodError){
            return NextResponse.json({
                message : error.message,
            }, {
                status : 422
            })
        }

        return NextResponse.json({
            message : "Internal server error"
        }, {
            status : 500
        })
    }
}  
