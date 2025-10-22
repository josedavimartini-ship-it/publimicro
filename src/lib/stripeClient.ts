import Stripe from "stripe";

const stripeKey = process.env.STRIPE_SECRET_KEY || "";

export const stripe = new Stripe(stripeKey, {
  apiVersion: "2024-09-30", // ✅ última versão estável em 2025
});
