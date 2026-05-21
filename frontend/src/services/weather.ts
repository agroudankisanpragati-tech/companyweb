async function parseJsonSafe(res: Response) {
    try {
        return await res.json();
    } catch {
        return null;
    }
}

export async function fetchWeather(lat: number | string, lon: number | string) {
    const base = process.env.NEXT_PUBLIC_API_URL || '';
    const url = `${base}/weather?latitude=${lat}&longitude=${lon}`;
    const res = await fetch(url);
    const payload = await parseJsonSafe(res);
    if (!res.ok) throw new Error(payload?.error || 'Failed to fetch weather');
    return payload;
}

export async function searchLocations(query: string) {
    const base = process.env.NEXT_PUBLIC_API_URL || '';
    const url = `${base}/weather/search?query=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    const payload = await parseJsonSafe(res);
    if (!res.ok) throw new Error(payload?.error || 'Failed to search locations');
    return payload;
}

export async function fetchWeatherByLocation(location: string) {
    const base = process.env.NEXT_PUBLIC_API_URL || '';
    const url = `${base}/weather?location=${encodeURIComponent(location)}`;
    const res = await fetch(url);
    const payload = await parseJsonSafe(res);
    if (!res.ok) throw new Error(payload?.error || 'Failed to fetch weather by location');
    return payload;
}
