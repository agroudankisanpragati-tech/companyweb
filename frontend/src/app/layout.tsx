import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Kisan Unnati - Smart Farming Platform",
  description: "AI-powered farming assistance for Indian farmers. Crop recommendations, marketplace, and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
