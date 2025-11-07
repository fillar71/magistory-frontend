"use client";

import { useState } from "react";
import Timeline from "../../components/Timeline";
import { searchMedia } from "../../utils/pexelsApi";

export default function EditorPage() {
  const [idea, setIdea] = useState("");
  const [duration, setDuration] = useState(30);
  const [aspect, setAspect] = useState("16:9");
  const [style, setStyle] = useState("Edukasi");
  const [script, setScript] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

      // Tambahkan media dari Pexels API
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
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      {!script ? (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 space-y-4">
          <h1 className="text-3xl font-bold text-center text-blue-700">
            Magistory Editor
          </h1>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <input
            className="border p-3 rounded-lg w-full focus:ring focus:ring-blue-200"
            placeholder="Masukkan ide video..."
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
          />

          <input
            className="border p-3 rounded-lg w-full"
            type="number"
            min="10"
            max="300"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Durasi total (detik)"
          />

          <input
            className="border p-3 rounded-lg w-full"
            value={aspect}
            onChange={(e) => setAspect(e.target.value)}
            placeholder="Aspect Ratio (misal 16:9)"
          />

          <input
            className="border p-3 rounded-lg w-full"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            placeholder="Gaya video (Edukasi, Cinematic, dll)"
          />

          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-medium transition ${
              loading
                ? "bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
            }`}
          >
            {loading ? "Menghasilkan..." : "✨ Generate Script"}
          </button>
        </div>
      ) : (
        <Timeline
          scriptData={script}
          onSave={(data) => console.log("💾 Project disimpan:", data)}
          onRender={() =>
            alert("🎬 Render popup akan ditambahkan di versi berikutnya.")
          }
        />
      )}
    </main>
  );
      }
