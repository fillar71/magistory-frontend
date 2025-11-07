"use client";
import { useState } from "react";
import Timeline from "@/components/Timeline.jsx";
import { searchMedia } from "@/utils/pexelsApi.js";

export default function EditorPage() {
  const [idea, setIdea] = useState("");
  const [duration, setDuration] = useState(30);
  const [aspect, setAspect] = useState("16:9");
  const [style, setStyle] = useState("Edukasi");
  const [script, setScript] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Ganti URL backend jika berbeda
  const backendURL =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://magistory-app-production.up.railway.app";

  async function handleGenerate() {
    if (!idea) {
      alert("Masukkan ide video terlebih dahulu!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // ✅ Wake up backend (Railway)
      await fetch(`${backendURL}/ping`).catch(() => {});

      // ✅ Request generate script ke backend
      const res = await fetch(`${backendURL}/api/generate-script`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ide: idea,
          durasi_total: duration,
          aspect_ratio: aspect,
          style: style,
        }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(`Gagal generate script (status ${res.status}): ${msg}`);
      }

      const data = await res.json();

      if (!data.adegan || !Array.isArray(data.adegan)) {
        throw new Error("Format respons dari server tidak sesuai.");
      }

      // ✅ Tambahkan media otomatis dari Pexels
      const enrichedScenes = await Promise.all(
        data.adegan.map(async (scene) => {
          if (!scene.deskripsi_visual) return { ...scene, media: [] };
          const visuals = await Promise.all(
            scene.deskripsi_visual.map((kw) => searchMedia(kw, 1))
          );
          return { ...scene, media: visuals.flat() };
        })
      );

      setScript({ ...data, adegan: enrichedScenes });
    } catch (err) {
      console.error("🔥 Error:", err);
      setError(err.message || "Terjadi kesalahan di sisi frontend.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-blue-100">
      {!script ? (
        <section className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 space-y-4 border border-gray-200">
          <h1 className="text-2xl font-bold text-center text-gray-800">
            🎬 Magistory Video Editor
          </h1>

          {error && (
            <div className="bg-red-100 text-red-700 text-sm p-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <input
              className="border border-gray-300 p-2 rounded w-full focus:ring focus:ring-blue-300 outline-none"
              placeholder="Masukkan ide video..."
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                className="border border-gray-300 p-2 rounded w-full focus:ring focus:ring-blue-300 outline-none"
                type="number"
                min="10"
                max="300"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Durasi total (detik)"
              />
              <input
                className="border border-gray-300 p-2 rounded w-full focus:ring focus:ring-blue-300 outline-none"
                value={aspect}
                onChange={(e) => setAspect(e.target.value)}
                placeholder="Aspect (16:9)"
              />
            </div>

            <input
              className="border border-gray-300 p-2 rounded w-full focus:ring focus:ring-blue-300 outline-none"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              placeholder="Gaya video (Edukasi, Cinematic, dll)"
            />

            <button
              onClick={handleGenerate}
              disabled={loading}
              className={`w-full py-2 rounded-lg text-white font-medium ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } transition-all`}
            >
              {loading ? "🔄 Menghasilkan..." : "✨ Generate Script"}
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-3">
            Gunakan ide seperti: <br />
            <em>"AI dalam pendidikan", "Dampak teknologi pada manusia"</em>
          </p>
        </section>
      ) : (
        <section className="w-full max-w-5xl bg-white shadow-xl rounded-xl p-6 mt-4">
          <Timeline
            scriptData={script}
            onSave={(data) => console.log("💾 Project disimpan:", data)}
            onRender={() =>
              alert("🎬 Render popup akan ditambahkan di versi berikutnya.")
            }
          />
        </section>
      )}
    </main>
  );
}
