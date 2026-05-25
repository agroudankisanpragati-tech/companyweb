import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-lime-50 px-4">
      <div className="w-full max-w-xl rounded-[2rem] border border-emerald-100 bg-white/90 p-8 text-center shadow-2xl shadow-emerald-100/60 backdrop-blur">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-lime-500 text-2xl font-black text-white">
          404
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900">Page not found</h1>
        <p className="mt-3 text-sm text-gray-600">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/dashboard/farmer" className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">
            Go to farmer dashboard
          </Link>
          <Link href="/" className="rounded-xl border border-emerald-200 bg-white px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50">
            Go to home
          </Link>
        </div>
      </div>
    </main>
  );
}