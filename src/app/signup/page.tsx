import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AuthFrame } from '@/components/auth/AuthFrame';
import { ToAccount } from '@/components/auth/ToAccount';

export const metadata: Metadata = { title: 'Sign Up', robots: { index: false, follow: true }, alternates: { canonical: '/signup' } };

export default function SignUp() {
  return (
    <AuthFrame title="Sign up">
      <Suspense><ToAccount where="create" /></Suspense>
    </AuthFrame>
  );
}
