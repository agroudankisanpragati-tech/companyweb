import express from 'express';
import axios from 'axios';

const router = express.Router();

const looksLikeDataGovLandingPage = (url: string) =>
    /data\.gov\.in\/resource\/[^?]+/i.test(url) && !/api\.data\.gov\.in/i.test(url);

const normalizeBaseUrl = (url: string) => url.replace(/#.*$/, '');

// Proxy endpoint to call configured external mandi API.
// Configure external URL in BACKEND env as MANDI_API_URL (full base URL).
// This avoids CORS and allows using server-side API keys.

router.get('/prices', async (req, res) => {
    try {
        const base = normalizeBaseUrl(process.env.MANDI_API_URL || '');

        if (!base) {
            return res.status(500).json({ success: false, error: 'MANDI_API_URL not configured on server' });
        }

        if (looksLikeDataGovLandingPage(base)) {
            return res.status(400).json({
                success: false,
                error: 'MANDI_API_URL points to a data.gov.in page, not the API endpoint',
                details: 'Use the actual API endpoint, usually on https://api.data.gov.in/resource/<resource-id> with api-key and format=json.',
            });
        }

        // Prepare headers: optionally include API key from env
        const mandiApiKey = process.env.MANDI_API_KEY;
        const mandiApiKeyHeader = process.env.MANDI_API_KEY_HEADER || 'x-api-key';
        const apiKeyMode = (process.env.MANDI_API_KEY_MODE || 'header').toLowerCase();

        const timeoutMs = Number(process.env.MANDI_TIMEOUT_MS) || 30000; // default 30s

        const axiosConfig: any = {
            params: {
                ...req.query,
                ...(apiKeyMode === 'query' && mandiApiKey ? { 'api-key': mandiApiKey } : {}),
                ...(process.env.MANDI_FORCE_FORMAT_JSON !== 'false' ? { format: 'json' } : {}),
            },
            timeout: timeoutMs,
            headers: {},
        };

        if (mandiApiKey && apiKeyMode === 'header') {
            axiosConfig.headers[mandiApiKeyHeader] = mandiApiKey;
        }

        // Log request details to help debug network/timeouts
        console.log('Mandi proxy request ->', {
            base,
            params: req.query,
            timeoutMs,
            usingApiKey: Boolean(mandiApiKey),
            apiKeyMode,
        });

        // Forward query params to external API
        const response = await axios.get(base, axiosConfig);

        // Return the external API response body directly
        return res.status(response.status).json(response.data);
    } catch (err: any) {
        // Provide richer error details for diagnosis
        console.error('Mandi proxy error:', {
            message: err?.message,
            code: err?.code,
            status: err?.response?.status,
            headers: err?.response?.headers,
        });

        const details = err?.response?.data ?? err?.message ?? 'Unknown error';
        return res.status(502).json({ success: false, error: 'Failed to fetch mandi data', details });
    }
});

export default router;
