'use client';

import { FormEvent, useEffect, useState } from 'react';
import { requestJson, formatDate, updateGovtScheme, deleteGovtScheme } from '@/components/admin/admin-api';
import { useAdmin } from '@/components/admin/AdminProvider';
import type { GovtScheme } from '@/components/admin/admin-types';

export default function CreateSchemePage() {
    const { token } = useAdmin();
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [description, setDescription] = useState('');
    const [department, setDepartment] = useState('');
    const [audience, setAudience] = useState('');
    const [benefits, setBenefits] = useState('');
    const [applicationLink, setApplicationLink] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [tags, setTags] = useState('');
    const [status, setStatus] = useState<'draft' | 'published'>('published');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [loadingSchemes, setLoadingSchemes] = useState(false);
    const [schemes, setSchemes] = useState<GovtScheme[]>([]);
    const [editingSchemeId, setEditingSchemeId] = useState<string | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<{ schemeId: string; title: string } | null>(null);

    const loadSchemes = async () => {
        if (!token) return;

        setLoadingSchemes(true);
        try {
            const response = await requestJson<{ success: boolean; data: GovtScheme[] }>('/schemes/admin/all', token);
            setSchemes(response.data);
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : 'Unable to load government schemes');
        } finally {
            setLoadingSchemes(false);
        }
    };

    useEffect(() => {
        void loadSchemes();
    }, [token]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!token) {
            setError('Admin token missing. Please re-login.');
            return;
        }

        setSubmitting(true);
        setError('');
        setMessage('');

        const schemeData = {
            title,
            summary,
            description,
            department,
            audience,
            benefits: benefits.split(',').map((item) => item.trim()).filter(Boolean),
            applicationLink,
            coverImage,
            tags: tags.split(',').map((item) => item.trim()).filter(Boolean),
            status,
        };

        try {
            if (editingSchemeId) {
                await updateGovtScheme(token, editingSchemeId, schemeData);
                setMessage('Government scheme updated successfully.');
            } else {
                await requestJson('/schemes/admin', token, {
                    method: 'POST',
                    body: JSON.stringify(schemeData),
                });
                setMessage(status === 'published' ? 'Government scheme published successfully.' : 'Government scheme draft saved successfully.');
            }

            setTitle('');
            setSummary('');
            setDescription('');
            setDepartment('');
            setAudience('');
            setBenefits('');
            setApplicationLink('');
            setCoverImage('');
            setTags('');
            setStatus('published');
            setEditingSchemeId(null);
            await loadSchemes();
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : 'Failed to save government scheme');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (scheme: GovtScheme) => {
        setTitle(scheme.title);
        setSummary(scheme.summary);
        setDescription(scheme.description);
        setDepartment(scheme.department);
        setAudience(scheme.audience);
        setBenefits(scheme.benefits.join(', '));
        setApplicationLink(scheme.applicationLink || '');
        setCoverImage(scheme.coverImage || '');
        setTags(scheme.tags.join(', '));
        setStatus(scheme.status);
        setEditingSchemeId(scheme._id);
        setMessage('');
        setError('');

        setTimeout(() => {
            document.querySelector('.create-scheme-form')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleDelete = async (schemeId: string) => {
        if (!token) {
            setError('Admin token missing. Please re-login.');
            return;
        }

        try {
            await deleteGovtScheme(token, schemeId);
            setMessage('Government scheme deleted successfully.');
            setDeleteConfirm(null);
            await loadSchemes();
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : 'Failed to delete government scheme');
        }
    };

    const handleCancel = () => {
        setTitle('');
        setSummary('');
        setDescription('');
        setDepartment('');
        setAudience('');
        setBenefits('');
        setApplicationLink('');
        setCoverImage('');
        setTags('');
        setStatus('published');
        setEditingSchemeId(null);
        setMessage('');
        setError('');
    };

    return (
        <div className="space-y-6">
            <div className="glass-panel rounded-3xl p-6">
                <h2 className="text-2xl font-bold text-white">{editingSchemeId ? 'Edit Government Scheme' : 'Create Government Scheme'}</h2>
                <p className="mt-2 text-sm text-slate-400">Add welfare schemes, subsidies, and support programs so they appear on the public website.</p>
            </div>

            {message ? <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">{message}</div> : null}
            {error ? <div className="rounded-3xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</div> : null}

            <form onSubmit={handleSubmit} className="create-scheme-form glass-panel rounded-3xl p-6 space-y-5">
                <div className="grid gap-4 lg:grid-cols-2">
                    <label className="space-y-2 text-sm text-slate-300">
                        <span>Scheme title</span>
                        <input className="admin-input w-full" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Enter scheme title" required />
                    </label>

                    <label className="space-y-2 text-sm text-slate-300">
                        <span>Department</span>
                        <input className="admin-input w-full" value={department} onChange={(event) => setDepartment(event.target.value)} placeholder="Ministry of Agriculture" required />
                    </label>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <label className="space-y-2 text-sm text-slate-300">
                        <span>Summary</span>
                        <input className="admin-input w-full" value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Short scheme summary" required />
                    </label>

                    <label className="space-y-2 text-sm text-slate-300">
                        <span>Target audience</span>
                        <input className="admin-input w-full" value={audience} onChange={(event) => setAudience(event.target.value)} placeholder="Small farmers, women SHGs, FPOs" required />
                    </label>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <label className="space-y-2 text-sm text-slate-300">
                        <span>Benefits (comma separated)</span>
                        <input className="admin-input w-full" value={benefits} onChange={(event) => setBenefits(event.target.value)} placeholder="Subsidy, training, loan support" />
                    </label>

                    <label className="space-y-2 text-sm text-slate-300">
                        <span>Application link</span>
                        <input className="admin-input w-full" value={applicationLink} onChange={(event) => setApplicationLink(event.target.value)} placeholder="https://..." />
                    </label>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <label className="space-y-2 text-sm text-slate-300">
                        <span>Cover image URL</span>
                        <input className="admin-input w-full" value={coverImage} onChange={(event) => setCoverImage(event.target.value)} placeholder="https://example.com/scheme.jpg" />
                    </label>

                    <label className="space-y-2 text-sm text-slate-300">
                        <span>Tags (comma separated)</span>
                        <input className="admin-input w-full" value={tags} onChange={(event) => setTags(event.target.value)} placeholder="subsidy, loan, welfare" />
                    </label>
                </div>

                <label className="space-y-2 text-sm text-slate-300">
                    <span>Detailed description</span>
                    <textarea className="admin-input min-h-[220px] w-full resize-none" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Explain eligibility, documents, and how to apply..." required />
                </label>

                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <label className="space-y-2 text-sm text-slate-300">
                        <span>Status</span>
                        <select className="admin-input" value={status} onChange={(event) => setStatus(event.target.value as 'draft' | 'published')}>
                            <option value="published">Publish now</option>
                            <option value="draft">Save as draft</option>
                        </select>
                    </label>

                    <div className="flex gap-3">
                        {editingSchemeId ? (
                            <button type="button" onClick={handleCancel} className="admin-button-secondary inline-flex items-center justify-center px-6 py-3">Cancel</button>
                        ) : null}
                        <button type="submit" disabled={submitting} className="admin-button-primary inline-flex items-center justify-center px-6 py-3 disabled:cursor-not-allowed disabled:opacity-60">
                            {submitting ? 'Saving...' : editingSchemeId ? 'Update Scheme' : status === 'published' ? 'Publish Scheme' : 'Save Draft'}
                        </button>
                    </div>
                </div>
            </form>

            <section className="glass-panel rounded-3xl p-6">
                <div className="mb-4 flex items-center justify-between gap-4">
                    <div>
                        <h3 className="text-xl font-bold text-white">Recent Government Schemes</h3>
                        <p className="mt-1 text-sm text-slate-400">All draft and published schemes created from admin.</p>
                    </div>
                    <button type="button" onClick={loadSchemes} className="admin-button-secondary">Refresh</button>
                </div>

                {loadingSchemes ? <p className="text-sm text-slate-400">Loading schemes...</p> : null}
                {!loadingSchemes && schemes.length === 0 ? <p className="text-sm text-slate-400">No government schemes yet.</p> : null}

                <div className="grid gap-4 md:grid-cols-2">
                    {schemes.map((scheme) => (
                        <article key={scheme._id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                    <h4 className="text-lg font-semibold text-white">{scheme.title}</h4>
                                    <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${scheme.status === 'published' ? 'bg-emerald-400/20 text-emerald-200' : 'bg-amber-400/20 text-amber-200'}`}>
                                        {scheme.status}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button type="button" onClick={() => handleEdit(scheme)} className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-blue-400" title="Edit scheme">✏️</button>
                                    <button type="button" onClick={() => setDeleteConfirm({ schemeId: scheme._id, title: scheme.title })} className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-red-400" title="Delete scheme">🗑️</button>
                                </div>
                            </div>

                            <p className="mt-3 line-clamp-3 text-sm text-slate-300">{scheme.summary}</p>
                            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                                <span>Slug: /schemes/{scheme.slug}</span>
                                <span>•</span>
                                <span>Department: {scheme.department}</span>
                                <span>•</span>
                                <span>Updated: {formatDate(scheme.updatedAt)}</span>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {deleteConfirm ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6">
                        <h3 className="text-lg font-bold text-white">Delete Government Scheme?</h3>
                        <p className="mt-3 text-sm text-slate-300">Are you sure you want to delete <strong>"{deleteConfirm.title}"</strong>? This action cannot be undone.</p>
                        <div className="mt-6 flex gap-3">
                            <button type="button" onClick={() => setDeleteConfirm(null)} className="admin-button-secondary flex-1 rounded-lg px-4 py-2">Cancel</button>
                            <button type="button" onClick={() => handleDelete(deleteConfirm.schemeId)} className="flex-1 rounded-lg border border-red-500/30 bg-red-500/20 px-4 py-2 text-red-200 transition-colors hover:bg-red-500/30">Delete</button>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}