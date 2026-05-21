import Link from 'next/link';
import { fetchPublishedBlogs } from '@/services/blog';

const formatDate = (value?: string) => {
    if (!value) return 'Recently published';

    return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(value));
};

export default async function BlogHighlights() {
    let posts = [] as Awaited<ReturnType<typeof fetchPublishedBlogs>>;

    try {
        posts = await fetchPublishedBlogs();
    } catch {
        posts = [];
    }

    const latestPosts = posts.slice(0, 3);

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-lime-50 to-green-100 py-16">
            <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-amber-300/30 blur-3xl" />
            <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-green-300/40 blur-3xl" />

            <div className="section-container relative">
                <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-green-700">Knowledge Hub</p>
                        <h2 className="mt-2 text-3xl font-extrabold text-gray-900 md:text-4xl">Fresh Stories From Kisan Unnati</h2>
                        <p className="mt-3 max-w-2xl text-sm text-gray-700 md:text-base">
                            Crop planning, mandi intelligence, and smart farming tips curated by our admin team.
                        </p>
                    </div>
                    <Link href="/blog" className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-700">
                        View All Posts
                    </Link>
                </div>

                {latestPosts.length === 0 ? (
                    <div className="rounded-2xl border border-green-200 bg-white/80 p-6 text-sm text-gray-700">
                        Blog posts will appear here once admin publishes them.
                    </div>
                ) : (
                    <div className="grid gap-5 md:grid-cols-3">
                        {latestPosts.map((post, index) => (
                            <article
                                key={post._id}
                                className="group rounded-2xl border border-green-200 bg-white/85 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                                style={{ animationDelay: `${index * 120}ms` }}
                            >
                                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-green-700">{formatDate(post.publishedAt || post.createdAt)}</p>
                                <h3 className="mt-3 text-xl font-bold text-gray-900">{post.title}</h3>
                                <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-700">{post.excerpt}</p>

                                <Link href={`/blog/${post.slug}`} className="mt-5 inline-flex text-sm font-bold text-green-700 transition group-hover:text-green-900">
                                    Read Article
                                </Link>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
