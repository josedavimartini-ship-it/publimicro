import type { Request, Response } from 'express';
import Stripe from 'stripe';

// NOTE: Replace DB logic with your Supabase/Postgres client implementation.
// This file demonstrates safe, idempotent webhook handling patterns.

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15' });

// Example: verify webhook signature if configured
function verifyEvent(req: Request): Stripe.Event | null {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    // If no secret provided, parse body raw as JSON (use caution)
    return req.body as Stripe.Event;
  }

  const sig = req.headers['stripe-signature'] as string | undefined;
  if (!sig) throw new Error('Missing stripe-signature header');

  interface RawBodyReq { rawBody?: string }
  const rawBody = ((req as unknown) as RawBodyReq).rawBody ?? JSON.stringify(req.body);
  return stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
}

export async function handleStripeWebhook(req: Request, res: Response) {
  let event: Stripe.Event;
  try {
    event = verifyEvent(req) as Stripe.Event;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Webhook signature verification failed:', msg);
    return res.status(400).send(`Webhook Error: ${msg}`);
  }

  try {
    switch (event.type) {
      case 'customer.created': {
        const customer = event.data.object as Stripe.Customer;
        // Example: idempotent DB upsert: ensure user record exists and free_ads_remaining set
        // TODO: replace with actual DB client (Supabase or pg client)
        // await db.users.upsert({ stripe_customer_id: customer.id }, { free_ads_remaining: 2 });
        console.log('customer.created -> ensure free_ads_remaining for', customer.id);
        break;
      }

      case 'invoice.payment_succeeded':
      case 'checkout.session.completed': {
        // Handle successful payments if needed (grant benefits, mark invoices)
        const obj = event.data.object as Stripe.Invoice | Stripe.Checkout.Session;
        const getObjectId = (o: unknown): string => {
          if (!o || typeof o !== 'object') return '<unknown>';
          const maybe = o as { id?: string };
          return maybe.id ?? '<unknown>';
        };
        const id = getObjectId(obj);
        console.log(event.type, id);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        // Idempotent reconciliation pattern:
        // 1) Fetch subscription by stripe_subscription_id
        // 2) Upsert subscription row with current status
        // 3) If status becomes 'active', deactivate other active subscriptions for the same user (or enforce via DB unique partial index)

        // TODO: Replace with real DB logic. Example pseudocode:
        // await db.transaction(async (tx) => {
        //   await tx.subscriptions.upsert({ stripe_id: subscription.id, user_id: userId, status: subscription.status });
        //   if (subscription.status === 'active') {
        //     await tx.subscriptions.update({ status: 'canceled' }, { user_id: userId, stripe_id: { $ne: subscription.id }, status: 'active' });
        //   }
        // });

        console.log('subscription event for', subscription.id, 'status', subscription.status);
        break;
      }

      default:
        console.log('Unhandled event type', event.type);
    }

    res.json({ received: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Webhook handler error:', msg);
    res.status(500).send('Internal error');
  }
}

export default handleStripeWebhook;
