import { Suspense } from 'react';
import OAuthRedirectContent from './oauth-redirect-content';

export const dynamic = 'force-dynamic';

export default function OAuthRedirectPage() {
    return (
        <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center"><p className="text-xl font-semibold">Signing you in…</p></div>}>
            <OAuthRedirectContent />
        </Suspense>
    );
}
