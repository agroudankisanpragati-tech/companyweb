'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { ASSET_BASE, deleteGalleryItem, loadGalleryItems, uploadGalleryItem } from '@/components/admin/admin-api';
import { useAdmin } from '@/components/admin/AdminProvider';
import type { GalleryItem } from '@/components/admin/admin-types';

const resolveMediaUrl = (value: string) => (value.startsWith('http') ? value : `${ASSET_BASE}${value}`);

function UploadPanel({
    mediaType,
    title,
    subtitle,
    accept,
    items,
    onUpload,
    uploading,
}: {
    mediaType: 'photo' | 'video';
    title: string;
    subtitle: string;
    accept: string;
    items: GalleryItem[];
    uploading: boolean;
    onUpload: (formData: FormData) => Promise<void>;
}) {
    const [itemTitle, setItemTitle] = useState('');
    const [caption, setCaption] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<'draft' | 'published'>('published');
    const [error, setError] = useState('');

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');

        if (!file) {
            setError('Please choose a file to upload');
            return;
        }

        const formData = new FormData();
        formData.append('title', itemTitle);
        formData.append('caption', caption);
        formData.append('mediaType', mediaType);
        formData.append('status', status);
        formData.append('file', file);

        try {
            await onUpload(formData);
            setItemTitle('');
            setCaption('');
            setFile(null);
            setStatus('published');
            (event.target as HTMLFormElement).reset();
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : `Failed to upload ${mediaType}`);
        }
    };

    return (
        <section className="glass-panel rounded-3xl p-6 space-y-5">
            <div>
                <p className="admin-chip mb-3">{mediaType === 'photo' ? 'Photo Section' : 'Video Section'}</p>
                <h3 className="text-2xl font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
            </div>

            {error ? <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</div> : null}

            <form onSubmit={submit} className="space-y-4">
                <label className="block space-y-2 text-sm text-slate-300">
                    <span>Title</span>
                    <input className="admin-input w-full" value={itemTitle} onChange={(event) => setItemTitle(event.target.value)} placeholder={`Enter ${mediaType} title`} required />
                </label>

                <label className="block space-y-2 text-sm text-slate-300">
                    <span>Caption</span>
                    <input className="admin-input w-full" value={caption} onChange={(event) => setCaption(event.target.value)} placeholder={`Short ${mediaType} caption`} />
                </label>

                <label className="block space-y-2 text-sm text-slate-300">
                    <span>File</span>
                    <input className="admin-input w-full" type="file" accept={accept} onChange={(event) => setFile(event.target.files?.[0] || null)} required />
                </label>

                

                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <label className="space-y-2 text-sm text-slate-300">
                        <span>Status</span>
                        <select className="admin-input" value={status} onChange={(event) => setStatus(event.target.value as 'draft' | 'published')}>
                            <option value="published">Publish now</option>
                            <option value="draft">Save as draft</option>
                        </select>
                    </label>

                    <button type="submit" disabled={uploading} className="admin-button-primary inline-flex items-center justify-center px-6 py-3 disabled:cursor-not-allowed disabled:opacity-60">
                        {uploading ? 'Uploading...' : `Upload ${mediaType === 'photo' ? 'Photo' : 'Video'}`}
                    </button>
                </div>
            </form>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((item) => (
                    <article key={item._id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="mb-3 overflow-hidden rounded-xl bg-slate-900">
                            {mediaType === 'photo' ? (
                                <img src={resolveMediaUrl(item.mediaUrl)} alt={item.title} className="h-44 w-full object-cover" />
                            ) : (
                                <video src={resolveMediaUrl(item.mediaUrl)} controls className="h-44 w-full object-cover" />
                            )}
                        </div>

                        <p className="mt-1 line-clamp-2 text-sm text-slate-400">{item.caption || 'No caption added.'}</p>
                        <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-500">
                            <span>{item.status}</span>
                            <span>{item.fileName}</span>
                        </div>
                        {/* video-specific banner controls moved to separate Banner admin page */}
                    </article>
                ))}
            </div>
        </section>
    );
}

