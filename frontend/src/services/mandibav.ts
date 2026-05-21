import axios from 'axios';

export interface MandiPrice {
    commodity: string;
    market: string;
    state: string;
    minPrice?: number;
    maxPrice?: number;
    modalPrice?: number;
    date: string;
}

// Decide whether to call backend proxy or external API directly.
// By default use backend proxy at /api/mandi/prices to avoid CORS and to allow server-side API keys.
const useBackendProxy = process.env.NEXT_PUBLIC_USE_BACKEND_PROXY !== 'false';

const externalBase = process.env.NEXT_PUBLIC_MANDI_API_URL; // optional external provider

const backendApi = axios.create({ baseURL: '/api/mandi', headers: { 'Content-Type': 'application/json' } });
const externalApi = axios.create({ baseURL: externalBase, headers: { 'Content-Type': 'application/json' } });

export const mandiApi = {
    getPrices: async (params: { commodity?: string; state?: string; market?: string; date?: string }) => {
        if (useBackendProxy) {
            const response = await backendApi.get<{ success: boolean; data: MandiPrice[] }>('/prices', { params });
            return response.data;
        }

        if (!externalBase) {
            throw new Error('No external mandi API configured. Set NEXT_PUBLIC_MANDI_API_URL or enable backend proxy.');
        }

        const response = await externalApi.get<{ success: boolean; data: MandiPrice[] }>('/prices', { params });
        return response.data;
    },

    getPriceById: async (id: string) => {
        if (useBackendProxy) {
            const response = await backendApi.get<{ success: boolean; data: MandiPrice }>(`/prices/${id}`);
            return response.data;
        }

        if (!externalBase) throw new Error('No external mandi API configured.');

        const response = await externalApi.get<{ success: boolean; data: MandiPrice }>(`/prices/${id}`);
        return response.data;
    },
};

export default mandiApi;
