"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Shop = {
    _id?: string;
    id?: string;
    name: string;
    description?: string;
    location?: { state?: string; district?: string } | string;
    images?: string[];
    phone?: string;
    verified?: boolean;
};

export default function ShopSearch({ limit }: { limit?: number }) {
    const [shops, setShops] = useState<Shop[]>([]);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
        const url = apiBase ? `${apiBase}/api/shops${limit ? `?limit=${limit}` : ''}` : `/api/shops${limit ? `?limit=${limit}` : ''}`;
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                if (!mounted) return;
                // if API returns { data } or an array directly, normalize
                const list = Array.isArray(data) ? data : data?.data || [];
                console.debug('[ShopSearch] fetched', url, '->', list.length, 'items');
                // if no items from API, try localStorage fallback (for local shop profiles)
                if ((!list || list.length === 0) && typeof window !== 'undefined') {
                    try {
                        const localShops: Shop[] = [];
                        for (const key of Object.keys(localStorage)) {
                            if (key.startsWith('shopProfile_')) {
                                const raw = localStorage.getItem(key);
                                if (!raw) continue;
                                const parsed = JSON.parse(raw);
                                localShops.push({
                                    _id: parsed._id,
                                    name: parsed.name,
                                    description: parsed.description,
                                    location: parsed.location,
                                    images: parsed.images || [],
                                    phone: parsed.phone || undefined,
                                    verified: false,
                                });
                            }
                        }

                        const finalList = localShops.concat(list);
                        setShops(finalList);
                        return;
                    } catch (err) {
                        console.warn('[ShopSearch] local fallback parse error', err);
                    }
                }

                setShops(list);
            })
            .catch((err) => {
                console.error('[ShopSearch] fetch error', err);
                // try local fallback
                if (typeof window !== 'undefined') {
                    const localShops: Shop[] = [];
                    for (const key of Object.keys(localStorage)) {
                        if (key.startsWith('shopProfile_')) {
                            const raw = localStorage.getItem(key);
                            if (!raw) continue;
                            try {
                                const parsed = JSON.parse(raw);
                                localShops.push({
                                    _id: parsed._id,
                                    name: parsed.name,
                                    description: parsed.description,
                                    location: parsed.location,
                                    images: parsed.images || [],
                                    phone: parsed.phone || undefined,
                                    verified: false,
                                });
                            } catch { }
                        }
                    }
                    setShops(localShops);
                } else {
                    setShops([]);
                }
            })
            .finally(() => mounted && setLoading(false));

        return () => {
            mounted = false;
        };
    }, [limit]);

    const filtered = shops.filter((s) => {
        const loc = typeof s.location === 'string' ? s.location : `${(s.location && (s.location.district || ''))} ${(s.location && (s.location.state || ''))}`;
        return `${s.name} ${loc || ''} ${s.description || ''}`.toLowerCase().includes(query.toLowerCase());
    });

    return (
        <div>
            {/* Search Input (show only when no limit provided) */}
            {!limit && (
                <div className="mb-4">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search shops by name or location..."
                        className="w-full md:w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                    />
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(loading ? new Array(limit || 6).fill(null) : (limit ? shops : filtered)).map((shop, idx) => {
                    if (loading) {
                        return (
                            <div key={idx} className="p-4 bg-white rounded-lg shadow animate-pulse">
                                <div className="h-40 bg-gray-200 rounded-md mb-3" />
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                                <div className="h-3 bg-gray-200 rounded w-1/2" />
                            </div>
                        );
                    }

                    const s = shop as Shop;
                    const loc = typeof s.location === 'string' ? s.location : `${s.location?.district || ''}${s.location?.district && s.location?.state ? ', ' : ''}${s.location?.state || ''}`;
                    const image = s.images && s.images.length ? s.images[0] : undefined;

                    return (
                        <div key={s._id || s.id || idx} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
                            <div className="relative h-44 bg-green-50">
                                {image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={image} alt={s.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-2xl text-green-700 font-bold">{s.name?.charAt(0)}</div>
                                )}
                                {s.verified && (
                                    <div className="absolute top-3 right-3 bg-white/80 text-green-700 px-2 py-1 rounded-full text-sm font-semibold">Verified</div>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-semibold">{s.name}</h3>
                                {loc && <p className="text-sm text-gray-500">{loc}</p>}
                                {s.description && <p className="text-sm text-gray-700 mt-2 line-clamp-3">{s.description}</p>}

                                <div className="mt-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Link href={`/shop/${s._id || s.id}`} className="px-3 py-2 bg-green-600 text-white rounded-md text-sm font-medium">View</Link>
                                        {s.phone && (
                                            <a href={`tel:${s.phone}`} className="px-3 py-2 border rounded-md text-sm text-gray-700">Call</a>
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-500">{s.verified ? 'Trusted vendor' : 'Unverified'}</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {!loading && shops.length === 0 && (
                <p className="text-sm text-gray-500 mt-6">No shops found in the database.</p>
            )}
        </div>
    );
}
