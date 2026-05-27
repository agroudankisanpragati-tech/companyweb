'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaArrowLeft, FaArrowRight, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth, type UserRole } from '@/context/AuthContext';

const roleTheme: Record<UserRole, { accent: string; panel: string; label: string; soft: string }> = {
    farmer: {
        accent: 'from-green-600 to-emerald-700',
        panel: 'border-green-300/30',
        label: 'Farmer Registration',
        soft: 'text-green-200',
    },
    shopkeeper: {
        accent: 'from-blue-600 to-cyan-700',
        panel: 'border-blue-300/30',
        label: 'Shopkeeper Registration',
        soft: 'text-blue-200',
    },
};

type Mode = 'email' | 'google';

export default function RegisterContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { requestEmailOtp, verifyEmailOtp, register, isLoading } = useAuth();

    const roleParam: UserRole = searchParams?.get('role') === 'shopkeeper' ? 'shopkeeper' : 'farmer';
    const role = roleParam;
    const theme = roleTheme[role];
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    const [mode, setMode] = useState<Mode>('email');
    const [mounted, setMounted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [devOtp, setDevOtp] = useState('');
    const [sendingOtp, setSendingOtp] = useState(false);
    const [verifyingOtp, setVerifyingOtp] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        shopName: '',
        email: '',
        otp: '',
        password: '',
    });

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 30);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        setOtpSent(false);
        setOtpVerified(false);
        setDevOtp('');
        setError('');
        setSuccess('');
        setFormData((prev) => ({ ...prev, otp: '' }));
    }, [role]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError('');
        setSuccess('');

        if (name === 'email') {
            setOtpSent(false);
            setOtpVerified(false);
            setDevOtp('');
        }
    };

    const googleHref = `${apiBase}/auth/google?role=${role}`;

    const sendOtp = async () => {
        if (!formData.email.trim()) {
            setError('Please enter your email first');
            return;
        }

        setSendingOtp(true);
        setError('');
        setSuccess('');

        try {
            const data = await requestEmailOtp(formData.email.trim());
            setOtpSent(true);
            setOtpVerified(false);
            setSuccess('OTP sent to your email. Enter the code to continue.');
            setDevOtp(data?.devOtp || '');
        } catch (err: any) {
            setError(err?.message || 'Failed to send OTP');
        } finally {
            setSendingOtp(false);
        }
    };

    const verifyOtp = async () => {
        if (!formData.email.trim() || !formData.otp.trim()) {
            setError('Please enter your email and OTP');
            return;
        }

        setVerifyingOtp(true);
        setError('');
        setSuccess('');

        try {
            await verifyEmailOtp(formData.email.trim(), formData.otp.trim());
            setOtpVerified(true);
            setSuccess('Email verified. You can now create your account.');
        } catch (err: any) {
            setOtpVerified(false);
            setError(err?.message || 'OTP verification failed');
        } finally {
            setVerifyingOtp(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            setError('Please enter your name');
            return;
        }

        if (role === 'shopkeeper' && !formData.shopName.trim()) {
            setError('Please enter your shop name');
            return;
        }

        if (!otpVerified) {
            setError('Please verify your email OTP before registering');
            return;
        }

        if (!formData.password.trim()) {
            setError('Please enter a password');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            const user = await register(
                {
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    password: formData.password,
                    role,
                    companyName: role === 'shopkeeper' ? formData.shopName.trim() : undefined,
                    shopName: role === 'shopkeeper' ? formData.shopName.trim() : undefined,
                },
                role
            );

            router.push(`/dashboard/${user.role}`);
        } catch (err: any) {
            setError(err?.message || 'Registration failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="h-[100dvh] overflow-hidden bg-[url('/background%20img.jpg')] bg-cover bg-center bg-no-repeat flex items-center justify-center">
            <div className="fixed inset-0 z-0 bg-black/40" />

            <div className="w-full max-w-xl px-4 relative z-10">
                <div className={`relative overflow-hidden rounded-2xl border ${theme.panel} shadow-2xl max-h-[94dvh]`}>
                    <div className="absolute inset-0 bg-[url('/background%20img.jpg')] bg-cover bg-center" />
                    <div className="absolute inset-0 bg-black/40" />

                    <div className="relative z-10 p-4 md:p-6 backdrop-blur-md">
                        <div className="flex items-center justify-between mb-3">
                            <Link href="/auth/role-select" className="text-green-200 hover:text-green-100 text-sm inline-flex items-center gap-2">
                                <FaArrowLeft size={12} />
                                Back
                            </Link>
                        </div>

                        <div className="flex items-center gap-3 mb-3 rounded-xl border border-white/20 bg-white/10 px-3 py-2">
                            <div className="h-11 w-11 rounded-lg overflow-hidden ring-2 ring-white/40">
                                <Image src="/logo.png" alt="Kisan Unnati" width={44} height={44} className="h-full w-full object-cover" />
                            </div>
                            <div>
                                <p className="text-[11px] tracking-[0.2em] uppercase text-green-200">Kisan Unnati</p>
                                <p className="text-white font-semibold leading-tight">{theme.label}</p>
                            </div>
                        </div>

                        <div className="mb-3 grid grid-cols-2 gap-2 rounded-xl border border-white/15 bg-white/10 p-1">
                            <button
                                type="button"
                                onClick={() => setMode('email')}
                                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${mode === 'email' ? 'bg-white text-gray-900' : 'text-white/85 hover:bg-white/10'}`}
                            >
                                Register with Email
                            </button>
                            <button
                                type="button"
                                onClick={() => setMode('google')}
                                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${mode === 'google' ? 'bg-white text-gray-900' : 'text-white/85 hover:bg-white/10'}`}
                            >
                                Continue with Google
                            </button>
                        </div>

                        {error && (
                            <div className="mb-3 rounded-lg border border-red-300/40 bg-red-500/20 p-2.5 text-sm text-red-100">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="mb-3 rounded-lg border border-emerald-300/40 bg-emerald-500/20 p-2.5 text-sm text-emerald-50">
                                {success}
                            </div>
                        )}

                        {devOtp && (
                            <div className="mb-3 rounded-lg border border-amber-300/40 bg-amber-500/20 p-2.5 text-sm text-amber-50">
                                Dev OTP: {devOtp}
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            className={`space-y-3 transform transition-all duration-500 ease-out ${mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'}`}
                        >
                            {mode === 'email' ? (
                                <>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Full name"
                                        className="w-full h-10 px-3 rounded-lg border border-white/30 bg-white/15 text-white placeholder:text-white/60 focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                                        required
                                    />

                                    {role === 'shopkeeper' && (
                                        <input
                                            type="text"
                                            name="shopName"
                                            value={formData.shopName}
                                            onChange={handleInputChange}
                                            placeholder="Shop name"
                                            className="w-full h-10 px-3 rounded-lg border border-white/30 bg-white/15 text-white placeholder:text-white/60 focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                                            required
                                        />
                                    )}

                                    <div className="flex flex-col gap-2 sm:flex-row">
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="Email"
                                            className="w-full h-10 px-3 rounded-lg border border-white/30 bg-white/15 text-white placeholder:text-white/60 focus:ring-2 focus:ring-green-400 focus:border-transparent transition sm:flex-1"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={sendOtp}
                                            disabled={sendingOtp || isLoading}
                                            className={`h-10 rounded-lg px-4 font-semibold text-white bg-gradient-to-r ${theme.accent} disabled:opacity-60`}
                                        >
                                            {sendingOtp ? 'Sending...' : 'Send OTP'}
                                        </button>
                                    </div>

                                    <div className="flex flex-col gap-2 sm:flex-row">
                                        <input
                                            type="text"
                                            name="otp"
                                            value={formData.otp}
                                            onChange={handleInputChange}
                                            placeholder="Enter OTP"
                                            className="w-full h-10 px-3 rounded-lg border border-white/30 bg-white/15 text-white placeholder:text-white/60 focus:ring-2 focus:ring-green-400 focus:border-transparent transition sm:flex-1"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={verifyOtp}
                                            disabled={verifyingOtp || !otpSent || isLoading}
                                            className="h-10 rounded-lg px-4 font-semibold text-white border border-white/30 bg-white/10 disabled:opacity-50"
                                        >
                                            {verifyingOtp ? 'Verifying...' : otpVerified ? 'Verified' : 'Verify OTP'}
                                        </button>
                                    </div>

                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            placeholder="Password"
                                            className="w-full h-10 px-3 pr-10 rounded-lg border border-white/30 bg-white/15 text-white placeholder:text-white/60 focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                                        >
                                            {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                        </button>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting || isLoading}
                                        className={`w-full h-10 rounded-lg bg-gradient-to-r ${theme.accent} text-white font-semibold disabled:opacity-60`}
                                    >
                                        {submitting || isLoading ? 'Creating...' : 'Register'}
                                    </button>
                                </>
                            ) : (
                                <div className="space-y-3">
                                    <p className="rounded-lg border border-white/20 bg-white/10 p-3 text-sm text-white/85">
                                        Continue with Google to register faster. Your role will stay as {role === 'shopkeeper' ? 'shopkeeper' : 'farmer'}.
                                    </p>
                                    <a
                                        href={googleHref}
                                        className={`w-full h-10 rounded-lg bg-gradient-to-r ${theme.accent} text-white font-semibold inline-flex items-center justify-center gap-2`}
                                    >
                                        Continue with Google
                                        <FaArrowRight size={12} />
                                    </a>
                                </div>
                            )}

                            <p className="text-center text-xs text-white/85">
                                <Link href={`/auth/login?role=${role}`} className={`${theme.soft} font-semibold hover:text-white`}>
                                    Sign in
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}