export default function CreateGalleryPage() {
    const { token } = useAdmin();
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [uploadingVideo, setUploadingVideo] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const photoItems = useMemo(() => items.filter((item) => item.mediaType === 'photo'), [items]);
    const videoItems = useMemo(() => items.filter((item) => item.mediaType === 'video'), [items]);

    const loadItems = async () => {
        if (!token) return;

        setLoading(true);
        try {
            const response = await loadGalleryItems(token);
            setItems(response.data);
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : 'Unable to load gallery items');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadItems();
    }, [token]);

    const handleUpload = async (formData: FormData) => {
        if (!token) {
            throw new Error('Admin token missing. Please re-login.');
        }

        const mediaType = String(formData.get('mediaType') || 'photo');

        if (mediaType === 'photo') {
            setUploadingPhoto(true);
        } else {
            setUploadingVideo(true);
        }

        setError('');
        setMessage('');

        try {
            await uploadGalleryItem(token, formData);
            setMessage(`${mediaType === 'photo' ? 'Photo' : 'Video'} uploaded successfully.`);
            await loadItems();
        } finally {
            setUploadingPhoto(false);
            setUploadingVideo(false);
        }
    };

    const handleDelete = async (itemId: string) => {
        if (!token || !window.confirm('Delete this gallery item permanently?')) return;

        try {
            await deleteGalleryItem(token, itemId);
            setMessage('Gallery item deleted successfully.');
            await loadItems();
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : 'Failed to delete gallery item');
        }
    };

    return (
        <div className="space-y-6">
            <div className="glass-panel rounded-3xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Gallery Manager</h2>
                        <p className="mt-2 text-sm text-slate-400">Upload photos and videos from admin, and show them on the public gallery page.</p>
                    </div>
                    <a href="/banner" className="admin-button-secondary">Manage Banner</a>
                </div>
            </div>

            {message ? <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">{message}</div> : null}
            {error ? <div className="rounded-3xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</div> : null}

            <div className="grid gap-6 xl:grid-cols-2">
                <UploadPanel
                    mediaType="photo"
                    title="Upload Photos"
                    subtitle="Photo files appear in the photo section on the frontend gallery page."
                    accept="image/*"
                    items={photoItems}
                    uploading={uploadingPhoto}
                    onUpload={handleUpload}
                />

                <UploadPanel
                    mediaType="video"
                    title="Upload Videos"
                    subtitle="Video files appear separately in the video section on the same frontend page."
                    accept="video/*"
                    items={videoItems}
                    uploading={uploadingVideo}
                    onUpload={handleUpload}
                />
            </div>

            <section className="glass-panel rounded-3xl p-6">
                <div className="mb-4 flex items-center justify-between gap-4">
                    <div>
                        <h3 className="text-xl font-bold text-white">All Gallery Items</h3>
                        <p className="mt-1 text-sm text-slate-400">Manage all uploaded media from one place.</p>
                    </div>
                    <button type="button" onClick={loadItems} className="admin-button-secondary">
                        Refresh
                    </button>
                </div>

                {loading ? <p className="text-sm text-slate-400">Loading gallery...</p> : null}
                {!loading && items.length === 0 ? <p className="text-sm text-slate-400">No gallery items uploaded yet.</p> : null}

                <div className="grid gap-4 md:grid-cols-2">
                    {items.map((item) => (
                        <article key={item._id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h4 className="text-lg font-semibold text-white">{item.title}</h4>
                                    <p className="mt-1 text-sm text-slate-400">{item.mediaType} • {item.status}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(item._id)}
                                    className="rounded-lg border border-red-500/30 bg-red-500/20 px-3 py-2 text-xs font-semibold text-red-200 transition-colors hover:bg-red-500/30"
                                >
                                    Delete
                                </button>
                            </div>
                            <p className="mt-3 text-sm text-slate-300">{item.caption || 'No caption added.'}</p>
                            <p className="mt-3 text-xs text-slate-500">{item.fileName}</p>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    );
}