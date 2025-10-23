import Stripe from "stripe";

const stripeKey = process.env.STRIPE_SECRET_KEY || "";

// Use uma versão oficial e compatível com o SDK atual
export const stripe = new Stripe(stripeKey, {
  apiVersion: "2023-10-16",
});
