# Admin

This folder is reserved for the separate admin area of Kisan Unnati.

## Run

```bash
cd admin
npm install
npm run dev
```

Admin runs on `http://localhost:3001`.

For VPS/production, the admin panel is served at https://admin.agroudankisanpragati.com.

If you see a `ChunkLoadError` after switching branches or restarting servers, run:

```bash
npm run dev:clean
```

This removes the stale `.next` cache and starts a fresh dev server.

The panel talks to the backend API through `NEXT_PUBLIC_API_URL`.

Use `NEXT_PUBLIC_API_URL=https://api.agroudankisanpragati.com/api` in production.

Suggested structure:

- `src/` for admin pages and components
- `services/` for API calls
- `styles/` for admin-specific styling

Frontend and backend remain separate from this folder.