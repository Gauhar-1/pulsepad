'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '@/context/auth-context';
import { Toaster } from '@/components/ui/toaster';

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '';

if (!googleClientId) {
  console.warn('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set. Google login will not work.');
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        {children}
        <Toaster />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

