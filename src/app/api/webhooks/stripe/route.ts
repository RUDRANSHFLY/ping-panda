import { stripe } from "@/lib/stripe";
import { db } from "@/server/db/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers"
import Stripe from "stripe";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("stripe-signature");

    const event = stripe.webhooks.constructEvent(
        body,
        signature!,
        process.env.STRIPE_WEBHOOK_SECRET ?? "",
    )


    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        const { userId } = session.metadata || { userId: null };

        if (!userId) {
            return new Response("Invalid metadeta", { status: 400 })
        }

        await db.update(users).set({plan : "pro"}).where(eq(users.id,userId))

        return new Response("OK",{status : 200})
    }
}