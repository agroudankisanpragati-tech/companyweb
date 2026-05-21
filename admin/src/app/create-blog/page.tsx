'use client';

import { FormEvent, useState } from 'react';
import { requestFormData, requestJson } from '@/components/admin/admin-api';
import { useAdmin } from '@/components/admin/AdminProvider';
import TipTapEditor from '@/components/admin/TipTapEditor';

export default function CreateBlogPage() {
    const { token } = useAdmin();
    const [title, setTitle] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [tags, setTags] = useState('');
    const [status, setStatus] = useState<'draft' | 'published'>('published');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!token) {
            setError('Admin token missing. Please re-login.');
            return;
        }

        setSubmitting(true);
        setError('');
        setMessage('');

        if (!coverFile) {
            setError('Header image file is required');
            setSubmitting(false);
            return;
        }

        const uploadFormData = new FormData();
        uploadFormData.append('file', coverFile);

        let coverImage = '';

        try {
            const uploadResponse = await requestFormData<{ success: boolean; data: { coverImage: string } }>('/blogs/admin/upload-cover', token, uploadFormData);
            coverImage = uploadResponse.data.coverImage;
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : 'Failed to upload header image');
            setSubmitting(false);
            return;
        }

        const blogData = {
            title,
            excerpt,
            content,
            coverImage,
            tags: tags
                .split(',')
                .map((tag) => tag.trim())
                .filter(Boolean),
            status,
        };

        try {
            await requestJson('/blogs/admin', token, {
                method: 'POST',
                body: JSON.stringify(blogData),
            });

            setMessage(status === 'published' ? 'Blog post published successfully.' : 'Blog draft saved successfully.');

            setTitle('');
            setExcerpt('');
            setContent('');
            setCoverFile(null);
            setTags('');
            setStatus('published');
            event.currentTarget.reset();
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : 'Failed to save blog post');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="relative min-h-[calc(100vh-8rem)] overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 p-4 md:p-6 lg:p-8">
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute left-[-8%] top-[-10%] h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl" />
                <div className="absolute right-[-12%] top-16 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-3xl" />
                <div className="absolute bottom-[-14%] left-1/4 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
            </div>

            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
                {message ? <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">{message}</div> : null}
                {error ? <div className="rounded-3xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</div> : null}

                <form onSubmit={handleSubmit} className="create-blog-form glass-panel rounded-[2rem] border border-white/10 p-6 md:p-8 lg:p-10">
                    <div className="grid gap-5">
                        <label className="space-y-2 text-sm text-slate-300">
                            <span className="text-slate-200">Title</span>
                            <input className="admin-input w-full" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Enter blog title" required />
                        </label>

                        <label className="space-y-2 text-sm text-slate-300">
                            <span className="text-slate-200">Description</span>
                            <input className="admin-input w-full" value={excerpt} onChange={(event) => setExcerpt(event.target.value)} placeholder="Short description for the blog" required />
                        </label>

                        <label className="space-y-2 text-sm text-slate-300">
                            <span className="text-slate-200">Header image</span>
                            <input className="admin-input w-full" type="file" accept="image/*" onChange={(event) => setCoverFile(event.target.files?.[0] || null)} required />
                            <p className="text-xs text-slate-400">Upload a header image from your device.</p>
                        </label>

                        <label className="space-y-2 text-sm text-slate-300">
                            <span className="text-slate-200">Tags</span>
                            <input className="admin-input w-full" value={tags} onChange={(event) => setTags(event.target.value)} placeholder="farming, news, weather" />
                        </label>

                        <div className="space-y-2 text-sm text-slate-300">
                            <span className="text-slate-200">Main content</span>
                            <TipTapEditor value={content} onChange={setContent} placeholder="Write the blog content here..." />
                        </div>

                        <div className="flex flex-col gap-4 border-t border-white/10 pt-5 lg:flex-row lg:items-center lg:justify-between">
                            <label className="space-y-2 text-sm text-slate-300">
                                <span className="text-slate-200">Status</span>
                                <select className="admin-input w-full lg:w-64" value={status} onChange={(event) => setStatus(event.target.value as 'draft' | 'published')}>
                                    <option value="published">Publish now</option>
                                    <option value="draft">Save as draft</option>
                                </select>
                            </label>

                            <button type="submit" disabled={submitting} className="admin-button-primary inline-flex w-full items-center justify-center px-6 py-3 disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto">
                                {submitting ? 'Saving...' : 'Submit blog'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
