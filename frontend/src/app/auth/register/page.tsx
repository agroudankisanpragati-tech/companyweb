import { Suspense } from 'react';
import RegisterContent from './register-content';

export const dynamic = 'force-dynamic';

export default function RegisterPage() {
    return (
        <Suspense>
            <RegisterContent />
        </Suspense>
    );
}
