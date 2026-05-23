import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/Footer';
// Header/Footer are shown only on the home page.
import { fetchPublishedBlogs } from '@/services/blog';

const formatDate = (value?: string) => {
    if (!value) return 'Recently published';

    return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(value));
};

type BlogPageProps = {
    searchParams?: {
        all?: string;
        q?: string;
    };
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
    let posts = [] as Awaited<ReturnType<typeof fetchPublishedBlogs>>;
    let error = '';
    const showAll = searchParams?.all === '1';
    const query = searchParams?.q?.trim().toLowerCase() || '';

    try {
        posts = await fetchPublishedBlogs();
    } catch (requestError) {
        error = requestError instanceof Error ? requestError.message : 'Unable to load blogs right now.';
    }

    const normalizedPosts = posts.map((post) => ({
        ...post,
        tags: post.tags || [],
    }));

    const filteredPosts = query
        ? normalizedPosts.filter((post) => {
            const haystack = [post.title, post.excerpt, post.content, ...(post.tags || [])].join(' ').toLowerCase();
            return haystack.includes(query);
        })
        : normalizedPosts;

    const visiblePosts = showAll ? filteredPosts : filteredPosts.slice(0, 9);
    const moreAvailable = filteredPosts.length > visiblePosts.length;

    return (
        <main className="relative min-h-screen">
            <div className="absolute inset-0 -z-10" style={{ backgroundImage: "url('/blogbg.png')", backgroundAttachment: 'fixed', backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div className="relative z-0">

                <section className="bg-transparent py-6 md:py-8">
                    <div className="section-container">
                        <div className="flex flex-col items-center gap-4 text-center">
                            <form action="/blog" method="get" className="w-full max-w-2xl">
                                <div className="flex items-center gap-2 rounded-2xl border border-green-200 bg-white/90 p-2 shadow-[0_12px_35px_rgba(16,24,40,0.08)] backdrop-blur-md transition focus-within:border-green-300 focus-within:ring-2 focus-within:ring-green-100">
                                    <span className="pl-2 text-green-700">
                                        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                                            <path d="M10 4a6 6 0 104.472 10.028l4.75 4.75 1.414-1.414-4.75-4.75A6 6 0 0010 4zm0 2a4 4 0 110 8 4 4 0 010-8z" />
                                        </svg>
                                    </span>
                                    <input
                                        type="search"
                                        name="q"
                                        defaultValue={searchParams?.q || ''}
                                        placeholder="Search articles, tags, or topics..."
                                        className="h-10 flex-1 rounded-xl border border-transparent bg-transparent px-2 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:ring-0"
                                    />
                                    {showAll ? <input type="hidden" name="all" value="1" /> : null}
                                    <button
                                        type="submit"
                                        className="inline-flex h-10 items-center justify-center rounded-xl bg-gray-950 px-5 text-sm font-semibold text-white transition hover:bg-green-700"
                                    >
                                        Search
                                    </button>
                                    {query ? (
                                        <Link
                                            href={showAll ? '/blog?all=1' : '/blog'}
                                            className="inline-flex h-10 items-center justify-center rounded-xl border border-green-200 px-4 text-sm font-semibold text-green-700 transition hover:bg-green-50"
                                        >
                                            Clear
                                        </Link>
                                    ) : null}
                                </div>
                            </form>
                        </div>
                    </div>
                </section>

                <section className="section-container py-8 md:py-10">
                    {error ? (
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">{error}</div>
                    ) : null}

                    {!error && normalizedPosts.length === 0 ? (
                        <div className="rounded-3xl border border-green-200 bg-white/90 p-8 text-center text-gray-700 shadow-sm">
                            No blog posts published yet. Please check back soon.
                        </div>
                    ) : null}

                    {!error && normalizedPosts.length > 0 && filteredPosts.length === 0 ? (
                        <div className="rounded-3xl border border-green-200 bg-white/90 p-8 text-center text-gray-700 shadow-sm">
                            No blog posts found for your search.
                        </div>
                    ) : null}

                    <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {visiblePosts.map((post) => (
                            <article
                                key={post._id}
                                className="group overflow-hidden rounded-3xl border border-green-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
                            >
                                <div className="relative h-48 bg-gradient-to-br from-lime-100 via-emerald-50 to-amber-100">
                                    {post.coverImage ? (
                                        <Image
                                            src={post.coverImage}
                                            alt={post.title}
                                            fill
                                            className="object-cover transition duration-500 group-hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center px-6 text-center text-xl font-black text-green-900">
                                            {post.title}
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                                </div>

                                <div className="p-5 md:flex-1 md:p-6">
                                    <div className="flex items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-green-700">
                                        <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                                        {post.authorName ? <span className="text-gray-500 normal-case tracking-normal">{post.authorName}</span> : null}
                                    </div>

                                    <h2 className="mt-2.5 text-2xl font-bold leading-tight text-gray-950 md:text-[1.65rem]">{post.title}</h2>
                                    <p className="mt-2.5 line-clamp-3 text-sm leading-6 text-gray-700">{post.excerpt}</p>

                                    {post.tags?.length ? (
                                        <div className="mt-3.5 flex flex-wrap gap-2">
                                            {post.tags.slice(0, 3).map((tag) => (
                                                <span key={tag} className="rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-700">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    ) : null}

                                    <div className="mt-5 flex items-center justify-between gap-3">
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            className="inline-flex items-center gap-2 rounded-xl bg-gray-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
                                        >
                                            Read Full Post
                                            <span aria-hidden="true">→</span>
                                        </Link>
                                        <span className="hidden text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 md:inline-flex">Kisan Unnati</span>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    {moreAvailable ? (
                        <div className="mt-8 flex justify-center">
                            <Link href="/blog?all=1" className="inline-flex items-center gap-2 rounded-full bg-gray-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700">
                                View More
                                <span aria-hidden="true">→</span>
                            </Link>
                        </div>
                    ) : null}
                </section>

                <Footer />
            </div>
        </main>
    );
}
