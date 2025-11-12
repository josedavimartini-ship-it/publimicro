"use client";
import React from 'react';
import { I18nProvider } from '@/lib/i18n';
import { AuthProvider } from '@/components/AuthProvider';
import { ToastProvider } from '@/components/ToastNotification';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <AuthProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </AuthProvider>
    </I18nProvider>
  );
}
