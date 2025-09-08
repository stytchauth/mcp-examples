'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { IdentityProvider as BaseIdentityProvider, useStytch, useStytchUser } from '@stytch/nextjs';

/**
 * A higher-order component that enforces a login requirement for the wrapped component.
 * If the user is not logged in, the user is redirected to the login page and the
 * current URL is stored in localStorage to enable return after authentication.
 */
export const withLoginRequired = (Component: React.FC) => {
  const WrappedComponent = () => {
    const router = useRouter();
    const { user, fromCache, isInitialized } = useStytchUser();

    useEffect(() => {
      if (!isInitialized) return;
      if (!user && !fromCache) {
        localStorage.setItem('returnTo', window.location.href);
        router.push('/');
      }
    }, [user, fromCache, isInitialized, router]);

    if (!user) {
      return null;
    }
    return <Component />;
  };

  WrappedComponent.displayName = `withLoginRequired(${Component.displayName || Component.name || 'Component'})`;
  return WrappedComponent;
};

export const IdentityProvider = withLoginRequired(BaseIdentityProvider);

/**
 * The Authentication callback page implementation. Handles completing the login flow after OAuth
 */
export const Authenticate = () => {
  const client = useStytch();
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (!token) return;

    client.oauth.authenticate(token, { session_duration_minutes: 60 }).then(() => {
      const returnTo = localStorage.getItem('returnTo');
      if (returnTo) {
        router.push(returnTo);
      } else {
        router.push('/account');
      }
    });
  }, [client, router]);

  return <>Loading...</>;
};

export const Logout = () => {
  const stytch = useStytch();
  const { user } = useStytchUser();

  if (!user) return null;

  return (
    <button type="submit" className="primary" onClick={() => stytch.session.revoke()}>
      {' '}
      Log Out{' '}
    </button>
  );
};
