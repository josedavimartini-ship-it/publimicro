"use client";

import dynamic from 'next/dynamic';
import type { ComponentProps } from 'react';

// Dynamically load the client-only MapKmlViewer and disable SSR entirely
const MapKmlViewer = dynamic(() => import('./MapKmlViewer'), { ssr: false });

export default function MapKmlViewerClient(props: ComponentProps<typeof MapKmlViewer>) {
  return <MapKmlViewer {...props} />;
}
