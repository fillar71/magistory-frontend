"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-blue-50 to-white text-gray-800 p-6">
      <h1 className="text-4xl font-bold mb-4 text-blue-700 text-center">
        🎬 Magistory Instant Video
      </h1>
      <p className="text-lg text-center max-w-md mb-8">
        Buat video menarik secara instan dengan bantuan AI dan media otomatis
        dari Pexels. Cukup masukkan ide — biarkan Magistory yang bekerja!
      </p>
      <Link
        href="/editor"
        className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
      >
        Mulai Membuat Video
      </Link>
      <footer className="mt-12 text-gray-500 text-sm">
        © 2025 Magistory • Made with ❤️ by Filla Ramadan
      </footer>
    </main>
  );
}
