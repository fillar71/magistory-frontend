"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <main className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
      <h1 className="text-4xl font-bold mb-4">🎬 Magistory Instant Video</h1>
      <p className="mb-6 text-lg">Ubah ide menjadi video siap pakai dalam hitungan detik!</p>
      <button
        onClick={() => router.push("/editor")}
        className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
      >
        Mulai Buat Video
      </button>
    </main>
  );
}
