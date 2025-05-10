import { Router } from "jstack";
import { privateProcedure } from "../jstack";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "../db/db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export const authRouter = new Router({
    getDatabaseSyncStatus: privateProcedure.query(async ({ c  }) => {
        const auth = await currentUser()

        if(!auth){
            return c.json({isSynced : false})
        }

        const user = await db
            .select()
            .from(users)
            .where(eq(users.externalId,auth.id))
            .limit(1)

        if(user.length === 0){
            await db.insert(users).values({
                name: auth.firstName || "Unknown User",
                externalId: auth.id,
                quotaLimit: 100,
                email: auth.emailAddresses[0]?.emailAddress || "unknown@example.com", 
            })

            return c.json({isSynced : true})
        }

        return c.json({isSynced : true});
    })
})