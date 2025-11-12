/* Allow custom Stripe API version literal values used by this project.
   The official @stripe/stripe-js types use a narrow union for apiVersion
   which may not include vendor-specific release labels (e.g. '2024-11-20.acacia').
   This declaration widens the ApiVersion type to string for our build so we
   can pin a runtime apiVersion without unsafe `as any` casts.
*/

import 'stripe';

declare module 'stripe' {
  // Augment the existing Stripe namespace to widen ApiVersion
  namespace Stripe {
    export type ApiVersion = string;
  }
}

export {};
