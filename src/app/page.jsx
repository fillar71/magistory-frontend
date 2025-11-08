"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-700 mb-4">
        🎬 Magistory Instant Video
      </h1>
      <button
        onClick={() => router.push("/editor")}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Mulai Buat Video
      </button>
    </main>
  );
}
