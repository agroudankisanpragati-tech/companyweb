import Link from 'next/link';
import TopBar from '@/components/TopBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { fetchPublishedSchemes } from '@/services/schemes';

const formatDate = (value?: string) => {
    if (!value) return 'Recently published';

    return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(value));
};

export default async function SchemesPage() {
    let schemes = [] as Awaited<ReturnType<typeof fetchPublishedSchemes>>;
    let error = '';

    try {
        schemes = await fetchPublishedSchemes();
    } catch (requestError) {
        error = requestError instanceof Error ? requestError.message : 'Unable to load government schemes right now.';
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-lime-50 via-white to-amber-50">
            <TopBar />
            <Navbar />

            <section className="relative overflow-hidden bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.22),transparent_45%),radial-gradient(circle_at_80%_15%,rgba(245,158,11,0.2),transparent_40%)] py-16">
                <div className="section-container">
                    <span className="inline-flex rounded-full bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-green-700">Government Schemes</span>
                    <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight text-gray-900 md:text-6xl">Find Subsidies, Support Programs, and Welfare Schemes</h1>
                    <p className="mt-5 max-w-2xl text-base text-gray-700 md:text-lg">Browse schemes published by the admin team to discover benefits, eligibility, and application details in one place.</p>
                </div>
            </section>

            <section className="section-container py-12">
                {error ? <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}

                {!error && schemes.length === 0 ? (
                    <div className="rounded-2xl border border-green-200 bg-white p-8 text-center text-gray-700 shadow-sm">No government schemes published yet. Please check back soon.</div>
                ) : null}

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {schemes.map((scheme) => (
                        <article key={scheme._id} className="group overflow-hidden rounded-3xl border border-green-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                            <div className="h-48 bg-gradient-to-br from-lime-200 via-emerald-100 to-amber-100">
                                {scheme.coverImage ? <img src={scheme.coverImage} alt={scheme.title} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center px-6 text-center text-xl font-bold text-green-800">{scheme.title}</div>}
                            </div>

                            <div className="p-6">
                                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-green-700">{formatDate(scheme.publishedAt || scheme.createdAt)}</p>
                                <h2 className="mt-3 text-2xl font-bold leading-tight text-gray-900">{scheme.title}</h2>
                                <p className="mt-1 text-sm font-medium text-emerald-700">{scheme.department}</p>
                                <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-700">{scheme.summary}</p>

                                {scheme.benefits?.length ? (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {scheme.benefits.slice(0, 3).map((benefit) => (
                                            <span key={benefit} className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">{benefit}</span>
                                        ))}
                                    </div>
                                ) : null}

                                <Link href={`/schemes/${scheme.slug}`} className="mt-6 inline-flex rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700">View Scheme</Link>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <Footer />
        </main>
    );
}