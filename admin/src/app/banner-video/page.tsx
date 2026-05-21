"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { FaChevronLeft, FaUpload } from 'react-icons/fa';
import { useAdmin } from '@/components/admin/AdminProvider';
import { ASSET_BASE, loadGalleryItems, uploadGalleryItem } from '@/components/admin/admin-api';
import type { GalleryItem } from '@/components/admin/admin-types';
import { TableShell } from '@/components/admin/AdminUi';

export default function BannerVideoPage() {
  const { token } = useAdmin();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) return;

    void (async () => {
      try {
        const response = await loadGalleryItems(token);
        setItems(response.data);
      } catch {
        setItems([]);
      }
    })();
  }, [token]);

  const currentBanner = useMemo(
    () => items.find((item) => item.mediaType === 'video' && item.featured) || items.find((item) => item.mediaType === 'video'),
    [items]
  );

  const handleUpload = async () => {
    if (!token || !selectedFile) {
      setMessage('Select a video first.');
      return;
    }

    setBusy(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('mediaType', 'video');
      formData.append('title', 'Banner Video');
      formData.append('status', 'published');
      formData.append('featured', 'true');

      await uploadGalleryItem(token, formData);

      const response = await loadGalleryItems(token);
      setItems(response.data);
      setSelectedFile(null);
      setMessage('Video uploaded successfully.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Upload failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white">
          <FaChevronLeft /> Back to Dashboard
        </Link>
      </div>

      <TableShell title="Banner Video" subtitle="Upload and manage the site banner video">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="glass-panel rounded-2xl p-6">
            <h4 className="mb-3 text-lg font-semibold text-white">Current Banner</h4>
            {currentBanner ? (
              <video
                className="w-full rounded-xl border border-white/10 bg-black"
                controls
                src={currentBanner.mediaUrl.startsWith('http') ? currentBanner.mediaUrl : `${ASSET_BASE}${currentBanner.mediaUrl}`}
              />
            ) : (
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">No banner video configured</div>
            )}
          </div>

          <div className="glass-panel rounded-2xl p-6">
            <h4 className="mb-3 text-lg font-semibold text-white">Upload Video</h4>

            <label className="admin-button-secondary inline-flex cursor-pointer items-center gap-2">
              <FaUpload />
              <span>{selectedFile ? selectedFile.name : 'Choose Video'}</span>
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
              />
            </label>

            <div className="mt-4 flex gap-2">
              <button className="admin-button-primary" type="button" onClick={handleUpload} disabled={busy || !selectedFile}>
                {busy ? 'Uploading...' : 'Upload Video'}
              </button>
            </div>

            {message ? <div className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">{message}</div> : null}
          </div>
        </div>
      </TableShell>
    </div>
  );
}
