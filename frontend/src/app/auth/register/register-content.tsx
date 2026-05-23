'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
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

interface FormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    role: UserRole;
    farmSize?: string;
    location?: string;
    soilType?: string;
    businessType?: string;
    companyName?: string;
    farmingArea?: string;
}

export default function RegisterContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { register, isLoading } = useAuth();

    const roleParam: UserRole = searchParams?.get('role') === 'shopkeeper' ? 'shopkeeper' : 'farmer';
    const role = roleParam;

    // single-step registration: show all fields at once
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        role,
        farmSize: '',
        location: '',
        soilType: '',
        businessType: '',
        companyName: '',
        farmingArea: '',
    });

    const theme = roleTheme[role];

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 30);
        return () => clearTimeout(t);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError('');
    };

    const validateAll = () => {
        if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.location?.trim()) {
            return 'Please fill all required fields';
        }

        if (role === 'farmer' && (!formData.farmSize?.trim() || !formData.soilType?.trim() || !formData.farmingArea?.trim())) {
            return 'Please fill all farmer fields';
        }

        if (role === 'shopkeeper' && (!formData.companyName?.trim() || !formData.businessType?.trim())) {
            return 'Please fill all shopkeeper fields';
        }

        if (!formData.password.trim() || !formData.confirmPassword.trim()) {
            return 'Please fill password fields';
        }
        if (formData.password.length < 6) {
            return 'Password must be at least 6 characters';
        }
        if (formData.password !== formData.confirmPassword) {
            return 'Passwords do not match';
        }

        return '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const message = validateAll();
        if (message) {
            setError(message);
            return;
        }

        setError('');
        setLoading(true);

        try {
            const user = await register(formData, roleParam);
            router.push(`/dashboard/${user.role}`);
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
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

                        {/* single-step registration — entrance animation and focus effects */}

                        {error && (
                            <div className="mb-3 p-2.5 rounded-lg bg-red-500/20 border border-red-300/40 text-red-100 text-sm">
                                {error}
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            className={`space-y-3 transform transition-all duration-500 ease-out ${mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'}`}
                        >
                            {/* always show primary info */}
                            <>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Full name"
                                    className="w-full h-10 px-3 rounded-lg border border-white/30 bg-white/15 text-white placeholder:text-white/60 focus:ring-2 focus:ring-green-400 focus:border-transparent transition transform duration-200 ease-out focus:scale-105 focus:shadow-lg"
                                    required
                                />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Email"
                                    className="w-full h-10 px-3 rounded-lg border border-white/30 bg-white/15 text-white placeholder:text-white/60 focus:ring-2 focus:ring-green-400 focus:border-transparent transition transform duration-200 ease-out focus:scale-105 focus:shadow-lg"
                                    required
                                />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="Phone"
                                    className="w-full h-10 px-3 rounded-lg border border-white/30 bg-white/15 text-white placeholder:text-white/60 focus:ring-2 focus:ring-green-400 focus:border-transparent transition transform duration-200 ease-out focus:scale-105 focus:shadow-lg"
                                    required
                                />
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    placeholder="Location"
                                    className="w-full h-10 px-3 rounded-lg border border-white/30 bg-white/15 text-white placeholder:text-white/60 focus:ring-2 focus:ring-green-400 focus:border-transparent transition transform duration-200 ease-out focus:scale-105 focus:shadow-lg"
                                    required
                                />

                                {role === 'farmer' && (
                                    <>
                                        <input
                                            type="text"
                                            name="farmSize"
                                            value={formData.farmSize}
                                            onChange={handleInputChange}
                                            placeholder="Farm size (acres)"
                                            className="w-full h-10 px-3 rounded-lg border border-white/30 bg-white/15 text-white placeholder:text-white/60 focus:ring-2 focus:ring-green-400 focus:border-transparent transition transform duration-200 ease-out focus:scale-105 focus:shadow-lg"
                                        />
                                        <select
                                            title="Select soil type"
                                            name="soilType"
                                            value={formData.soilType}
                                            onChange={handleInputChange}
                                            className="w-full h-10 px-3 rounded-lg border border-white/30 bg-white/85 text-gray-800 focus:ring-2 focus:ring-green-400 focus:border-transparent"
                                        >
                                            <option value="">Soil type</option>
                                            <option value="clay">Clay</option>
                                            <option value="loam">Loam</option>
                                            <option value="sandy">Sandy</option>
                                            <option value="silt">Silt</option>
                                        </select>
                                        <input
                                            type="text"
                                            name="farmingArea"
                                            value={formData.farmingArea}
                                            onChange={handleInputChange}
                                            placeholder="Farming area"
                                            className="w-full h-10 px-3 rounded-lg border border-white/30 bg-white/15 text-white placeholder:text-white/60 focus:ring-2 focus:ring-green-400 focus:border-transparent transition transform duration-200 ease-out focus:scale-105 focus:shadow-lg"
                                        />
                                    </>
                                )}

                                {role === 'shopkeeper' && (
                                    <>
                                        <input
                                            type="text"
                                            name="companyName"
                                            value={formData.companyName}
                                            onChange={handleInputChange}
                                            placeholder="Shop name"
                                            className="w-full h-10 px-3 rounded-lg border border-white/30 bg-white/15 text-white placeholder:text-white/60 focus:ring-2 focus:ring-green-400 focus:border-transparent transition transform duration-200 ease-out focus:scale-105 focus:shadow-lg"
                                        />
                                        <select
                                            title="Select business type"
                                            name="businessType"
                                            value={formData.businessType}
                                            onChange={handleInputChange}
                                            className="w-full h-10 px-3 rounded-lg border border-white/30 bg-white/85 text-gray-800 focus:ring-2 focus:ring-green-400 focus:border-transparent"
                                        >
                                            <option value="">Business type</option>
                                            <option value="fertilizers">Fertilizers & Seeds</option>
                                            <option value="tools">Agricultural Tools</option>
                                            <option value="general">General Store</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </>
                                )}

                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="Password"
                                        className="w-full h-10 px-3 pr-10 rounded-lg border border-white/30 bg-white/15 text-white placeholder:text-white/60 focus:ring-2 focus:ring-green-400 focus:border-transparent transition transform duration-200 ease-out focus:scale-105 focus:shadow-lg"
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
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        placeholder="Confirm password"
                                        className="w-full h-10 px-3 pr-10 rounded-lg border border-white/30 bg-white/15 text-white placeholder:text-white/60 focus:ring-2 focus:ring-green-400 focus:border-transparent transition transform duration-200 ease-out focus:scale-105 focus:shadow-lg"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                                    >
                                        {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                    </button>
                                </div>
                            </>

                            <div className="pt-1 flex items-center gap-2">
                                <button
                                    type="submit"
                                    disabled={loading || isLoading}
                                    className={`flex-1 h-10 rounded-lg bg-gradient-to-r ${theme.accent} text-white font-semibold disabled:opacity-60`}
                                >
                                    {loading || isLoading ? 'Creating...' : 'Create Account'}
                                </button>
                            </div>

                            <p className="text-center text-xs text-white/85">
                                <Link href={`/auth/login?role=${role}`} className={`${theme.soft} font-semibold hover:text-white`}>
                                    Sign in
                                </Link>
                            </p>

                            <div className="mt-2">
                                <a
                                    href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/google?role=${role}`}
                                    className="w-full block mt-2 py-2.5 px-4 border border-white/30 rounded-lg bg-white/10 text-white hover:bg-white/15 transition text-sm md:text-base text-center"
                                >
                                    <svg className="inline-block h-4 w-4 mr-2 align-middle" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M21.35 11.1h-9.18v2.92h5.26c-.23 1.55-1.55 4.56-5.26 4.56-3.16 0-5.73-2.61-5.73-5.83s2.57-5.83 5.73-5.83c1.8 0 3 .77 3.69 1.43l2.52-2.42C16.8 3.24 14.58 2.2 11.7 2.2 6.91 2.2 3 6.12 3 10.9s3.91 8.7 8.7 8.7c5.02 0 8.36-3.52 8.66-8.5.01-.26.01-.5.0-.0z" fill="currentColor" />
                                    </svg>
                                    Continue with Google
                                </a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}
