import { Router } from "jstack";
import { privateProcedure } from "../jstack";
import { createCheckoutSession } from "@/lib/stripe";

export const paymentRouter = new Router({
    createCheckoutSession : privateProcedure.mutation( async ({c,ctx}) => {
        const {user} = ctx;

        const session = await createCheckoutSession({userEmail : user?.email ?? "" , userId : user?.id ?? ""})


        return c.json({url : session.url})
    }),

    getUserPlan : privateProcedure.query(async ({c,ctx}) => {
        const {user} = ctx
        return c.json({plan : user?.plan})
    })
})