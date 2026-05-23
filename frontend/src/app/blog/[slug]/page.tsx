import Link from 'next/link';
import Image from 'next/image';
// Header/Footer are shown only on the home page.
import { fetchBlogBySlug, fetchPublishedBlogs } from '@/services/blog';
import ShareButtons from '@/components/ShareButtons';

const formatDate = (value?: string) => {
    if (!value) return 'Recently published';

    return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).format(new Date(value));
};

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

type BlogDetailPageProps = {
    params: {
        slug: string;
    };
};

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
    let post: Awaited<ReturnType<typeof fetchBlogBySlug>> | null = null;
    let relatedPosts: Awaited<ReturnType<typeof fetchPublishedBlogs>> = [];
    let error = '';

    try {
        post = await fetchBlogBySlug(params.slug);
        const allPosts = await fetchPublishedBlogs();
        relatedPosts = allPosts.filter(p => p.tags?.some(tag => post?.tags?.includes(tag)) && p._id !== post?._id).slice(0, 3);
    } catch (requestError) {
        error = requestError instanceof Error ? requestError.message : 'Unable to load this post.';
    }

    const shareUrl = post ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'https://agroudankisanpragati.com'}/blog/${post.slug}` : '';
    const readTime = post ? Math.max(1, Math.ceil(stripHtml(post.content).split(/\s+/).filter(Boolean).length / 180)) : 0;

    return (
        <main className="relative min-h-screen bg-white md:bg-transparent">
            <div className="absolute inset-0 -z-10 hidden md:block" style={{ backgroundImage: "url('/blogbg.png')", backgroundAttachment: 'fixed', backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div className="absolute inset-0 -z-10 hidden md:block bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.02),transparent_34%),linear-gradient(180deg,rgba(248,250,245,0.1)_0%,rgba(255,255,255,0.05)_48%,rgba(244,249,239,0.1)_100%)]" />
            

            {error || !post ? (
                <section className="section-container mt-6 md:mt-8 pb-12 relative z-10">
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">{error || 'Post not found.'}</div>
                </section>
            ) : (
                <>
                    <article className="mx-auto max-w-[96rem] px-0 md:px-6 lg:px-8 mt-0 md:mt-8 pb-0 md:pb-16 relative z-10">
                        <div className="overflow-hidden rounded-none border-0 bg-white shadow-none md:rounded-[2rem] md:border md:border-green-100 md:bg-white/90 md:backdrop-blur-md md:shadow-[0_20px_60px_rgba(16,24,40,0.15)]">
                            {/* Cover Image */}
                            <div className="relative min-h-[13rem] bg-white md:min-h-[26.4rem] md:bg-gradient-to-br md:from-green-100 md:via-lime-50 md:to-amber-100">
                                {post.coverImage ? (
                                    <Image
                                        src={post.coverImage}
                                        alt={post.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 80vw"
                                        priority
                                    />
                                ) : (
                                    <div className="flex h-full min-h-72 items-center justify-center px-8 text-center text-3xl font-black text-green-900 md:text-5xl">
                                        {post.title}
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/20 to-transparent md:from-black/60" />

                                <div className="absolute right-3 top-3 z-20 md:right-6 md:top-6">
                                    <ShareButtons url={shareUrl} title={post.title} />
                                </div>

                                {/* Metadata Overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 lg:p-12">
                                    <div className="w-full">
                                        <div className="mb-3 flex flex-wrap items-center gap-2 md:gap-3">
                                            <Link href="/blog" className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold text-white/95 backdrop-blur transition hover:bg-white/30 md:px-4 md:py-1.5 md:text-xs">
                                                <span aria-hidden="true">←</span> Back to Blog
                                            </Link>
                                            <span className="rounded-full bg-green-500/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur md:px-4 md:py-1.5 md:text-xs">
                                                {post.tags?.[0] || 'General'}
                                            </span>
                                            <span className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold text-white/90 backdrop-blur md:text-xs">
                                                ⏱ {readTime} min read
                                            </span>
                                        </div>
                                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-green-100 md:mb-2 md:text-xs md:tracking-[0.18em]">
                                            {formatDate(post.publishedAt || post.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="w-full px-4 py-6 md:px-8 md:py-12 lg:px-10">
                                {/* Title */}
                                <h1 className="mx-auto max-w-4xl text-center text-2xl font-black leading-tight text-green-700 md:text-4xl lg:text-5xl mb-3 md:mb-4">
                                    {post.title}
                                </h1>

                                {/* Tags */}
                                {post.tags?.length ? (
                                    <div className="mt-4 flex flex-wrap gap-2 md:mt-6">
                                        {post.tags.map((tag) => (
                                            <span key={tag} className="rounded-full border-2 border-green-200 bg-green-50/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-green-700 transition hover:bg-green-100 md:px-4 md:py-1.5 md:text-xs">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                ) : null}

                                {/* Content Grid */}
                                <div className="mt-6 space-y-6 md:mt-10 md:space-y-8">
                                    {/* Main Content */}
                                    <div className="space-y-4 md:space-y-6">
                                        <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50/80 to-gray-50/40 p-4 backdrop-blur-sm md:p-8">
                                            <div
                                                className="blog-content text-[15px] leading-7 text-gray-700 md:text-lg md:leading-9 prose prose-sm md:prose-base max-w-none [&_p]:mb-4 [&_p]:text-gray-700 [&_h1]:mt-8 [&_h1]:mb-4 [&_h1]:text-3xl [&_h1]:font-black [&_h1]:text-gray-950 [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-gray-950 [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-gray-900 [&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-green-500 [&_blockquote]:bg-green-50/50 [&_blockquote]:pl-5 [&_blockquote]:pr-4 [&_blockquote]:py-3 [&_blockquote]:italic [&_blockquote]:text-gray-700 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_li]:text-gray-700 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_a]:font-semibold [&_a]:text-green-600 [&_a]:underline [&_a]:hover:text-green-700 [&_strong]:font-bold [&_strong]:text-gray-900"
                                                dangerouslySetInnerHTML={{ __html: post.content }}
                                            />
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>

                    {/* Related Posts */}
                    {relatedPosts.length > 0 ? (
                        <section className="mx-auto max-w-[96rem] px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                            <div className="mb-8">
                                <h2 className="text-3xl md:text-4xl font-black text-gray-950 mb-2">Related Articles</h2>
                                <p className="text-gray-600">Read more on similar topics</p>
                            </div>
                            <div className="grid gap-6 md:grid-cols-3">
                                {relatedPosts.map((relatedPost) => (
                                    <Link key={relatedPost._id} href={`/blog/${relatedPost.slug}`} className="group">
                                        <div className="overflow-hidden rounded-2xl border border-green-100 bg-white/85 backdrop-blur-md shadow-sm hover:shadow-xl transition duration-300 h-full hover:-translate-y-1">
                                            <div className="relative h-40 bg-gradient-to-br from-green-100 to-amber-100">
                                                {relatedPost.coverImage ? (
                                                    <Image src={relatedPost.coverImage} alt={relatedPost.title} fill className="object-cover group-hover:scale-105 transition duration-300" sizes="(max-width: 768px) 100vw, 33vw" />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center px-4 text-center text-sm font-bold text-green-900">{relatedPost.title}</div>
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-bold text-gray-950 line-clamp-2 text-sm mb-2">{relatedPost.title}</h3>
                                                <p className="text-xs text-gray-600 line-clamp-2 mb-3">{relatedPost.excerpt}</p>
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="text-gray-500">{formatDate(relatedPost.publishedAt || relatedPost.createdAt)}</span>
                                                    <span className="text-green-600 font-semibold">→</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    ) : null}
                </>
            )}

            
        </main>
    );
}
