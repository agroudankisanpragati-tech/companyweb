'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth, type UserRole } from '@/context/AuthContext';

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
    taxId?: string;
    farmingArea?: string;
    avgYield?: string;
}

const roleDetails = {
    farmer: {
        title: 'Farmer Registration',
    },
    shopkeeper: {
        title: 'Shopkeeper Registration',
    },
    agribusiness: {
        title: 'Agribusiness Registration',
    },
};

export default function RegisterContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { register, isLoading } = useAuth();

    const roleParam = ((searchParams?.get('role') as UserRole) || 'farmer');
    const role = roleParam;

    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
        taxId: '',
        farmingArea: '',
        avgYield: '',
    });

    const roleInfo = roleDetails[role];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError('');
    };

    const validateStep = (currentStep: number) => {
        if (currentStep === 1) {
            if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.location?.trim()) {
                return 'Please fill all fields';
            }
        }

        if (currentStep === 2) {
            if (role === 'farmer' && (!formData.farmSize?.trim() || !formData.soilType?.trim() || !formData.farmingArea?.trim())) {
                return 'Please fill all fields';
            }
            if (role === 'shopkeeper' && (!formData.companyName?.trim() || !formData.businessType?.trim())) {
                return 'Please fill all fields';
            }
            if (role === 'agribusiness' && (!formData.companyName?.trim() || !formData.taxId?.trim() || !formData.businessType?.trim() || !formData.avgYield?.trim())) {
                return 'Please fill all fields';
            }
        }

        if (currentStep === 3) {
            if (!formData.password.trim() || !formData.confirmPassword.trim()) {
                return 'Please fill all fields';
            }
            if (formData.password.length < 6) {
                return 'Password must be at least 6 characters';
            }
            if (formData.password !== formData.confirmPassword) {
                return 'Passwords do not match';
            }
        }

        return '';
    };

    const handleNext = () => {
        const message = validateStep(step);
        if (message) {
            setError(message);
            return;
        }
        setError('');
        setStep((prev) => Math.min(prev + 1, 3));
    };

    const handleBack = () => {
        setError('');
        setStep((prev) => Math.max(prev - 1, 1));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const message = validateStep(3);
        if (message) {
            setError(message);
            return;
        }

        setError('');
        setLoading(true);

        try {
            await register(formData);
            router.push(`/dashboard/${role}`);
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
                <div className="relative overflow-hidden rounded-2xl border border-white/30 shadow-2xl max-h-[94dvh]">
                    <div className="absolute inset-0 bg-[url('/background%20img.jpg')] bg-cover bg-center" />
                    <div className="absolute inset-0 bg-black/40" />

                    <div className="relative z-10 p-4 md:p-6 backdrop-blur-md">
                        <div className="flex items-center justify-between mb-3">
                            <Link href="/auth/role-select" className="text-green-200 hover:text-green-100 text-sm inline-flex items-center gap-2">
                                <FaArrowLeft size={12} />
                                Back
                            </Link>
                            <span className="text-xs text-white/80">Step {step}/3</span>
                        </div>

                        <div className="flex items-center gap-3 mb-3 rounded-xl border border-white/20 bg-white/10 px-3 py-2">
                            <div className="h-11 w-11 rounded-lg overflow-hidden ring-2 ring-white/40">
                                <Image src="/logo.png" alt="Kisan Unnati" width={44} height={44} className="h-full w-full object-cover" />
                            </div>
                            <div>
                                <p className="text-[11px] tracking-[0.2em] uppercase text-green-200">Kisan Unnati</p>
                                <p className="text-white font-semibold leading-tight">{roleInfo.title}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-4">
                            <div className={`h-1.5 rounded-full ${step >= 1 ? 'bg-green-400' : 'bg-white/30'}`} />
                            <div className={`h-1.5 rounded-full ${step >= 2 ? 'bg-green-400' : 'bg-white/30'}`} />
                            <div className={`h-1.5 rounded-full ${step >= 3 ? 'bg-green-400' : 'bg-white/30'}`} />
                        </div>

                        {error && (
                            <div className="mb-3 p-2.5 rounded-lg bg-red-500/20 border border-red-300/40 text-red-100 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-3">
                            {step === 1 && (
                                <>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Full name"
                                        className="w-full h-10 px-3 rounded-lg border border-white/30 bg-white/15 text-white placeholder:text-white/60 focus:ring-2 focus:ring-green-400 focus:border-transparent"
                                        required
                                    />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Email"
                                        className="w-full h-10 px-3 rounded-lg border border-white/30 bg-white/15 text-white placeholder:text-white/60 focus:ring-2 focus:ring-green-400 focus:border-transparent"
                                        required
                                    />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="Phone"
                                        className="w-full h-10 px-3 rounded-lg border border-white/30 bg-white/15 text-white placeholder:text-white/60 focus:ring-2 focus:ring-green-400 focus:border-transparent"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        placeholder="Location"
                                        className="w-full h-10 px-3 rounded-lg border border-white/30 bg-white/15 text-white placeholder:text-white/60 focus:ring-2 focus:ring-green-400 focus:border-transparent"
                                        required
                                    />
                                </>
                            )}

                            {step === 2 && role === 'farmer' && (
                                <>
                                    <input
                                        type="text"
                                        name="farmSize"
                                        value={formData.farmSize}
                                        onChange={handleInputChange}
                                        placeholder="Farm size (acres)"
                                        className="w-full h-10 px-3 rounded-lg border border-white/30 bg-white/15 text-white placeholder:text-white/60 focus:ring-2 focus:ring-green-400 focus:border-transparent"
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
                                        className="w-full h-10 px-3 rounded-lg border border-white/30 bg-white/15 text-white placeholder:text-white/60 focus:ring-2 focus:ring-green-400 focus:border-transparent"
                                    />
                                </>
                            )}

                            {step === 2 && role === 'shopkeeper' && (
                                <>
                                    <input
                                        type="text"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleInputChange}
                                        placeholder="Shop name"
                                        className="w-full h-10 px-3 rounded-lg border border-white/30 bg-white/15 text-white placeholder:text-white/60 focus:ring-2 focus:ring-green-400 focus:border-transparent"
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

                            {step === 2 && role === 'agribusiness' && (
                                <>
                                    <input
                                        type="text"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleInputChange}
                                        placeholder="Company name"
                                        className="w-full h-10 px-3 rounded-lg border border-white/30 bg-white/15 text-white placeholder:text-white/60 focus:ring-2 focus:ring-green-400 focus:border-transparent"
                                    />
                                    <input
                                        type="text"
                                        name="taxId"
                                        value={formData.taxId}
                                        onChange={handleInputChange}
                                        placeholder="Tax ID/GST"
                                        className="w-full h-10 px-3 rounded-lg border border-white/30 bg-white/15 text-white placeholder:text-white/60 focus:ring-2 focus:ring-green-400 focus:border-transparent"
                                    />
                                    <select
                                        title="Select business type"
                                        name="businessType"
                                        value={formData.businessType}
                                        onChange={handleInputChange}
                                        className="w-full h-10 px-3 rounded-lg border border-white/30 bg-white/85 text-gray-800 focus:ring-2 focus:ring-green-400 focus:border-transparent"
                                    >
                                        <option value="">Business type</option>
                                        <option value="manufacturing">Manufacturing</option>
                                        <option value="export">Export</option>
                                        <option value="distribution">Distribution</option>
                                        <option value="processing">Processing</option>
                                    </select>
                                    <input
                                        type="text"
                                        name="avgYield"
                                        value={formData.avgYield}
                                        onChange={handleInputChange}
                                        placeholder="Average annual yield"
                                        className="w-full h-10 px-3 rounded-lg border border-white/30 bg-white/15 text-white placeholder:text-white/60 focus:ring-2 focus:ring-green-400 focus:border-transparent"
                                    />
                                </>
                            )}

                            {step === 3 && (
                                <>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            placeholder="Password"
                                            className="w-full h-10 px-3 pr-10 rounded-lg border border-white/30 bg-white/15 text-white placeholder:text-white/60 focus:ring-2 focus:ring-green-400 focus:border-transparent"
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
                                            className="w-full h-10 px-3 pr-10 rounded-lg border border-white/30 bg-white/15 text-white placeholder:text-white/60 focus:ring-2 focus:ring-green-400 focus:border-transparent"
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
                            )}

                            <div className="pt-1 flex items-center gap-2">
                                {step > 1 && (
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="flex-1 h-10 rounded-lg border border-white/40 text-white hover:bg-white/10"
                                    >
                                        Back
                                    </button>
                                )}

                                {step < 3 ? (
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        className="flex-1 h-10 rounded-lg bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold"
                                    >
                                        Next
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={loading || isLoading}
                                        className="flex-1 h-10 rounded-lg bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold disabled:opacity-60"
                                    >
                                        {loading || isLoading ? 'Creating...' : 'Create Account'}
                                    </button>
                                )}
                            </div>

                            {step === 3 && (
                                <p className="text-center text-xs text-white/85">
                                    <Link href={`/auth/login?role=${role}`} className="text-green-200 font-semibold hover:text-green-100">
                                        Sign in
                                    </Link>
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}
