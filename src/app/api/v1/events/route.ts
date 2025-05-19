import { FREE_QUOTA, PRO_QUOTA } from "@/confg";
import { DiscordClient } from "@/lib/discord-client";
import { CATEGORY_NAME_VALIDATION } from "@/lib/validators/category-validator";
import { db } from "@/server/db/db";
import { quotas, users } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const REQUEST_VALIDATOR = z.object({
    caregory: CATEGORY_NAME_VALIDATION,
    fields: z.record(z.string().or(z.number()).or(z.boolean()).optional()),
    description: z.string().optional(),
}).strict()

export const POST = async (req: NextRequest) => {
    const authHeader = req.headers.get("Authorization")


    if (!authHeader) {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        )
    }


    if(!authHeader.startsWith("Bearer ")){
        return NextResponse.json(
            {message : "Invalid auth header format. 'Bearer [API_KEY]'"},
            {status : 401}
        )
    }


    const apiKey = authHeader.split(" ")[1]


    if(!apiKey || apiKey.trim() === ""){
        return NextResponse.json(
            {message : "Invalid API key"},
            {status : 401}
        )
    }


    const user = await db
                .select()
                .from(users)
                .where(eq(users.apiKey,apiKey))
                .limit(1);

    if(user.length === 0){
         return NextResponse.json(
            {message : "Invalid API key"},
            {status : 401}
        )
    }

    if(!user[0]?.discordId){
        return NextResponse.json(
            {message : "Please enter your discord ID in your account settings."},
            {status : 403}
        )
    }


    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1 ;
    const currentYear = currentDate.getFullYear();


    const quota = await db.select().from(quotas).where(
        and(
            eq(quotas.userId,user[0].id),
            eq(quotas.month,currentMonth),
            eq(quotas.year,currentYear)
        )
    ).limit(1);

    const quotaLimit = user[0].plan === "free" 
    ? FREE_QUOTA.maxEventsPerMonths 
    : PRO_QUOTA.maxEventsPerMonths

    if(quota.length > 0 && (quota[0]?.count || 0) >= quotaLimit){
        return NextResponse.json(
            {message : "Monthly quota reached. Please upgrade your plan for more events"},
            {status : 429}
        )
    }

    const discordBotToken = process.env.DISCORD_BOT_TOKEN!;
    const discord = new DiscordClient(discordBotToken)
 }  
