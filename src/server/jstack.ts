import { jstack } from "jstack"
import { drizzle } from "drizzle-orm/postgres-js"
import { env } from "hono/adapter"
import { db } from "./db/db"
import { users } from "./db/schema"
import { eq } from "drizzle-orm"
import { currentUser } from "@clerk/nextjs/server"
import { HTTPException } from "hono/http-exception"

interface Env {
  Bindings: { DATABASE_URL: string }
}

export const j = jstack.init<Env>()

/**
 * Type-safely injects database into all procedures
 * @see https://jstack.app/docs/backend/middleware
 * 
 * For deployment to Cloudflare Workers
 * @see https://developers.cloudflare.com/workers/tutorials/postgres/
 */
const databaseMiddleware = j.middleware(async ({ c, next }) => {
  const { DATABASE_URL } = env(c)

  const db = drizzle(DATABASE_URL)

  return await next({ db })
})

const authMiddleware = j.middleware(async ({c,next}) => {

  const authHeader = c.req.header("Authorization")

  if(authHeader){
    const apiKey = authHeader.split(" ")[1]

    const user = await db
          .select()
          .from(users)
          .where(eq(users.apiKey,apiKey ?? ""))
          .limit(1)
  
    if(user.length > 0){
      return next({user: user[0]})
    }
          
  }

  const auth = await currentUser()

  if(!auth){
    throw new HTTPException(401, {"message" : "Unauthorized"})
  }


  const user = await db
              .select()
              .from(users)
              .where(eq(users.externalId,auth.id))
              .limit(1)

  if(user.length === 0){
    throw new HTTPException(401, {"message" : "Unauthorized"})
  }

  return next({user : user[0]})
})

/**
 * Public (unauthenticated) procedures
 *
 * This is the base piece you use to build new queries and mutations on your API.
 */
export const publicProcedure = j.procedure.use(databaseMiddleware)
export const privateProcedure = publicProcedure.use(authMiddleware)