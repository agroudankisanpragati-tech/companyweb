'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth, type UserRole } from '@/context/AuthContext';

export default function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const roleParam = ((searchParams?.get('role') as UserRole) || 'farmer');

    const { login, isLoading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const roleInfo = {
        farmer: 'Farmer Login',
        shopkeeper: 'Shopkeeper Login',
        agribusiness: 'Agribusiness Company Login',
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!email.trim() || !password.trim()) {
                throw new Error('Please enter your email and password');
            }

            await login(email, password);
            router.push(`/dashboard/${roleParam}`);
        } catch (err: any) {
            setError(err.message || 'Login failed. Please try again.');
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
                <div className="relative overflow-hidden rounded-2xl border border-white/30 shadow-2xl max-h-[92dvh]">
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
                                    <p className="text-white font-semibold leading-tight">{roleInfo[roleParam]}</p>
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
                                className="w-full py-2.5 px-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 text-sm md:text-base min-h-10"
                            >
                                {loading || isLoading ? 'Signing in...' : 'Sign In'}
                            </button>

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
                                className="block w-full py-2.5 px-4 border-2 border-green-300 text-green-100 font-semibold rounded-lg text-center hover:bg-white/10 transition-all text-sm md:text-base min-h-10 flex items-center justify-center"
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
