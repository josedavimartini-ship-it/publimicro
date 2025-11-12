# @publimicro/stripe

Small internal workspace package that centralizes Stripe apiVersion and runtime factory for PubliMicro.

Usage (TypeScript)

```ts
import { apiVersion, createStripe } from '@publimicro/stripe';

console.log('Using Stripe API version:', apiVersion);
const stripe = createStripe(process.env.STRIPE_SECRET_KEY!);
// use stripe.*
```

Usage (Node script)

```js
const { createStripe, apiVersion } = require('@publimicro/stripe');
console.log('Using Stripe API version:', apiVersion);
const stripe = createStripe(process.env.STRIPE_SECRET_KEY);
// use stripe.*
```

CI / smoke test

- Add the following secrets to your GitHub repository settings:
  - `STRIPE_TEST_KEY` — a Stripe test secret key (starts with `sk_test_...`).
  - `SMOKE_STRIPE_PRICE_ID` — a non-destructive price id to retrieve during CI (e.g. one of the test price IDs created for your account).

A GitHub Actions workflow (`.github/workflows/ci.yml`) is provided to run type-check, build the package, and run a smoke test using those secrets.

Notes

- The package compiles to CommonJS in `dist/` and exposes types in `dist/index.d.ts`.
- To update the pinned API version, edit `packages/stripe/stripe-config.json` and commit.
