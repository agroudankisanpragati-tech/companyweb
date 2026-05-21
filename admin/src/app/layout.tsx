import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import { AdminProvider } from '@/components/admin/AdminProvider';

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'Kisan Unnati Admin',
  description: 'Admin dashboard for Kisan Unnati',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AdminProvider>{children}</AdminProvider>
      </body>
    </html>
  );
}