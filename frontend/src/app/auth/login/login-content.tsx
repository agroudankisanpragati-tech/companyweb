'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth, type UserRole } from '@/context/AuthContext';

const roleTheme: Record<UserRole, { accent: string; panel: string; label: string; soft: string }> = {
    farmer: {
        accent: 'from-green-600 to-emerald-700',
        panel: 'border-green-300/30',
        label: 'Farmer Login',
        soft: 'text-green-200',
    },
    shopkeeper: {
        accent: 'from-blue-600 to-cyan-700',
        panel: 'border-blue-300/30',
        label: 'Shopkeeper Login',
        soft: 'text-blue-200',
    },
};

export default function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const roleParam: UserRole = searchParams?.get('role') === 'shopkeeper' ? 'shopkeeper' : 'farmer';

    const { login, isLoading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const theme = roleTheme[roleParam];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!email.trim() || !password.trim()) {
                throw new Error('Please enter your email and password');
            }

            const user = await login(email, password, roleParam);
            router.push(`/dashboard/${user.role}`);
        } catch (err: any) {
            const message = err?.message || 'Login failed. Please try again.';
            setError(message === 'Invalid credentials' ? 'Account not found or wrong password. Please register first.' : message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="h-[100dvh] overflow-hidden bg-[url('/background%20img.jpg')] bg-cover bg-center bg-no-repeat flex items-center justify-center">
            {/* Semi-transparent overlay */}
            <div className="fixed inset-0 z-0 bg-black/40" />
            <div className="w-full max-w-md px-4 relative z-10">
                {/* Card */}
                <div className={`relative overflow-hidden rounded-2xl border ${theme.panel} shadow-2xl max-h-[92dvh]`}>
                    <div className="absolute inset-0 bg-[url('/background%20img.jpg')] bg-cover bg-center" />
                    <div className="absolute inset-0 bg-black/45" />

                    <div className="relative z-10 p-5 md:p-6 backdrop-blur-md">
                        {/* Header */}
                        <div className="mb-4">
                            <div className="flex items-center gap-3 mb-3 rounded-xl border border-white/20 bg-white/10 px-3 py-2">
                                <div className="h-11 w-11 rounded-lg overflow-hidden ring-2 ring-white/40">
                                    <Image src="/logo.png" alt="Kisan Unnati" width={44} height={44} className="h-full w-full object-cover" />
                                </div>
                                <div>
                                    <p className="text-[11px] tracking-[0.2em] uppercase text-green-200">Kisan Unnati</p>
                                    <p className="text-white font-semibold leading-tight">{theme.label}</p>
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-500/20 border border-red-300/40 rounded-lg">
                                <p className="text-red-100 text-sm md:text-base">{error}</p>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-3.5 md:space-y-4">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold mb-1.5 text-white/90">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setError('');
                                    }}
                                    placeholder="your.email@example.com"
                                    className="w-full px-4 py-2 border border-white/30 rounded-lg bg-white/15 text-white placeholder:text-white/60 focus:ring-2 focus:ring-green-400 focus:border-transparent text-sm md:text-base h-10"
                                    required
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="text-sm font-semibold text-white/90 mb-1.5 block">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setError('');
                                        }}
                                        placeholder="Enter your password"
                                        className="w-full px-4 py-2 border border-white/30 rounded-lg bg-white/15 text-white placeholder:text-white/60 focus:ring-2 focus:ring-green-400 focus:border-transparent text-sm md:text-base h-10 pr-10"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                                    >
                                        {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading || isLoading}
                                className={`w-full py-2.5 px-4 bg-gradient-to-r ${theme.accent} text-white font-semibold rounded-lg hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 text-sm md:text-base min-h-10`}
                            >
                                {loading || isLoading ? 'Signing in...' : 'Sign In'}
                            </button>

                            {/* Google Sign-in */}
                            <a
                                href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/google?role=${roleParam}`}
                                className="w-full mt-2 inline-flex items-center justify-center gap-2 py-2.5 px-4 border border-white/30 rounded-lg bg-white/10 text-white hover:bg-white/15 transition text-sm md:text-base"
                            >
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21.35 11.1h-9.18v2.92h5.26c-.23 1.55-1.55 4.56-5.26 4.56-3.16 0-5.73-2.61-5.73-5.83s2.57-5.83 5.73-5.83c1.8 0 3 .77 3.69 1.43l2.52-2.42C16.8 3.24 14.58 2.2 11.7 2.2 6.91 2.2 3 6.12 3 10.9s3.91 8.7 8.7 8.7c5.02 0 8.36-3.52 8.66-8.5.01-.26.01-.5.0-.0z" fill="currentColor" />
                                </svg>
                                Continue with Google
                            </a>

                            {/* Divider */}
                            <div className="relative my-3">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-transparent text-white/80">Don't have an account?</span>
                                </div>
                            </div>

                            {/* Sign Up Link */}
                            <Link
                                href={`/auth/register?role=${roleParam}`}
                                className={`block w-full py-2.5 px-4 border-2 ${roleParam === 'shopkeeper' ? 'border-blue-300 text-blue-100' : 'border-green-300 text-green-100'} font-semibold rounded-lg text-center hover:bg-white/10 transition-all text-sm md:text-base min-h-10 flex items-center justify-center`}
                            >
                                Create New Account
                            </Link>

                            <p className="text-center text-xs md:text-sm text-white/80">
                                <Link href="/auth/role-select" className="text-green-200 font-semibold hover:text-green-100">
                                    Change role
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>

            </div>
        </main>
    );
}
