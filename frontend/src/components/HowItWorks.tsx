'use client';

import { FaUserPlus, FaRobot, FaLeaf, FaStore } from 'react-icons/fa';

const steps = [
    {
        icon: <FaUserPlus className="text-2xl md:text-3xl text-green-700" />,
        title: 'Create your farmer profile',
        description:
            'Add your location, soil type, farm size, and crop history so Kisan Unnati can personalize every recommendation.',
    },
    {
        icon: <FaRobot className="text-2xl md:text-3xl text-amber-600" />,
        title: 'Ask the AI assistant',
        description:
            'Use text or voice in your language to ask about crops, diseases, mandi prices, weather, and schemes.',
    },
    {
        icon: <FaLeaf className="text-2xl md:text-3xl text-emerald-600" />,
        title: 'Follow the smart plan',
        description:
            'Get crop recommendations, organic alternatives, irrigation tips, and disease treatment in simple steps.',
    },
    {
        icon: <FaStore className="text-2xl md:text-3xl text-slate-700" />,
        title: 'Sell and grow',
        description:
            'List produce in the marketplace, connect with buyers directly, and keep learning through community content.',
    },
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-green-50 py-12 md:py-20 lg:py-28">
            <div className="pointer-events-none absolute -top-20 right-0 h-64 w-64 rounded-full bg-green-300/20 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-amber-200/25 blur-3xl" />

            <div className="section-container relative z-10">
                <div className="mb-10 text-center md:mb-16">
                    <p className="text-xs font-bold uppercase tracking-[0.28em] text-green-700">Step by step</p>
                    <h2 className="mt-3 text-2xl font-extrabold text-gray-900 sm:text-3xl md:text-4xl">
                        How Kisan Unnati Works for a Farmer
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-gray-600 md:text-base">
                        Simple onboarding, guided decisions, and direct market access in one flow. Built for farmers who want clear actions, not complicated software.
                    </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                    {steps.map((step, index) => (
                        <article
                            key={step.title}
                            className="group relative rounded-3xl border border-green-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                        >
                            <div className="mb-5 flex items-center justify-between gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 ring-1 ring-green-100">
                                    {step.icon}
                                </div>
                                <div className="text-sm font-bold text-green-700">0{index + 1}</div>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
                            <p className="mt-3 text-sm leading-6 text-gray-600">{step.description}</p>

                            <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-green-600 to-emerald-500 transition-all duration-500 group-hover:w-full"
                                    style={{ width: `${25 + index * 18}%` }}
                                />
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}