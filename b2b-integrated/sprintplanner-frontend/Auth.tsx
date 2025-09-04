import React from 'react';
import {B2BIdentityProvider, StytchB2B, useStytchB2BClient, useStytchMember, useStytchMemberSession} from "@stytch/react/b2b";
import {useEffect, useMemo} from "react";
import { AuthFlowType, StytchEventType } from '@stytch/vanilla-js/dist/b2b';

/**
 * A higher-order component that enforces a login requirement for the wrapped component.
 * If the user is not logged in, the user is redirected to the login page and the
 * current URL is stored in localStorage to enable return after authentication.
 */
export const withLoginRequired = (Component: React.FC) => () => {
    const {session, isInitialized} = useStytchMemberSession();

    useEffect(() => {
        if (!isInitialized) return;
        if (!session) {
            localStorage.setItem('returnTo', window.location.href);
            window.location.href = '/login';
        }
    }, [session, isInitialized])

    if (!isInitialized) return null;
    if (!session) return null;
    return <Component/>
}

/**
 * The other half of the withLoginRequired flow
 * Redirects the user to a specified URL stored in local storage or a default location.
 * Behavior:
 * - Checks for a `returnTo` entry in local storage to determine the redirection target.
 * - If `returnTo` exists, clears its value from local storage and navigates to the specified URL.
 * - If `returnTo` does not exist, redirects the user to the default '/todoapp' location.
 */
const onLoginComplete = () => {
    const returnTo = localStorage.getItem('returnTo')
    if (returnTo) {
        localStorage.setItem('returnTo', '');
        window.location.href = returnTo;
    } else {
        window.location.href = '/tickets';
    }
}

/**
 * The Login page implementation for B2B. Redirects to the SSO/Discovery authorize route.
 */
export function Login() {
    const config = useMemo(() => ({
        authFlowType: "Discovery",
        products: ["emailMagicLinks", "passwords"],
        emailMagicLinksOptions: {
            discoveryRedirectURL: window.location.origin + '/authenticate',
        },
        ssoOptions: {
            discoveryRedirectURL: window.location.origin + '/authenticate',
        },
        sessionOptions: {
            sessionDurationMinutes: 60,
        },
    }), [])

    return (
        <StytchB2B
            config={config}
            callbacks={{
                onEvent: (evt) => console.log('StytchB2B onEvent', evt),
                onError: (err) => console.error('StytchB2B onError', err),
            }}
        />
    )
}

/**
 * The OAuth Authorization page implementation. Wraps the Stytch IdentityProvider UI component.
 * View all configuration options at https://stytch.com/docs/sdks/idp-ui-configuration
 */
export const Authorize = withLoginRequired(function () {
    return (
        <B2BIdentityProvider
            callbacks={{
                onEvent: (evt) => console.log('B2BIdentityProvider onEvent', evt),
                onError: (err) => console.error('B2BIdentityProvider onError', err),
            }}
        />
    )
})

/**
 * The Authentication callback page implementation. Handles completing the login flow after OAuth
 */
export function Authenticate() {
    const client = useStytchB2BClient();

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash);

        const getParam = (name: string) => searchParams.get(name) || hashParams.get(name);

        const tokenType = getParam('stytch_token_type');
        const discoveryToken = getParam('discovery_oauth_token');
        const oauthTokenParam = getParam('oauth_token');
        const genericToken = getParam('token');
        
        if (discoveryToken || tokenType === 'discovery') {
            const token = discoveryToken || genericToken;
            if (token) {
                client.magicLinks.discovery.authenticate({ discovery_magic_links_token: token })
                    .then(() => {
                        // Intermediate session is set; redirect to discovery page to pick org
                        window.location.href = '/discovery';
                    })
                    .catch((err) => console.error('discovery.authenticate failed', err))
            }
            return;
        }

        const oauthToken = oauthTokenParam || genericToken;
        if (oauthToken) {
            client.oauth.authenticate({ oauth_token: oauthToken, session_duration_minutes: 60 })
                .then(onLoginComplete)
                .catch((err) => console.error('oauth.authenticate failed', err))
            return;
        }
        console.warn('No token found in authenticate URL');
    }, [client]);

    return (
        <div>
            <div>Loading authentication…</div>
            <pre style={{whiteSpace: 'pre-wrap'}}>
{`URL: ${typeof window !== 'undefined' ? window.location.href : ''}
search: ${typeof window !== 'undefined' ? window.location.search : ''}
hash: ${typeof window !== 'undefined' ? window.location.hash : ''}`}
            </pre>
        </div>
    )
}

/**
 * The Discovery page implementation for B2B. Shows organization picker after EML authentication.
 */
export function Discovery() {
    const config = useMemo(() => ({
        authFlowType: AuthFlowType.Discovery,
        products: ["emailMagicLinks", "passwords"],
        emailMagicLinksOptions: {
            loginRedirectURL: window.location.origin + '/authenticate',
            signupRedirectURL: window.location.origin + '/authenticate',
        },
        ssoOptions: {
            loginRedirectURL: window.location.origin + '/authenticate',
            signupRedirectURL: window.location.origin + '/authenticate',
        },
        sessionOptions: {
            sessionDurationMinutes: 60,
        },
    }), [])

    return (
        <div>
            <div>Discovery Page - Select or Create Organization</div>
            <StytchB2B
                config={config}
                callbacks={{
                    onEvent: (evt) => {
                        console.log('Discovery StytchB2B onEvent', evt);
                        // Handle completion events - check for member session creation
                        if (evt.type === StytchEventType.B2BMagicLinkAuthenticate || 
                            evt.type === StytchEventType.B2BOAuthAuthenticate ||
                            evt.type === StytchEventType.B2BDiscoveryIntermediateSessionExchange ||
                            evt.type === StytchEventType.AuthenticateFlowComplete
                        ) {
                            // Member session created, redirect to app
                            window.location.href = '/tickets';
                        }
                    },
                    onError: (err) => console.error('Discovery StytchB2B onError', err),
                }}
            />
        </div>
    )
}

export const Logout = function () {
    const stytch = useStytchB2BClient()
    const {member} = useStytchMember()

    if(!member) return null;

    return (
        <button className="primary" onClick={() => stytch.session.revoke()}> Log Out </button>
    )
}