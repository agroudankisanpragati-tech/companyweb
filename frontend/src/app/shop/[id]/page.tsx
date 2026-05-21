"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Listing = {
    _id: string;
    cropName: string;
    quantity: number;
    unit: string;
    pricePerUnit: number;
    image?: string;
    description?: string;
};

export default function ShopProfilePage({ params }: { params: { id: string } }) {
    const { id } = params;
    const [shop, setShop] = useState<any>(null);
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
        const url = apiBase ? `${apiBase}/api/shops/${id}` : `/api/shops/${id}`;

        const isLocalShopId = (val?: string) => !!val && val.startsWith('local-shop-');
        const readLocalShop = (sid: string) => {
            if (typeof window === 'undefined') return null;
            try {
                const raw = localStorage.getItem(`shopProfile_${sid}`);
                return raw ? JSON.parse(raw) : null;
            } catch {
                return null;
            }
        };
        const readLocalProducts = (sid: string) => {
            if (typeof window === 'undefined') return [] as Listing[];
            try {
                const raw = localStorage.getItem(`shopProducts_${sid}`);
                return raw ? (JSON.parse(raw) as Listing[]) : [];
            } catch {
                return [];
            }
        };

        const fetchData = async () => {
            setLoading(true);

            // If this is a local-only shop created client-side, read from localStorage
            if (isLocalShopId(id)) {
                const localShop = readLocalShop(id);
                const localListings = readLocalProducts(id);
                setShop(localShop);
                setListings(localListings || []);
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(url);
                if (!res.ok) {
                    // try local fallback if exists
                    const localShop = readLocalShop(id);
                    if (localShop) {
                        setShop(localShop);
                        setListings(readLocalProducts(id));
                        return;
                    }
                    throw new Error('Failed to fetch');
                }

                const data = await res.json();
                if (!data || !data.shop) {
                    const localShop = readLocalShop(id);
                    if (localShop) {
                        setShop(localShop);
                        setListings(readLocalProducts(id));
                        return;
                    }
                }

                setShop(data.shop);
                setListings(data.listings || []);
            } catch (err) {
                console.error(err);
                // final fallback to localStorage
                const localShop = readLocalShop(id);
                if (localShop) {
                    setShop(localShop);
                    setListings(readLocalProducts(id));
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) return <div className="p-6">Loading shop...</div>;
    if (!shop) return <div className="p-6">Shop not found.</div>;

    return (
        <main className="p-6 max-w-4xl mx-auto">
            <section className="mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                        {/* placeholder logo */}
                        <span className="text-xl font-bold text-green-700">S</span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-semibold">{shop.name || shop.name}</h1>
                        <p className="text-sm text-gray-600">{shop.location?.district}, {shop.location?.state}</p>
                        <p className="mt-1 text-sm">Phone: <a href={`tel:${shop.phone}`} className="text-green-600">{shop.phone}</a></p>
                        <div className="mt-2">
                            <button onClick={() => router.back()} className="px-3 py-1 bg-gray-100 rounded">Back</button>
                            <a className="ml-3 px-3 py-1 bg-green-600 text-white rounded" href={`tel:${shop.phone}`}>Contact</a>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-lg font-medium mb-3">Available Products</h2>
                {listings.length === 0 && <p className="text-sm text-gray-600">No products available right now.</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {listings.map((item) => (
                        <div key={item._id} className="border rounded p-3 flex gap-3 items-center">
                            <div className="w-20 h-20 bg-gray-50 rounded flex items-center justify-center">
                                {item.image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={item.image} alt={item.cropName} className="w-full h-full object-cover rounded" />
                                ) : (
                                    <div className="text-sm text-gray-500">No Image</div>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-semibold">{item.cropName}</h3>
                                    <div className="text-sm text-gray-700">₹{item.pricePerUnit} / {item.unit}</div>
                                </div>
                                <p className="text-sm text-gray-600">Qty: {item.quantity} {item.unit}</p>
                                <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
