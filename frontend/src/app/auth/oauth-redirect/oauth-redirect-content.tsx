"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const normalizeRole = (value: string | null) => (value === 'vendor' || value === 'shopkeeper' ? 'shopkeeper' : 'farmer');

export default function OAuthRedirectContent() {
    const router = useRouter();
    const params = useSearchParams();

    useEffect(() => {
        async function finish() {
            if (!params) {
                router.replace('/auth/role-select');
                return;
            }

            const token = params.get('token');
            const role = normalizeRole(params.get('role'));

            if (!token) {
                router.replace(`/auth/login?role=${role}`);
                return;
            }

            try {
                localStorage.setItem('authToken', token);

                const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
                const res = await fetch(`${apiBase}/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) {
                    localStorage.removeItem('authToken');
                    router.replace(`/auth/login?role=${role}`);
                    return;
                }

                const data = await res.json();
                if (data && data.data) {
                    const normalizedUser = { ...data.data, role: normalizeRole(data.data.role) };
                    localStorage.setItem('user', JSON.stringify(normalizedUser));
                }

                window.dispatchEvent(new Event('auth-session-changed'));
                await new Promise((resolve) => setTimeout(resolve, 50));

                router.replace(`/dashboard/${role}`);
            } catch (err) {
                console.error(err);
                router.replace(`/auth/login?role=${role}`);
            }
        }

        finish();
    }, [params, router]);

    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center">
                <p className="text-xl font-semibold">Signing you in…</p>
            </div>
        </div>
    );
}