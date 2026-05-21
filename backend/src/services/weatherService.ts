import axios from 'axios';

type CacheEntry = {
    ts: number;
    data: any;
};

const cache = new Map<string, CacheEntry>();
const TTL = 1000 * 60 * 10; // 10 minutes

const geoCache = new Map<string, CacheEntry>();

type LocationSuggestion = {
    name: string;
    displayName: string;
    lat: number;
    lon: number;
};

class LocationNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'LocationNotFoundError';
    }
}

function getMockWeatherData() {
    const now = Math.floor(Date.now() / 1000);
    return {
        current: {
            temp: 24 + Math.random() * 8,
            humidity: 60 + Math.random() * 20,
            wind_speed: 3 + Math.random() * 5,
            weather: {
                main: ['Sunny', 'Cloudy', 'Partly Cloudy', 'Clear'][Math.floor(Math.random() * 4)],
                description: 'pleasant weather',
                icon: '01d',
            },
        },
        daily: Array.from({ length: 7 }, (_, i) => ({
            dt: now + i * 86400,
            temp: {
                day: 25 + Math.random() * 8,
                min: 15 + Math.random() * 5,
                max: 30 + Math.random() * 5,
            },
            pop: Math.random() * 0.3,
            weather: {
                main: ['Clear', 'Clouds', 'Rain'][Math.floor(Math.random() * 3)],
                description: 'weather forecast',
                icon: ['01d', '02d', '09d'][Math.floor(Math.random() * 3)],
            },
        })),
        hourly: Array.from({ length: 24 }, (_, i) => ({
            dt: now + i * 3600,
            temp: 22 + Math.random() * 6,
            pop: Math.random() * 0.2,
            weather: {
                main: 'Clear',
                description: 'clear sky',
                icon: '01d',
            },
        })),
    };
}

async function fetchWeather(lat: string | number, lon: string | number) {
    const OPENWEATHER_KEY = process.env.OPENWEATHER_API_KEY;
    const BASE_URL = process.env.OPENWEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5';

    const key = `${lat},${lon}`;
    const now = Date.now();

    const existing = cache.get(key);
    if (existing && now - existing.ts < TTL) {
        return existing.data;
    }

    let normalized;

    try {
        if (!OPENWEATHER_KEY) throw new Error('OPENWEATHER_API_KEY is not set');

        const url = `${BASE_URL}/onecall`;
        const params = {
            lat,
            lon,
            units: 'metric',
            exclude: 'minutely,alerts',
            appid: OPENWEATHER_KEY,
        } as Record<string, any>;

        const resp = await axios.get(url, { params, timeout: 8000 });
        const payload = resp.data;

        normalized = {
            current: {
                temp: payload.current?.temp,
                humidity: payload.current?.humidity,
                wind_speed: payload.current?.wind_speed,
                weather: payload.current?.weather?.[0] || null,
            },
            hourly: (payload.hourly || []).slice(0, 24).map((h: any) => ({
                dt: h.dt,
                temp: h.temp,
                pop: h.pop,
                weather: h.weather?.[0] || null,
            })),
            daily: (payload.daily || []).slice(0, 7).map((d: any) => ({
                dt: d.dt,
                temp: d.temp,
                pop: d.pop,
                weather: d.weather?.[0] || null,
            })),
            raw: payload,
        };
    } catch (error: any) {
        const msg = error?.response?.status === 401
            ? 'Invalid OpenWeather API key (401)'
            : error?.message;
        console.warn('⚠️ OpenWeather API failed, using mock data:', msg);
        normalized = getMockWeatherData();
    }

    cache.set(key, { ts: now, data: normalized });
    return normalized;
}

async function searchLocations(query: string): Promise<LocationSuggestion[]> {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return [];

    const now = Date.now();
    const cacheKey = `geo:${normalizedQuery}`;
    const cached = geoCache.get(cacheKey);
    if (cached && now - cached.ts < TTL) {
        return cached.data;
    }

    const toSuggestion = (item: any): LocationSuggestion => {
        const rawDisplay = item.display_name || item.name || query;
        const parts = String(rawDisplay).split(',').map((p: string) => p.trim());
        const shortName = parts[0] || item.name || query;
        return {
            name: shortName,
            displayName: rawDisplay,
            lat: Number(item.lat),
            lon: Number(item.lon),
        };
    };

    const unique = new Map<string, LocationSuggestion>();

    const addList = (items: any[]) => {
        for (const item of items || []) {
            const s = toSuggestion(item);
            if (!Number.isFinite(s.lat) || !Number.isFinite(s.lon)) continue;
            const k = `${s.lat.toFixed(4)},${s.lon.toFixed(4)}`;
            if (!unique.has(k)) unique.set(k, s);
        }
    };

    // 1) Nominatim strict India query
    try {
        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: {
                q: `${query}, India`,
                format: 'jsonv2',
                addressdetails: 1,
                limit: 8,
                countrycodes: 'in',
            },
            headers: {
                'User-Agent': 'kisan-unnati-weather/1.0',
            },
            timeout: 8000,
        });
        addList(response.data || []);
    } catch {
        // Keep going with fallback providers.
    }

    // 2) Nominatim relaxed query (helps with tiny villages/spellings)
    if (unique.size < 5) {
        try {
            const response = await axios.get('https://nominatim.openstreetmap.org/search', {
                params: {
                    q: query,
                    format: 'jsonv2',
                    addressdetails: 1,
                    limit: 8,
                    countrycodes: 'in',
                },
                headers: {
                    'User-Agent': 'kisan-unnati-weather/1.0',
                },
                timeout: 8000,
            });
            addList(response.data || []);
        } catch {
            // Ignore and continue.
        }
    }

    // 3) Open-Meteo geocoding fallback (free and fast)
    if (unique.size < 5) {
        try {
            const response = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
                params: {
                    name: query,
                    count: 8,
                    language: 'en',
                    countryCode: 'IN',
                },
                timeout: 8000,
            });

            const mapped = (response.data?.results || []).map((item: any) => ({
                name: item.name,
                display_name: `${item.name}${item.admin1 ? `, ${item.admin1}` : ''}, India`,
                lat: item.latitude,
                lon: item.longitude,
            }));
            addList(mapped);
        } catch {
            // Ignore if fallback also fails.
        }
    }

    const suggestions = Array.from(unique.values()).slice(0, 8);

    geoCache.set(cacheKey, { ts: now, data: suggestions });
    return suggestions;
}

async function fetchWeatherByLocationQuery(query: string) {
    const suggestions = await searchLocations(query);
    if (!suggestions.length) {
        throw new LocationNotFoundError('No matching location found in India');
    }

    const top = suggestions[0];
    const weather = await fetchWeather(top.lat, top.lon);

    return {
        location: top,
        data: weather,
    };
}

export default { fetchWeather, searchLocations, fetchWeatherByLocationQuery, LocationNotFoundError };

