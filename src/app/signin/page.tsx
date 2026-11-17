import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AuthFrame } from '@/components/auth/AuthFrame';
import { ToAccount } from '@/components/auth/ToAccount';

export const metadata: Metadata = { title: 'Sign In', robots: { index: false, follow: true }, alternates: { canonical: '/signin' } };

export default function SignIn() {
  return (
    <AuthFrame title="Sign in">
      <Suspense><ToAccount where="signin" /></Suspense>
    </AuthFrame>
  );
}
