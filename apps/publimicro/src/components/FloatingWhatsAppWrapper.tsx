"use client";

import { FloatingWhatsApp, WhatsAppLockedMessage } from "@publimicro/ui";
import { useAuth } from "./AuthProvider";

/**
 * Wrapper for FloatingWhatsApp that checks user verification status.
 * - Shows WhatsApp button only to verified/approved users
 * - Shows a "Complete your profile" message to non-verified users
 * - Hides completely for guests (not logged in)
 */
export default function FloatingWhatsAppWrapper() {
  const { user, profile, loading } = useAuth();

  // Don't show anything while loading
  if (loading) {
    return null;
  }

  // If not logged in, don't show anything
  if (!user) {
    return null;
  }

  // Check if user is verified
  const isVerified = profile?.verified === true;

  // If verified, show the WhatsApp button
  if (isVerified) {
    return <FloatingWhatsApp showForAll={true} />;
  }

  // If logged in but not verified, show the locked message
  return <WhatsAppLockedMessage />;
}
