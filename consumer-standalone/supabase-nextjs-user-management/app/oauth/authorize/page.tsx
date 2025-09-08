'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IdentityProvider } from '@stytch/nextjs';
import { createStytchUIClient } from '@stytch/nextjs/dist/index.ui';
import StytchProvider from '@/components/StytchProvider';
import { createClient } from '@/utils/supabase/client';

const stytch = createStytchUIClient(process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN!);

export default function AuthenticatePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      // Only create Supabase client in the browser
      if (typeof window === 'undefined') return;

      const supabase = createClient();
      const res = await supabase.auth.getSession();
      const token = res.data.session?.access_token;

      if (!token) {
        const returnTo = window.location.href;
        router.replace(`/?returnTo=${encodeURIComponent(returnTo)}`);
        return;
      }

      // if we've already attested this supabase session with stytch,
      // we must skip this step
      const hasStytchSession = stytch.session.getInfo().session;
      if (!hasStytchSession && token) {
        await stytch.session.attest({
          profile_id: process.env.NEXT_PUBLIC_STYTCH_TOKEN_PROFILE!,
          token,
          session_duration_minutes: 60,
        });
      }

      setIsAuthenticated(true);
    };

    checkAuthentication();
  }, [router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <StytchProvider>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1 className="header">Stytch OAuth Authorization</h1>
            <IdentityProvider />
          </div>
        </div>
      </div>
    </StytchProvider>
  );
}
