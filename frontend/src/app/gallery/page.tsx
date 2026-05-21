import TopBar from '@/components/TopBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { fetchPublishedGallery } from '@/services/gallery';

const formatDate = (value?: string) => {
    if (!value) return 'Recently added';

    return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(value));
};

export default async function GalleryPage() {
    let items = [] as Awaited<ReturnType<typeof fetchPublishedGallery>>;
    let error = '';

    try {
        items = await fetchPublishedGallery();
    } catch (requestError) {
        error = requestError instanceof Error ? requestError.message : 'Unable to load gallery right now.';
    }

    const photoItems = items.filter((item) => item.mediaType === 'photo');
    const videoItems = items.filter((item) => item.mediaType === 'video');

    return (
        <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-green-50">
            <TopBar />
            <Navbar />

            <section className="relative overflow-hidden bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.2),transparent_45%),radial-gradient(circle_at_80%_15%,rgba(245,158,11,0.18),transparent_40%)] py-16">
                <div className="section-container">
                    <span className="inline-flex rounded-full bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-green-700">
                        Gallery
                    </span>
                    <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight text-gray-900 md:text-6xl">Photos and Videos From the Field</h1>
                    <p className="mt-5 max-w-2xl text-base text-gray-700 md:text-lg">
                        Browse farm photos and videos uploaded by the admin team. Photos and videos are shown in separate sections on the same page.
                    </p>
                </div>
            </section>

            <section className="section-container py-12 space-y-10">
                {error ? <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}

                <section>
                    <div className="mb-5 flex items-end justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-700">Photo Section</p>
                            <h2 className="mt-2 text-2xl font-extrabold text-gray-900 md:text-3xl">Photo Gallery</h2>
                        </div>
                        <p className="text-sm text-gray-500">{photoItems.length} photos</p>
                    </div>

                    {photoItems.length === 0 ? (
                        <div className="rounded-2xl border border-green-200 bg-white p-8 text-center text-gray-700 shadow-sm">
                            No photos uploaded yet.
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                            {photoItems.map((item) => (
                                <article key={item._id} className="overflow-hidden rounded-3xl border border-green-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                                    <div className="h-64 bg-gray-100">
                                        <img src={item.mediaUrl} alt={item.title} className="h-full w-full object-cover" />
                                    </div>
                                    <div className="p-5">
                                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-green-700">{formatDate(item.publishedAt || item.createdAt)}</p>
                                        <h3 className="mt-2 text-xl font-bold text-gray-900">{item.title}</h3>
                                        <p className="mt-2 text-sm leading-6 text-gray-700">{item.caption || 'No caption added.'}</p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                <section>
                    <div className="mb-5 flex items-end justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-700">Video Section</p>
                            <h2 className="mt-2 text-2xl font-extrabold text-gray-900 md:text-3xl">Video Gallery</h2>
                        </div>
                        <p className="text-sm text-gray-500">{videoItems.length} videos</p>
                    </div>

                    {videoItems.length === 0 ? (
                        <div className="rounded-2xl border border-green-200 bg-white p-8 text-center text-gray-700 shadow-sm">
                            No videos uploaded yet.
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {videoItems.map((item) => (
                                <article key={item._id} className="overflow-hidden rounded-3xl border border-green-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                                    <div className="bg-black">
                                        <video src={item.mediaUrl} controls className="h-72 w-full object-cover" />
                                    </div>
                                    <div className="p-5">
                                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-green-700">{formatDate(item.publishedAt || item.createdAt)}</p>
                                        <h3 className="mt-2 text-xl font-bold text-gray-900">{item.title}</h3>
                                        <p className="mt-2 text-sm leading-6 text-gray-700">{item.caption || 'No caption added.'}</p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </section>

            <Footer />
        </main>
    );
}