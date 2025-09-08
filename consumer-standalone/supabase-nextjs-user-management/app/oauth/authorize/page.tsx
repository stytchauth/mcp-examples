'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createStytchUIClient } from '@stytch/nextjs/dist/index.ui';
import StytchProvider from '@/components/StytchProvider';
import { createClient } from '@/utils/supabase/client';

const IdentityProvider = dynamic(
  () =>
    import('@/components/Auth').then((mod) => ({
      default: mod.IdentityProvider,
    })),
  {
    ssr: false,
    loading: () => <div>Loading...</div>,
  },
);

const stytch = createStytchUIClient(process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN!);

export default function AuthenticatePage() {
  const supabase = createClient();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuthentication = async () => {
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
        stytch.session.attest({
          profile_id: process.env.NEXT_PUBLIC_STYTCH_TOKEN_PROFILE!,
          token,
          session_duration_minutes: 60,
        });
      }

      setIsAuthenticated(true);
    };

    checkAuthentication();
  }, [supabase, router]);

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
