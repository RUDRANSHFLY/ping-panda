import Stripe from "stripe"


const SECRET_KEY = process.env.STRIPE_SECRET_KEY! ?? "";

export const stripe = new Stripe(SECRET_KEY,{
    apiVersion : "2025-05-28.basil",
    typescript : true,
})


interface CreateCheckoutSessionParams{
    userEmail : string,
    userId : string,
}

export const createCheckoutSession = async ({userEmail,userId} : CreateCheckoutSessionParams) => {
    const session = await stripe.checkout.sessions.create({
        line_items : [{
            price : "price_1RfvpOP19oZ2ROkZV9rUhkqI",
            quantity : 1,   
        }],
        mode : "payment",
        success_url  : `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
        cancel_url : `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
        customer_email : userEmail,
        metadata : {
            userId,
        }
    });

    return session;
}