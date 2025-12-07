"use client";

/**
 * FavoritesButton - Now uses the new EmuCurtiButton internally
 * This wrapper maintains backward compatibility with existing imports
 */

import EmuCurtiButton from './EmuCurtiButton';

interface FavoritesButtonProps {
  propertyId: string;
  userId?: string | null;
  size?: 'sm' | 'md' | 'lg';
}

export default function FavoritesButton({ propertyId, userId, size = 'md' }: FavoritesButtonProps) {
  return (
    <EmuCurtiButton
      itemId={propertyId}
      itemType="property"
      userId={userId}
      size={size}
      showLabel={false}
    />
  );
}


















