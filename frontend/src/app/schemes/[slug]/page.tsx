import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { fetchSchemeBySlug } from '@/services/schemes';

const formatDate = (value?: string) => {
    if (!value) return 'Recently published';

    return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).format(new Date(value));
};

type SchemeDetailPageProps = {
    params: {
        slug: string;
    };
};

export default async function SchemeDetailPage({ params }: SchemeDetailPageProps) {
    let scheme: Awaited<ReturnType<typeof fetchSchemeBySlug>> | null = null;
    let error = '';

    try {
        scheme = await fetchSchemeBySlug(params.slug);
    } catch (requestError) {
        error = requestError instanceof Error ? requestError.message : 'Unable to load this scheme.';
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-lime-50 via-white to-amber-50">
            <Navbar />

            <section className="section-container py-10">
                <Link href="/schemes" className="inline-flex rounded-full border border-green-300 bg-white px-4 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-50">Back To Schemes</Link>
            </section>

            {error || !scheme ? (
                <section className="section-container pb-12">
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">{error || 'Scheme not found.'}</div>
                </section>
            ) : (
                <article className="section-container pb-16">
                    <div className="overflow-hidden rounded-[2rem] border border-green-100 bg-white shadow-sm">
                        <div className="h-56 bg-gradient-to-r from-amber-200 via-lime-200 to-emerald-200 md:h-80">
                            {scheme.coverImage ? <img src={scheme.coverImage} alt={scheme.title} className="h-full w-full object-cover" /> : null}
                        </div>

                        <div className="mx-auto max-w-3xl px-5 py-8 md:px-8 md:py-10">
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-700">{formatDate(scheme.publishedAt || scheme.createdAt)} • {scheme.department}</p>
                            <h1 className="mt-3 text-3xl font-extrabold leading-tight text-gray-900 md:text-5xl">{scheme.title}</h1>
                            <p className="mt-4 text-base font-medium text-emerald-700">For {scheme.audience}</p>

                            {scheme.tags?.length ? (
                                <div className="mt-5 flex flex-wrap gap-2">
                                    {scheme.tags.map((tag) => (
                                        <span key={tag} className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-green-800">{tag}</span>
                                    ))}
                                </div>
                            ) : null}

                            <p className="mt-8 whitespace-pre-wrap text-base leading-8 text-gray-700">{scheme.description}</p>

                            {scheme.benefits?.length ? (
                                <div className="mt-8 rounded-2xl border border-green-100 bg-green-50/70 p-5">
                                    <h2 className="text-lg font-bold text-gray-900">Key Benefits</h2>
                                    <ul className="mt-4 space-y-3 text-gray-700">
                                        {scheme.benefits.map((benefit) => (
                                            <li key={benefit} className="flex gap-3">
                                                <span className="mt-2 h-2 w-2 rounded-full bg-green-600" />
                                                <span>{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : null}

                            {scheme.applicationLink ? (
                                <div className="mt-8">
                                    <a href={scheme.applicationLink} target="_blank" rel="noreferrer" className="inline-flex rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700">Apply Now</a>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </article>
            )}

            <Footer />
        </main>
    );
}