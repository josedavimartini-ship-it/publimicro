"use client";

import { FloatingWhatsApp, WhatsAppLockedMessage } from "@publimicro/ui";
import { useAuth } from "./AuthProvider";
import { usePathname } from 'next/navigation';

/**
 * Wrapper for FloatingWhatsApp that checks user verification and subscription status.
 * - Shows WhatsApp button only on announcement/profile related routes
 * - Requires the user to be logged in and either verified or have an active subscription
 * - Shows a locked message if logged in but not authorized
 * - Hidden for guests
 */
export default function FloatingWhatsAppWrapper() {
  const { user, profile, loading } = useAuth();
  const pathname = usePathname();

  // Don't show anything while loading or if pathname is not available yet
  if (loading || !pathname) {
    return null;
  }

  // Only show the floating widget on specific sections (profile and announcement flows)
  const allowedPrefixes = ["/conta", "/anuncios", "/assinatura"];
  const inAllowedArea = allowedPrefixes.some((p) => pathname.startsWith(p));

  if (!inAllowedArea) {
    return null;
  }

  // If not logged in, don't show anything
  if (!user) {
    return null;
  }

  // Check if user is verified or has a subscription tier
  const isVerified = profile?.verified === true;
  const hasSubscription = Boolean(profile?.subscription_tier || profile?.subscription_active);

  // If authorized, show the WhatsApp button
  if (isVerified || hasSubscription) {
    return <FloatingWhatsApp showForAll={true} />;
  }

  // If logged in but not authorized, show the locked message
  return <WhatsAppLockedMessage />;
}
