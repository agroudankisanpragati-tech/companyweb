export type GalleryMediaType = 'photo' | 'video';

export type GalleryItem = {
    _id: string;
    title: string;
    caption?: string;
    mediaType: GalleryMediaType;
    mediaUrl: string;
    fileName: string;
    mimeType: string;
    featured?: boolean;
    status: 'draft' | 'published';
    publishedAt?: string;
    createdAt?: string;
    updatedAt?: string;
};

const API_ROOT = process.env.NEXT_PUBLIC_API_URL || 'https://api.agroudankisanpragati.com/api';
// Some uploads are served from the server root `/uploads` (not under `/api`).
// Derive the API origin by stripping a trailing `/api` segment when present.
const API_ORIGIN = API_ROOT.replace(/\/api\/?$/i, '');

async function parseJsonSafe(response: Response) {
    try {
        return await response.json();
    } catch {
        return null;
    }
}

const resolveMediaUrl = (value: string) => {
    if (value.startsWith('http')) return value;
    // If the media path already starts with /uploads, serve from the origin (no /api prefix).
    if (value.startsWith('/uploads')) return `${API_ORIGIN}${value}`;
    return `${API_ROOT}${value}`;
};

export async function fetchPublishedGallery() {
    const response = await fetch(`${API_ROOT}/gallery`, { next: { revalidate: 60 } });
    const payload = await parseJsonSafe(response);

    if (!response.ok) {
        throw new Error(payload?.error || 'Failed to fetch gallery items');
    }

    return ((payload?.data || []) as GalleryItem[]).map((item) => ({
        ...item,
        mediaUrl: resolveMediaUrl(item.mediaUrl),
    }));
}